// 001_create_users.js
// Tabel pengguna: admin & kasir (Opsi 2 aktor)
exports.up = async (conn) => {
  await conn.query(`
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      nama VARCHAR(100) NOT NULL,
      role ENUM('admin','kasir') NOT NULL DEFAULT 'kasir',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};
