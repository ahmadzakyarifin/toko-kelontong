const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ctrl = require('./barang.controller');
const { ensureAuth, requireRole } = require('../../middlewares/auth');

// Semua route butuh login; hanya admin yang boleh kelola barang
router.use(ensureAuth);
router.get('/', ctrl.index);
router.get('/create', requireRole('admin'), ctrl.showCreate);
router.post('/', requireRole('admin'), [
  body('kode').trim().notEmpty().withMessage('Kode wajib diisi'),
  body('nama').trim().notEmpty().withMessage('Nama barang wajib diisi'),
  body('harga').isFloat({ min: 0 }).withMessage('Harga harus angka >= 0'),
  body('stok').isInt({ min: 0 }).withMessage('Stok harus bilangan bulat >= 0'),
  body('satuan').trim().notEmpty().withMessage('Satuan wajib diisi'),
  body('stok_minimum').optional().isInt({ min: 0 }).withMessage('Stok minimum harus >= 0'),
], ctrl.store);
router.get('/:id/edit', requireRole('admin'), ctrl.showEdit);
router.post('/:id', requireRole('admin'), [
  body('nama').trim().notEmpty().withMessage('Nama barang wajib diisi'),
  body('harga').isFloat({ min: 0 }).withMessage('Harga harus angka >= 0'),
  body('stok').isInt({ min: 0 }).withMessage('Stok harus bilangan bulat >= 0'),
  body('satuan').trim().notEmpty().withMessage('Satuan wajib diisi'),
  body('stok_minimum').optional().isInt({ min: 0 }).withMessage('Stok minimum harus >= 0'),
], ctrl.update);
router.post('/:id/delete', requireRole('admin'), ctrl.destroy);

module.exports = router;
