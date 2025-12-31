const mongoose = require('mongoose');

const cmsContentSchema = new mongoose.Schema({
    // Identifier
    key: { type: String, required: true, unique: true }, // e.g., "homepage_hero_title"
    section: { type: String, required: true }, // e.g., "homepage", "services", "contact"

    // Content
    title: { type: String },
    description: { type: String },
    content: { type: mongoose.Schema.Types.Mixed }, // Can store objects, arrays, strings

    // Media
    imageUrl: { type: String },
    videoUrl: { type: String },

    // SEO
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [{ type: String }],

    // Status
    isActive: { type: Boolean, default: true },

    // Audit
    lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

cmsContentSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('CMSContent', cmsContentSchema);
