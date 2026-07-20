const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ctrl = require('./barang.controller');
const { ensureAuth, requireRole } = require('../../middlewares/auth');
const barangRepo = require('./barang.repository');

// Semua route butuh login; hanya admin yang boleh kelola barang
router.use(ensureAuth);
router.get('/', ctrl.index);
router.get('/create', requireRole('admin'), ctrl.showCreate);
router.post('/', requireRole('admin'), [
  body('kode')
    .trim()
    .notEmpty().withMessage('Kode barang wajib diisi')
    .isLength({ min: 2, max: 50 }).withMessage('Kode barang harus 2-50 karakter')
    .custom(async (value) => {
      const existing = await barangRepo.findByKode(value);
      if (existing) {
        throw new Error('Kode barang sudah digunakan, gunakan kode lain');
      }
      return true;
    }),
  body('nama')
    .trim()
    .notEmpty().withMessage('Nama barang wajib diisi')
    .isLength({ min: 2, max: 255 }).withMessage('Nama barang harus 2-255 karakter'),
  body('harga')
    .notEmpty().withMessage('Harga wajib diisi')
    .isFloat({ min: 0 }).withMessage('Harga harus angka >= 0'),
  body('stok')
    .notEmpty().withMessage('Stok wajib diisi')
    .isInt({ min: 0 }).withMessage('Stok harus bilangan bulat >= 0'),
  body('satuan')
    .trim()
    .notEmpty().withMessage('Satuan wajib diisi'),
  body('stok_minimum')
    .optional({ values: 'falsy' })
    .isInt({ min: 0 }).withMessage('Stok minimum harus bilangan bulat >= 0'),
], ctrl.store);
router.get('/:id/edit', requireRole('admin'), ctrl.showEdit);
router.post('/:id', requireRole('admin'), [
  body('nama')
    .trim()
    .notEmpty().withMessage('Nama barang wajib diisi')
    .isLength({ min: 2, max: 255 }).withMessage('Nama barang harus 2-255 karakter'),
  body('harga')
    .notEmpty().withMessage('Harga wajib diisi')
    .isFloat({ min: 0 }).withMessage('Harga harus angka >= 0'),
  body('stok')
    .notEmpty().withMessage('Stok wajib diisi')
    .isInt({ min: 0 }).withMessage('Stok harus bilangan bulat >= 0'),
  body('satuan')
    .trim()
    .notEmpty().withMessage('Satuan wajib diisi'),
  body('stok_minimum')
    .optional({ values: 'falsy' })
    .isInt({ min: 0 }).withMessage('Stok minimum harus bilangan bulat >= 0'),
], ctrl.update);
router.post('/:id/delete', requireRole('admin'), ctrl.destroy);

module.exports = router;
