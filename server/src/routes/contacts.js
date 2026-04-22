const express = require('express');
const { body, param } = require('express-validator');
const Contact = require('../models/Contact');
const { requireAuth } = require('../middleware/auth');
const { runValidators } = require('../middleware/validate');
const { sendContactEmail } = require('../utils/mailer');

const router = express.Router();

const idValidator = runValidators([param('id').isMongoId().withMessage('מזהה לא תקין')]);

router.post(
  '/',
  runValidators([
    body('name').isString().trim().isLength({ min: 2, max: 120 }).withMessage('שם חובה'),
    body('phone')
      .isString().trim().isLength({ min: 7, max: 32 })
      .matches(/^[0-9+\-\s()]+$/).withMessage('מספר טלפון לא תקין'),
    body('email').optional({ checkFalsy: true }).isEmail().withMessage('אימייל לא תקין').normalizeEmail(),
    body('subject').optional().isString().trim().isLength({ max: 200 }),
    body('message').isString().trim().isLength({ min: 2, max: 4000 }).withMessage('הודעה חובה'),
  ]),
  async (req, res, next) => {
    try {
      const { name, phone, email, subject, message } = req.body;
      const contact = await Contact.create({ name, phone, email, subject, message });
      try {
        const sent = await sendContactEmail(contact);
        if (sent) {
          contact.emailSent = true;
          await contact.save();
        }
      } catch (mailErr) {
        console.error('[contacts] email send failed:', mailErr.message);
      }
      res.status(201).json({ ok: true, id: contact._id });
    } catch (err) { next(err); }
  }
);

router.get('/', requireAuth, async (_req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) { next(err); }
});

router.patch('/:id/read', requireAuth, idValidator, async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!contact) return res.status(404).json({ error: 'לא נמצא' });
    res.json(contact);
  } catch (err) { next(err); }
});

router.delete('/:id', requireAuth, idValidator, async (req, res, next) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
