// 004_create_transaksi_detail.js
// Detail item per transaksi + riwayat stok
exports.up = async (conn) => {
  await conn.query(`
    CREATE TABLE transaksi_detail (
      id INT AUTO_INCREMENT PRIMARY KEY,
      transaksi_id INT NOT NULL,
      barang_id INT NOT NULL,
      kode_barang VARCHAR(50) NOT NULL,
      nama_barang VARCHAR(150) NOT NULL,
      harga DECIMAL(12,2) NOT NULL DEFAULT 0,
      qty INT NOT NULL DEFAULT 1,
      subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
      FOREIGN KEY (transaksi_id) REFERENCES transaksi(id) ON DELETE CASCADE,
      FOREIGN KEY (barang_id) REFERENCES barang(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};
