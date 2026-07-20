// 003_create_transaksi.js
// Header transaksi penjualan
exports.up = async (conn) => {
  await conn.query(`
    CREATE TABLE transaksi (
      id INT AUTO_INCREMENT PRIMARY KEY,
      kode VARCHAR(50) NOT NULL UNIQUE,
      user_id INT NOT NULL,
      total DECIMAL(12,2) NOT NULL DEFAULT 0,
      bayar DECIMAL(12,2) NOT NULL DEFAULT 0,
      kembalian DECIMAL(12,2) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};
