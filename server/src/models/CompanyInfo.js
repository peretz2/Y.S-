const mongoose = require('mongoose');

// Single-document collection. Always read/write the document with key='default'.
const CompanyInfoSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'default', unique: true, immutable: true },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    nameEn: { type: String, default: '', trim: true, maxlength: 200 },
    tagline: { type: String, default: '', trim: true, maxlength: 280 },
    address: { type: String, default: '', trim: true, maxlength: 200 },
    postal: { type: String, default: '', trim: true, maxlength: 20 },
    phone: { type: String, default: '', trim: true, maxlength: 30 },
    phoneDisplay: { type: String, default: '', trim: true, maxlength: 40 },
    fax: { type: String, default: '', trim: true, maxlength: 30 },
    email: { type: String, default: '', trim: true, maxlength: 200, lowercase: true },
    hoursWeekdays: { type: String, default: '', trim: true, maxlength: 80 },
    hoursFriday: { type: String, default: '', trim: true, maxlength: 80 },
    founded: { type: Number, default: null, min: 1900, max: 2100 },
    whatsapp: { type: String, default: '', trim: true, maxlength: 30 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CompanyInfo', CompanyInfoSchema);
