// 002_create_barang.js
// Tabel master barang (pencatatan barang)
exports.up = async (conn) => {
  await conn.query(`
    CREATE TABLE barang (
      id INT AUTO_INCREMENT PRIMARY KEY,
      kode VARCHAR(50) NOT NULL UNIQUE,
      nama VARCHAR(150) NOT NULL,
      harga DECIMAL(12,2) NOT NULL DEFAULT 0,
      stok INT NOT NULL DEFAULT 0,
      satuan VARCHAR(20) NOT NULL DEFAULT 'pcs',
      stok_minimum INT NOT NULL DEFAULT 5,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};
