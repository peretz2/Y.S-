const express = require('express');
const { body } = require('express-validator');
const CompanyInfo = require('../models/CompanyInfo');
const { requireAuth } = require('../middleware/auth');
const { runValidators } = require('../middleware/validate');

const router = express.Router();

const DEFAULTS = {
  name: 'י.ש. מהנדסים בע״מ',
  nameEn: 'Y.SCH. Engineers Ltd',
  tagline: 'נגרות וחיפויים ברמה הגבוהה ביותר – מאז 2005',
  address: 'העמק 54, גבעת אלה',
  postal: '3657000',
  phone: '054-2201199',
  phoneDisplay: '054-220-1199',
  fax: '04-6415020',
  email: 'info@ys-engineers.co.il',
  hoursWeekdays: 'א׳–ה׳: 07:30–19:30',
  hoursFriday: 'ו׳: 09:00–13:00',
  founded: 2005,
  whatsapp: '',
};

async function getOrCreate() {
  let doc = await CompanyInfo.findOne({ key: 'default' });
  if (!doc) {
    doc = await CompanyInfo.create({ key: 'default', ...DEFAULTS });
  }
  return doc;
}

// public — anyone can read
router.get('/', async (_req, res, next) => {
  try {
    const info = await getOrCreate();
    res.json(info);
  } catch (err) { next(err); }
});

// admin only — update
router.put(
  '/',
  requireAuth,
  runValidators([
    body('name').isString().trim().isLength({ min: 1, max: 200 }).withMessage('שם החברה חובה'),
    body('nameEn').optional().isString().trim().isLength({ max: 200 }),
    body('tagline').optional().isString().trim().isLength({ max: 280 }),
    body('address').optional().isString().trim().isLength({ max: 200 }),
    body('postal').optional().isString().trim().isLength({ max: 20 }),
    body('phone').optional().isString().trim().isLength({ max: 30 }),
    body('phoneDisplay').optional().isString().trim().isLength({ max: 40 }),
    body('fax').optional().isString().trim().isLength({ max: 30 }),
    body('email').optional({ values: 'falsy' }).isEmail().withMessage('אימייל לא תקין').normalizeEmail(),
    body('hoursWeekdays').optional().isString().trim().isLength({ max: 80 }),
    body('hoursFriday').optional().isString().trim().isLength({ max: 80 }),
    body('founded').optional({ values: 'null' }).isInt({ min: 1900, max: 2100 }),
    body('whatsapp').optional().isString().trim().isLength({ max: 30 }),
  ]),
  async (req, res, next) => {
    try {
      const allowed = [
        'name', 'nameEn', 'tagline', 'address', 'postal', 'phone', 'phoneDisplay',
        'fax', 'email', 'hoursWeekdays', 'hoursFriday', 'founded', 'whatsapp',
      ];
      const update = {};
      for (const k of allowed) {
        if (req.body[k] !== undefined) update[k] = req.body[k];
      }
      const doc = await CompanyInfo.findOneAndUpdate(
        { key: 'default' },
        { $set: update, $setOnInsert: { key: 'default' } },
        { new: true, upsert: true, runValidators: true }
      );
      res.json(doc);
    } catch (err) { next(err); }
  }
);

module.exports = router;
module.exports.DEFAULTS = DEFAULTS;
