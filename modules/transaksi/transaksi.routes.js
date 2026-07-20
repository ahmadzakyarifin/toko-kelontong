const express = require('express');
const router = express.Router();
const ctrl = require('./transaksi.controller');
const { ensureAuth } = require('../../middlewares/auth');

// Semua route butuh login; transaksi bisa diakses kasir & admin
router.use(ensureAuth);
router.get('/', ctrl.showKasir);
router.get('/barang/:id', ctrl.apiBarang);          // API info barang (JSON)
router.post('/checkout', ctrl.processCheckout);     // dipanggil dari form kasir
router.get('/struk/:id', ctrl.showStruk);           // halaman struk (printable)

module.exports = router;
