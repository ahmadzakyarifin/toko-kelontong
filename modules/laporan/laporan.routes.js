const express = require('express');
const router = express.Router();
const ctrl = require('./laporan.controller');
const { ensureAuth, requireRole } = require('../../middlewares/auth');

router.use(ensureAuth);
router.use(requireRole('admin'));
router.get('/', ctrl.index);
router.get('/transaksi', ctrl.listTransaksi);

module.exports = router;
