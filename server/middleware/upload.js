const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage configuration for documents (licenses, insurance, etc.)
const documentStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'loadboard/documents',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
        resource_type: 'auto'
    }
});

// Storage configuration for proof of delivery images
const podStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'loadboard/pod',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    }
});

// Storage configuration for profile/vehicle images
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'loadboard/images',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});

// Multer configurations
const uploadDocument = multer({
    storage: documentStorage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const uploadPOD = multer({
    storage: podStorage,
    limits: { fileSize: 3 * 1024 * 1024 } // 3MB limit
});

const uploadImage = multer({
    storage: imageStorage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

module.exports = {
    cloudinary,
    uploadDocument,
    uploadPOD,
    uploadImage
};
