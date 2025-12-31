const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { uploadDocument } = require('../middleware/upload');
const { cloudinary } = require('../middleware/upload');
const { notifyDocumentVerified, notifyDocumentRejected } = require('../utils/notificationHelper');

// POST /api/documents/upload - Upload document
router.post('/upload', protect, uploadDocument.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { type, ownerModel, ownerId, expiryDate } = req.body;

        const document = await Document.create({
            owner: ownerId || req.user.id,
            ownerModel: ownerModel || 'User',
            type,
            fileUrl: req.file.path,
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
            publicId: req.file.filename,
            expiryDate,
            uploadedBy: req.user.id
        });

        res.status(201).json({ message: 'Document uploaded successfully', document });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/documents/user/:id - Get user documents
router.get('/user/:id', protect, async (req, res) => {
    try {
        const documents = await Document.find({
            owner: req.params.id,
            ownerModel: 'User'
        }).sort({ createdAt: -1 });

        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/documents/vehicle/:id - Get vehicle documents
router.get('/vehicle/:id', protect, async (req, res) => {
    try {
        const documents = await Document.find({
            owner: req.params.id,
            ownerModel: 'Vehicle'
        }).sort({ createdAt: -1 });

        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/documents/pending - Get all pending documents (Admin only)
router.get('/pending', protect, isAdmin, async (req, res) => {
    try {
        const documents = await Document.find({ verificationStatus: 'pending' })
            .populate('owner', 'name email companyName')
            .populate('uploadedBy', 'name')
            .sort({ createdAt: -1 });

        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/documents/:id/verify - Verify document (Admin only)
router.put('/:id/verify', protect, isAdmin, async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;

        const document = await Document.findById(req.params.id)
            .populate('owner', 'name');

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        document.verificationStatus = status;
        document.verifiedBy = req.user.id;
        document.verifiedAt = Date.now();

        if (status === 'rejected' && rejectionReason) {
            document.rejectionReason = rejectionReason;
        }

        await document.save();

        // Send notification
        if (status === 'verified') {
            await notifyDocumentVerified(document.owner._id, document.type);
        } else if (status === 'rejected') {
            await notifyDocumentRejected(document.owner._id, document.type, rejectionReason);
        }

        res.json({ message: `Document ${status}`, document });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/documents/:id - Delete document
router.delete('/:id', protect, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Check authorization
        if (document.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Delete from Cloudinary
        if (document.publicId) {
            await cloudinary.uploader.destroy(document.publicId);
        }

        await document.deleteOne();
        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
