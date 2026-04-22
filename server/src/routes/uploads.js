const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');
const multer = require('multer');
const sharp = require('sharp');
const rateLimit = require('express-rate-limit');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const MAX_BYTES = Number(process.env.UPLOAD_MAX_BYTES) || 5 * 1024 * 1024;
const UPLOAD_DIR = path.resolve(__dirname, '..', '..', process.env.UPLOAD_DIR || 'uploads');
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter(_req, file, cb) {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error('סוג קובץ לא נתמך (רק JPEG, PNG או WebP)'));
    }
    cb(null, true);
  },
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

async function ensureDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

router.post(
  '/image',
  uploadLimiter,
  requireAuth,
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        const msg = err.code === 'LIMIT_FILE_SIZE'
          ? `הקובץ גדול מדי (מקסימום ${Math.round(MAX_BYTES / 1024 / 1024)}MB)`
          : err.message;
        return res.status(400).json({ error: msg });
      }
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  },
  async (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'לא נבחר קובץ' });

      const meta = await sharp(req.file.buffer).metadata();
      if (!meta.format || !['jpeg', 'png', 'webp'].includes(meta.format)) {
        return res.status(400).json({ error: 'הקובץ אינו תמונה תקינה' });
      }

      const buffer = await sharp(req.file.buffer)
        .rotate()
        .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();

      await ensureDir();
      const name = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.webp`;
      const absPath = path.join(UPLOAD_DIR, name);
      if (!absPath.startsWith(UPLOAD_DIR + path.sep)) {
        return res.status(400).json({ error: 'שגיאה בשם הקובץ' });
      }
      await fs.writeFile(absPath, buffer);

      res.status(201).json({ url: `/uploads/${name}`, size: buffer.length });
    } catch (err) { next(err); }
  }
);

router.delete('/image', requireAuth, async (req, res, next) => {
  try {
    const url = String(req.query.url || '');
    if (!url.startsWith('/uploads/')) {
      return res.status(400).json({ error: 'כתובת לא תקינה' });
    }
    const name = path.basename(url);
    if (!/^[\w.-]+$/.test(name)) {
      return res.status(400).json({ error: 'שם קובץ לא תקין' });
    }
    const absPath = path.join(UPLOAD_DIR, name);
    if (!absPath.startsWith(UPLOAD_DIR + path.sep)) {
      return res.status(400).json({ error: 'נתיב לא תקין' });
    }
    try {
      await fs.unlink(absPath);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
    res.json({ ok: true });
  } catch (err) { next(err); }
});

module.exports = router;
