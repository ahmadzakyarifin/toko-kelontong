// Service Transaksi - aturan bisnis penting (validasi, stok, total, kembalian)
const { db } = require('../../config/db');
const repo = require('./transaksi.repository');
const barangRepo = require('../barang/barang.repository');
const { generateKode } = require('../../helpers/format');

// items: [{ barang_id, qty }]
const checkout = async ({ user_id, items, bayar }) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Keranjang kosong, tidak ada barang dipilih');
  }
  const parsedItems = [];
  let total = 0;

  for (const it of items) {
    const barang = await barangRepo.findById(it.barang_id);
    if (!barang) throw new Error(`Barang id ${it.barang_id} tidak ditemukan`);
    const qty = parseInt(it.qty, 10);
    if (!Number.isInteger(qty) || qty <= 0) {
      throw new Error(`Jumlah beli untuk "${barang.nama}" harus bilangan bulat > 0`);
    }
    if (barang.stok < qty) {
      throw new Error(`Stok "${barang.nama}" tidak cukup (tersisa ${barang.stok})`);
    }
    const subtotal = Number(barang.harga) * qty;
    total += subtotal;
    parsedItems.push({
      barang_id: barang.id,
      kode_barang: barang.kode,
      nama_barang: barang.nama,
      harga: barang.harga,
      qty,
      subtotal,
    });
  }

  const bayarNum = Number(bayar);
  if (!Number.isFinite(bayarNum) || bayarNum < total) {
    throw new Error(`Uang bayar kurang. Total ${total}, dibayar ${bayarNum}`);
  }
  const kembalian = bayarNum - total;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const kode = generateKode('TRX');
    const transaksiId = await repo.createTransaksi(conn, {
      kode, user_id, total, bayar: bayarNum, kembalian, items: parsedItems,
    });
    await conn.commit();
    return { transaksiId, kode, total, bayar: bayarNum, kembalian };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

const getStruk = async (id) => {
  const header = await repo.findById(id);
  if (!header) throw new Error('Transaksi tidak ditemukan');
  const detail = await repo.getDetail(id);
  return { header, detail };
};

const listToday = () => repo.listToday();

module.exports = { checkout, getStruk, listToday };
