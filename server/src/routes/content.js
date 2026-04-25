const express = require('express');
const { body, param } = require('express-validator');
const SiteContent = require('../models/SiteContent');
const { requireAuth } = require('../middleware/auth');
const { runValidators } = require('../middleware/validate');

const router = express.Router();

const KEY_RE = /^[a-z0-9._-]+$/;

// Public — return all content as a flat key→value map.
router.get('/', async (_req, res, next) => {
  try {
    const docs = await SiteContent.find({}).select('key value');
    const map = {};
    for (const d of docs) map[d.key] = d.value;
    res.json(map);
  } catch (err) {
    next(err);
  }
});

// Public — return one entry by key.
router.get(
  '/:key',
  runValidators([param('key').matches(KEY_RE).withMessage('מפתח לא תקין')]),
  async (req, res, next) => {
    try {
      const doc = await SiteContent.findOne({ key: req.params.key });
      if (!doc) return res.status(404).json({ error: 'לא נמצא' });
      res.json({ key: doc.key, value: doc.value });
    } catch (err) {
      next(err);
    }
  }
);

// Auth — list with full metadata (for admin UI).
router.get('/admin/all', requireAuth, async (_req, res, next) => {
  try {
    const docs = await SiteContent.find({}).sort({ section: 1, key: 1 });
    res.json(docs);
  } catch (err) {
    next(err);
  }
});

// Auth — upsert one entry.
router.put(
  '/:key',
  requireAuth,
  runValidators([
    param('key').matches(KEY_RE).withMessage('מפתח לא תקין'),
    body('value').isString().isLength({ max: 8000 }),
    body('section').optional().isString().trim().isLength({ max: 80 }),
    body('label').optional().isString().trim().isLength({ max: 200 }),
    body('multiline').optional().isBoolean(),
    body('description').optional().isString().trim().isLength({ max: 500 }),
    body('previewType').optional().isString().trim().isLength({ max: 50 }),
    body('previewPath').optional().isString().trim().isLength({ max: 200 }),
  ]),
  async (req, res, next) => {
    try {
      const update = {
        value: req.body.value,
        updatedBy: req.user.sub,
      };
      if (req.body.section !== undefined) update.section = req.body.section;
      if (req.body.label !== undefined) update.label = req.body.label;
      if (req.body.multiline !== undefined) update.multiline = req.body.multiline;
      if (req.body.description !== undefined) update.description = req.body.description;
      if (req.body.previewType !== undefined) update.previewType = req.body.previewType;
      if (req.body.previewPath !== undefined) update.previewPath = req.body.previewPath;
      const doc = await SiteContent.findOneAndUpdate(
        { key: req.params.key },
        { $set: update, $setOnInsert: { key: req.params.key } },
        { new: true, upsert: true, runValidators: true }
      );
      res.json(doc);
    } catch (err) {
      if (err.code === 11000) return res.status(409).json({ error: 'מפתח כבר קיים' });
      next(err);
    }
  }
);

// Auth — bulk upsert (PATCH /).
router.patch(
  '/',
  requireAuth,
  async (req, res, next) => {
    try {
      const items = Array.isArray(req.body) ? req.body : [];
      if (!items.length) return res.json({ ok: true, count: 0 });
      const ops = [];
      for (const it of items) {
        if (!it || typeof it.key !== 'string' || !KEY_RE.test(it.key)) continue;
        if (typeof it.value !== 'string' || it.value.length > 8000) continue;
        ops.push({
          updateOne: {
            filter: { key: it.key },
            update: {
              $set: { value: it.value, updatedBy: req.user.sub },
              $setOnInsert: { key: it.key },
            },
            upsert: true,
          },
        });
      }
      if (ops.length) await SiteContent.bulkWrite(ops, { ordered: false });
      res.json({ ok: true, count: ops.length });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
