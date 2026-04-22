const express = require('express');
const { body, param } = require('express-validator');
const Service = require('../models/Service');
const { requireAuth } = require('../middleware/auth');
const { runValidators } = require('../middleware/validate');

const router = express.Router();

const idValidator = runValidators([param('id').isMongoId().withMessage('מזהה לא תקין')]);

const bodyValidator = runValidators([
  body('title').isString().trim().isLength({ min: 2, max: 120 }).withMessage('שם חובה (עד 120 תווים)'),
  body('slug')
    .isString().trim().isLength({ min: 2, max: 80 })
    .matches(/^[a-z0-9-]+$/).withMessage('Slug באותיות קטנות, ספרות ומקפים בלבד'),
  body('icon').optional().isString().isLength({ max: 8 }),
  body('shortDescription').isString().trim().isLength({ min: 2, max: 280 }).withMessage('תיאור קצר חובה'),
  body('description').isString().trim().isLength({ min: 2, max: 4000 }).withMessage('תיאור מלא חובה'),
  body('order').optional().isInt({ min: 0, max: 9999 }),
  body('isActive').optional().isBoolean(),
]);

router.get('/', async (_req, res, next) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(services);
  } catch (err) { next(err); }
});

router.get('/all', requireAuth, async (_req, res, next) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: 1 });
    res.json(services);
  } catch (err) { next(err); }
});

router.get('/:id', idValidator, async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'לא נמצא' });
    res.json(service);
  } catch (err) { next(err); }
});

router.post('/', requireAuth, bodyValidator, async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Slug כבר קיים' });
    next(err);
  }
});

router.put('/:id', requireAuth, idValidator, bodyValidator, async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).json({ error: 'לא נמצא' });
    res.json(service);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Slug כבר קיים' });
    next(err);
  }
});

router.delete('/:id', requireAuth, idValidator, async (req, res, next) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
