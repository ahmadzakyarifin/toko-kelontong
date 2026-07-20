// Repository Barang
const { db } = require('../../config/db');

const list = async ({ search = '', page = 1, perPage = 10 } = {}) => {
  const offset = (page - 1) * perPage;
  const params = [];
  let where = '';
  if (search) {
    where = 'WHERE kode LIKE ? OR nama LIKE ?';
    params.push(`%${search}%`, `%${search}%`);
  }
  const [rows] = await db.query(
    `SELECT * FROM barang ${where} ORDER BY nama ASC LIMIT ? OFFSET ?`,
    [...params, perPage, offset]
  );
  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM barang ${where}`,
    params
  );
  return { rows, total, page, perPage };
};

const findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM barang WHERE id = ?', [id]);
  return rows[0];
};

const findByKode = async (kode) => {
  const [rows] = await db.query('SELECT * FROM barang WHERE kode = ?', [kode]);
  return rows[0];
};

const create = async ({ kode, nama, harga, stok, satuan, stok_minimum }) => {
  const [result] = await db.query(
    'INSERT INTO barang(kode, nama, harga, stok, satuan, stok_minimum) VALUES (?, ?, ?, ?, ?, ?)',
    [kode, nama, harga, stok, satuan, stok_minimum]
  );
  return result.insertId;
};

const update = async (id, { nama, harga, stok, satuan, stok_minimum }) => {
  await db.query(
    'UPDATE barang SET nama=?, harga=?, stok=?, satuan=?, stok_minimum=? WHERE id=?',
    [nama, harga, stok, satuan, stok_minimum, id]
  );
};

const remove = async (id) => {
  await db.query('DELETE FROM barang WHERE id = ?', [id]);
};

// Update stok (dipakai saat transaksi)
const kurangiStok = async (id, qty) => {
  await db.query('UPDATE barang SET stok = stok - ? WHERE id = ? AND stok >= ?', [qty, id, qty]);
  const [rows] = await db.query('SELECT stok FROM barang WHERE id = ?', [id]);
  return rows[0] ? rows[0].stok : 0;
};

const listStokMenipis = async () => {
  const [rows] = await db.query('SELECT * FROM barang WHERE stok <= stok_minimum ORDER BY stok ASC');
  return rows;
};

module.exports = { list, findById, findByKode, create, update, remove, kurangiStok, listStokMenipis };
