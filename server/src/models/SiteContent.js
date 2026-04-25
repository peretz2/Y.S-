const mongoose = require('mongoose');

// Key/value store for editable site copy.
// Keys are dot-separated paths, e.g. "home.hero.line1" or "nav.home".
// Values are short strings (titles, labels) or longer paragraphs.
const SiteContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 200,
      match: /^[a-z0-9._-]+$/,
    },
    value: {
      type: String,
      default: '',
      maxlength: 8000,
    },
    section: {
      type: String,
      default: '',
      trim: true,
      maxlength: 80,
    },
    label: {
      type: String,
      default: '',
      trim: true,
      maxlength: 200,
    },
    multiline: { type: Boolean, default: false },
    description: { type: String, default: '' },
    previewType: { type: String, default: 'plain' },
    previewPath: { type: String, default: '/' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

SiteContentSchema.index({ section: 1, key: 1 });

module.exports = mongoose.model('SiteContent', SiteContentSchema);
