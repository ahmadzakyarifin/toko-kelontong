// Controller Transaksi (kasir)
const transaksiService = require('./transaksi.service');
const barangService = require('../barang/barang.service');

const showKasir = async (req, res) => {
  try {
    const barangs = await barangService.list({ page: 1, perPage: 100 });
    res.render('transaksi/kasir', {
      title: 'Transaksi Penjualan',
      barangs: barangs.rows,
      flash: req.session.flash,
    });
    req.session.flash = null;
  } catch (err) {
    res.status(500).render('error', { title: 'Error', message: err.message });
  }
};

// API kecil: ambil info barang (dipakai JS di sisi client)
const apiBarang = async (req, res) => {
  try {
    const b = await barangService.get(req.params.id);
    res.json(b);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const processCheckout = async (req, res) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    const result = await transaksiService.checkout({
      user_id: req.session.user.id,
      items,
      bayar: req.body.bayar,
    });
    req.session.flash = { type: 'success', message: `Transaksi ${result.kode} berhasil.` };
    res.redirect(`/transaksi/struk/${result.transaksiId}`);
  } catch (err) {
    req.session.flash = { type: 'error', message: err.message };
    res.redirect('/transaksi');
  }
};

const showStruk = async (req, res) => {
  try {
    const { header, detail } = await transaksiService.getStruk(req.params.id);
    res.render('transaksi/struk', { title: 'Struk Belanja', header, detail }, { layout: false });
  } catch (err) {
    res.status(404).render('error', { title: 'Error', message: err.message });
  }
};

module.exports = { showKasir, apiBarang, processCheckout, showStruk };
