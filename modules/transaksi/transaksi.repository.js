// Repository Transaksi (header + detail), jalanin dalam 1 transaksi DB
const { db } = require('../../config/db');

const createTransaksi = async (conn, { kode, user_id, total, bayar, kembalian, items }) => {
  const [result] = await conn.query(
    'INSERT INTO transaksi(kode, user_id, total, bayar, kembalian) VALUES (?, ?, ?, ?, ?)',
    [kode, user_id, total, bayar, kembalian]
  );
  const transaksiId = result.insertId;
  for (const it of items) {
    await conn.query(
      'INSERT INTO transaksi_detail(transaksi_id, barang_id, kode_barang, nama_barang, harga, qty, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [transaksiId, it.barang_id, it.kode_barang, it.nama_barang, it.harga, it.qty, it.subtotal]
    );
    await conn.query('UPDATE barang SET stok = stok - ? WHERE id = ? AND stok >= ?', [it.qty, it.barang_id, it.qty]);
  }
  return transaksiId;
};

const findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM transaksi WHERE id = ?', [id]);
  return rows[0];
};

const getDetail = async (transaksiId) => {
  const [rows] = await db.query('SELECT * FROM transaksi_detail WHERE transaksi_id = ?', [transaksiId]);
  return rows;
};

const listToday = async () => {
  const [rows] = await db.query(
    `SELECT t.*, u.nama AS nama_kasir FROM transaksi t
     JOIN users u ON u.id = t.user_id
     WHERE DATE(t.created_at) = CURDATE()
     ORDER BY t.created_at DESC`
  );
  return rows;
};

module.exports = { createTransaksi, findById, getDetail, listToday };
