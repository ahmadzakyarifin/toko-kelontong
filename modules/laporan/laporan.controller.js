// Controller Laporan (admin)
const laporanService = require('./laporan.service');
const transaksiService = require('../transaksi/transaksi.service');

const index = async (req, res) => {
  try {
    const ringkasan = await laporanService.ringkasanHariIni();
    const harian = await laporanService.harian();
    res.render('laporan/index', {
      title: 'Laporan Penjualan',
      ringkasan,
      harian,
      flash: req.session.flash,
    });
    req.session.flash = null;
  } catch (err) {
    res.status(500).render('error', { title: 'Error', message: err.message });
  }
};

const listTransaksi = async (req, res) => {
  try {
    const { from, to } = req.query;
    const rows = await laporanService.listTransaksi({ from, to });
    res.render('laporan/transaksi', { title: 'Daftar Transaksi', rows, from, to });
  } catch (err) {
    res.status(500).render('error', { title: 'Error', message: err.message });
  }
};

module.exports = { index, listTransaksi };
