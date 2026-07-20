// Service Laporan - agregat transaksi
const { db } = require('../../config/db');

const harian = async () => {
  const [rows] = await db.query(`
    SELECT DATE(created_at) AS tanggal, COUNT(*) AS jumlah_transaksi, SUM(total) AS total_pendapatan
    FROM transaksi
    GROUP BY DATE(created_at)
    ORDER BY tanggal DESC
    LIMIT 14
  `);
  return rows;
};

const ringkasanHariIni = async () => {
  const [[row]] = await db.query(`
    SELECT COUNT(*) AS jumlah_transaksi, COALESCE(SUM(total),0) AS total_pendapatan
    FROM transaksi WHERE DATE(created_at) = CURDATE()
  `);
  return row;
};

const listTransaksi = async ({ from, to }) => {
  let where = '';
  const params = [];
  if (from && to) {
    where = 'WHERE DATE(created_at) BETWEEN ? AND ?';
    params.push(from, to);
  }
  const [rows] = await db.query(`
    SELECT t.*, u.nama AS nama_kasir FROM transaksi t
    JOIN users u ON u.id = t.user_id
    ${where}
    ORDER BY t.created_at DESC
    LIMIT 200
  `, params);
  return rows;
};

module.exports = { harian, ringkasanHariIni, listTransaksi };
