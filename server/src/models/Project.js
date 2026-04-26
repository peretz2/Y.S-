const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    category: { type: String, default: 'כללי' },
    location: { type: String, default: '' },
    year: { type: Number },
    summary: { type: String, default: '' },
    description: { type: String, default: '' },
    images: {
      type: [{
        url: { type: String, required: true },
        caption: { type: String, default: '' },
        order: { type: Number, default: 0 },
      }],
      default: [],
    },
    // kept for backwards compatibility — synced from images[0] via pre-save hook
    imageUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProjectSchema.pre('save', function (next) {
  if (this.images && this.images.length > 0) {
    const sorted = [...this.images].sort((a, b) => (a.order || 0) - (b.order || 0));
    this.imageUrl = sorted[0].url || '';
  } else if (!this.imageUrl) {
    this.imageUrl = '';
  }
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);
