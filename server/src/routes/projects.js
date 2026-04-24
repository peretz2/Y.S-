const express = require('express');
const { body, param } = require('express-validator');
const Project = require('../models/Project');
const { requireAuth } = require('../middleware/auth');
const { runValidators } = require('../middleware/validate');

const router = express.Router();

const idValidator = runValidators([param('id').isMongoId().withMessage('מזהה לא תקין')]);

function isSafeImageUrl(value) {
  if (!value) return true;
  if (value.startsWith('/uploads/')) return true;
  try {
    const u = new URL(value);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch (_err) {
    return false;
  }
}

const bodyValidator = runValidators([
  body('title').isString().trim().isLength({ min: 2, max: 160 }).withMessage('שם חובה (עד 160 תווים)'),
  body('slug')
    .isString().trim().isLength({ min: 2, max: 80 })
    .matches(/^[a-z0-9-]+$/).withMessage('Slug באותיות קטנות, ספרות ומקפים בלבד'),
  body('category').optional().isString().trim().isLength({ max: 80 }),
  body('location').optional().isString().trim().isLength({ max: 120 }),
  body('year').optional({ nullable: true }).isInt({ min: 1900, max: 2100 }),
  body('summary').optional().isString().trim().isLength({ max: 400 }),
  body('description').optional().isString().trim().isLength({ max: 8000 }),
  body('imageUrl')
    .optional({ nullable: true })
    .isString().isLength({ max: 2048 })
    .custom(isSafeImageUrl).withMessage('כתובת תמונה לא תקינה'),
  body('order').optional().isInt({ min: 0, max: 9999 }),
  body('isFeatured').optional().isBoolean(),
]);

router.get('/', async (_req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, year: -1, createdAt: -1 });
    res.json(projects);
  } catch (err) { next(err); }
});

router.get('/:id', idValidator, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'לא נמצא' });
    res.json(project);
  } catch (err) { next(err); }
});

router.post('/', requireAuth, bodyValidator, async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Slug כבר קיים' });
    next(err);
  }
});

router.put('/:id', requireAuth, idValidator, bodyValidator, async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ error: 'לא נמצא' });
    res.json(project);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Slug כבר קיים' });
    next(err);
  }
});

router.delete('/:id', requireAuth, idValidator, async (req, res, next) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
