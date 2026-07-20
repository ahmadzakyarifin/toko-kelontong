// Controller Barang
const { validationResult } = require('express-validator');
const barangService = require('./barang.service');

const index = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page || '1', 10);
    const result = await barangService.list({ search, page, perPage: 10 });
    res.render('barang/index', {
      title: 'Data Barang',
      ...result,
      search,
      flash: req.session.flash,
    });
    req.session.flash = null;
  } catch (err) {
    res.status(500).render('error', { title: 'Error', message: err.message });
  }
};

const showCreate = (req, res) => {
  res.render('barang/form', { title: 'Tambah Barang', barang: {}, error: null, action: '/barang', method: 'POST' });
};

const store = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('barang/form', {
      title: 'Tambah Barang',
      barang: req.body,
      error: errors.array().map(e => e.msg).join(', '),
      action: '/barang',
      method: 'POST',
    });
  }
  try {
    await barangService.create(req.body);
    req.session.flash = { type: 'success', message: 'Barang berhasil ditambahkan.' };
    res.redirect('/barang');
  } catch (err) {
    res.status(400).render('barang/form', {
      title: 'Tambah Barang',
      barang: req.body,
      error: err.message,
      action: '/barang',
      method: 'POST',
    });
  }
};

const showEdit = async (req, res) => {
  try {
    const barang = await barangService.get(req.params.id);
    res.render('barang/form', { title: 'Edit Barang', barang, error: null, action: `/barang/${barang.id}?_method=PUT`, method: 'POST' });
  } catch (err) {
    res.status(404).render('error', { title: 'Error', message: err.message });
  }
};

const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('barang/form', {
      title: 'Edit Barang',
      barang: { ...req.body, id: req.params.id },
      error: errors.array().map(e => e.msg).join(', '),
      action: `/barang/${req.params.id}?_method=PUT`,
      method: 'POST',
    });
  }
  try {
    await barangService.update(req.params.id, req.body);
    req.session.flash = { type: 'success', message: 'Barang berhasil diperbarui.' };
    res.redirect('/barang');
  } catch (err) {
    res.status(400).render('barang/form', {
      title: 'Edit Barang',
      barang: { ...req.body, id: req.params.id },
      error: err.message,
      action: `/barang/${req.params.id}?_method=PUT`,
      method: 'POST',
    });
  }
};

const destroy = async (req, res) => {
  try {
    await barangService.remove(req.params.id);
    req.session.flash = { type: 'success', message: 'Barang berhasil dihapus.' };
  } catch (err) {
    req.session.flash = { type: 'error', message: err.message };
  }
  res.redirect('/barang');
};

module.exports = { index, showCreate, store, showEdit, update, destroy };
