const express = require('express');
const Contact = require('../models/Contact');
const { requireAuth } = require('../middleware/auth');
const { sendContactEmail } = require('../utils/mailer');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, phone, email, subject, message } = req.body || {};
    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'נא למלא שם, טלפון והודעה' });
    }
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
});

router.get('/', requireAuth, async (_req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) { next(err); }
});

router.patch('/:id/read', requireAuth, async (req, res, next) => {
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

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
