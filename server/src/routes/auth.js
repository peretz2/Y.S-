const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { requireAuth, setAuthCookie, clearAuthCookie } = require('../middleware/auth');
const { runValidators } = require('../middleware/validate');
const { generateResetToken, hashToken } = require('../utils/tokens');
const { sendPasswordResetEmail } = require('../utils/mailer');

const router = express.Router();

const MAX_FAILED_LOGINS = 5;
const LOCK_MINUTES = 15;
const RESET_TTL_MS = 60 * 60 * 1000;

const PASSWORD_RULES = 'הסיסמה חייבת להכיל לפחות 8 תווים, לרבות אות גדולה, אות קטנה וספרה';
const passwordValidator = (field) =>
  body(field)
    .isString()
    .isLength({ min: 8, max: 128 })
    .withMessage(PASSWORD_RULES)
    .matches(/[a-z]/).withMessage(PASSWORD_RULES)
    .matches(/[A-Z]/).withMessage(PASSWORD_RULES)
    .matches(/[0-9]/).withMessage(PASSWORD_RULES);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'יותר מדי ניסיונות כניסה. נסו שוב מאוחר יותר.' },
});

const forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'יותר מדי בקשות. נסו שוב בעוד שעה.' },
});

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

router.post(
  '/login',
  loginLimiter,
  runValidators([
    body('email').isEmail().withMessage('אימייל לא תקין').normalizeEmail(),
    body('password').isString().isLength({ min: 1, max: 128 }).withMessage('סיסמה נדרשת'),
  ]),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select(
        '+passwordHash +failedLoginCount +lockUntil'
      );
      const genericError = { status: 401, error: 'אימייל או סיסמה שגויים' };

      if (!user) return res.status(genericError.status).json({ error: genericError.error });

      if (user.isLocked()) {
        return res.status(423).json({
          error: 'החשבון נעול זמנית עקב ניסיונות כושלים. נסו שוב מאוחר יותר.',
        });
      }

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) {
        user.failedLoginCount = (user.failedLoginCount || 0) + 1;
        if (user.failedLoginCount >= MAX_FAILED_LOGINS) {
          user.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
          user.failedLoginCount = 0;
        }
        await user.save();
        return res.status(genericError.status).json({ error: genericError.error });
      }

      user.failedLoginCount = 0;
      user.lockUntil = null;
      await user.save();

      const token = signToken(user);
      setAuthCookie(res, token);
      res.json({ user: { email: user.email, role: user.role } });
    } catch (err) {
      next(err);
    }
  }
);

router.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.sub);
    if (!user) {
      clearAuthCookie(res);
      return res.status(401).json({ error: 'לא מורשה' });
    }
    res.json({ user: { email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/forgot-password',
  forgotLimiter,
  runValidators([body('email').isEmail().withMessage('אימייל לא תקין').normalizeEmail()]),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        const { raw, hash } = generateResetToken();
        user.passwordResetTokenHash = hash;
        user.passwordResetExpires = new Date(Date.now() + RESET_TTL_MS);
        await user.save();
        const base = process.env.PUBLIC_URL || process.env.CLIENT_ORIGIN || 'http://localhost:5173';
        const resetUrl = `${base.replace(/\/$/, '')}/admin/reset-password?token=${raw}`;
        try {
          await sendPasswordResetEmail({ to: user.email, resetUrl });
        } catch (mailErr) {
          console.error('[auth] reset email failed:', mailErr.message);
        }
      }
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/reset-password',
  runValidators([
    body('token').isString().isLength({ min: 32, max: 256 }).withMessage('טוקן לא תקין'),
    passwordValidator('password'),
  ]),
  async (req, res, next) => {
    try {
      const { token, password } = req.body;
      const tokenHash = hashToken(token);
      const user = await User.findOne({
        passwordResetTokenHash: tokenHash,
        passwordResetExpires: { $gt: new Date() },
      }).select('+passwordResetTokenHash +passwordResetExpires');
      if (!user) {
        return res.status(400).json({ error: 'הקישור אינו בתוקף. בקשו קישור חדש.' });
      }
      user.passwordHash = await bcrypt.hash(password, 12);
      user.passwordResetTokenHash = null;
      user.passwordResetExpires = null;
      user.passwordChangedAt = new Date();
      user.failedLoginCount = 0;
      user.lockUntil = null;
      await user.save();
      clearAuthCookie(res);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/change-password',
  requireAuth,
  runValidators([
    body('currentPassword').isString().isLength({ min: 1, max: 128 }).withMessage('נדרשת סיסמה נוכחית'),
    passwordValidator('newPassword'),
  ]),
  async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.sub).select('+passwordHash');
      if (!user) return res.status(401).json({ error: 'לא מורשה' });
      const ok = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!ok) return res.status(400).json({ error: 'הסיסמה הנוכחית שגויה' });
      if (currentPassword === newPassword) {
        return res.status(400).json({ error: 'הסיסמה החדשה חייבת להיות שונה מהנוכחית' });
      }
      user.passwordHash = await bcrypt.hash(newPassword, 12);
      user.passwordChangedAt = new Date();
      await user.save();
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
