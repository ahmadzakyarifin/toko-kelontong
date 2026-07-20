require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// ---------- View engine: EJS ----------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---------- Middleware ----------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'ganti-dengan-string-acak',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 }, // 8 jam
}));

// Method override sederhana via query ?_method=PUT/DELETE (karena form HTML hanya GET/POST)
app.use((req, res, next) => {
  if (req.method === 'POST' && req.query._method) {
    req.method = req.query._method.toUpperCase();
  }
  next();
});

// Flash message ke semua view
app.use((req, res, next) => {
  res.locals.flash = req.session.flash || null;
  res.locals.user = req.session.user || null;
  res.locals.formatRupiah = require('./helpers/format').formatRupiah;
  next();
});

// ---------- Routes (MVC modules) ----------
app.use('/auth', require('./modules/auth/auth.routes'));
app.use('/barang', require('./modules/barang/barang.routes'));
app.use('/transaksi', require('./modules/transaksi/transaksi.routes'));
app.use('/laporan', require('./modules/laporan/laporan.routes'));

// Dashboard (root)
const { ensureAuth } = require('./middlewares/auth');
const barangService = require('./modules/barang/barang.service');
const laporanService = require('./modules/laporan/laporan.service');
app.get('/', ensureAuth, async (req, res) => {
  try {
    const user = req.session.user;
    let stokMenipis = [];
    let ringkasan = null;
    if (user.role === 'admin') {
      stokMenipis = await barangService.stokMenipis();
      ringkasan = await laporanService.ringkasanHariIni();
    }
    res.render('dashboard', {
      title: 'Dashboard',
      stokMenipis,
      ringkasan,
      flash: req.session.flash,
    });
    req.session.flash = null;
  } catch (err) {
    res.status(500).render('error', { title: 'Error', message: err.message });
  }
});

// 404
app.use((req, res) => {
  res.status(404).render('error', { title: '404', message: 'Halaman tidak ditemukan' });
});

app.listen(PORT, () => {
  console.log(`Aplikasi kasir jalan di http://localhost:${PORT}`);
});

module.exports = app;
