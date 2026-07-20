// Seed: membuat akun default (admin & kasir) + beberapa barang contoh.
// Dijalankan SETELAH migrate: npm run seed
const bcrypt = require('bcrypt');
const { pool, dbName, ensureDatabase } = require('../config/db');

async function seed() {
  await ensureDatabase();
  const conn = await pool.getConnection();
  try {
    await conn.query(`USE \`${dbName}\``);

    const hash = async (p) => await bcrypt.hash(p, 10);

    // --- Users ---
    const adminUser = process.env.SEED_ADMIN_USERNAME || 'admin';
    const adminPass = process.env.SEED_ADMIN_PASSWORD || 'admin123';
    const kasirUser = process.env.SEED_KASIR_USERNAME || 'kasir';
    const kasirPass = process.env.SEED_KASIR_PASSWORD || 'kasir123';

    const [adminExists] = await conn.query('SELECT id FROM users WHERE username = ?', [adminUser]);
    if (adminExists.length === 0) {
      await conn.query(
        'INSERT INTO users(username, password, nama, role) VALUES (?, ?, ?, ?)',
        [adminUser, await hash(adminPass), 'Administrator', 'admin']
      );
      console.log(`+ user admin: ${adminUser} / ${adminPass}`);
    } else {
      console.log(`- admin sudah ada, lewati`);
    }

    const [kasirExists] = await conn.query('SELECT id FROM users WHERE username = ?', [kasirUser]);
    if (kasirExists.length === 0) {
      await conn.query(
        'INSERT INTO users(username, password, nama, role) VALUES (?, ?, ?, ?)',
        [kasirUser, await hash(kasirPass), 'Kasir 1', 'kasir']
      );
      console.log(`+ user kasir: ${kasirUser} / ${kasirPass}`);
    } else {
      console.log(`- kasir sudah ada, lewati`);
    }

    // --- Barang contoh ---
    const contoh = [
      ['BRG-0001', 'Beras Ramos 5kg', 68000, 50, 'karung', 10],
      ['BRG-0002', 'Indomie Goreng', 3000, 200, 'pcs', 20],
      ['BRG-0003', 'Aqua 600ml', 2500, 150, 'pcs', 30],
      ['BRG-0004', 'Teh Botol Sosro', 4000, 100, 'pcs', 20],
      ['BRG-0005', 'Gula Pasir 1kg', 13500, 40, 'kg', 10],
      ['BRG-0006', 'Minyak Goreng 2L', 30000, 30, 'botol', 8],
    ];
    for (const [kode, nama, harga, stok, satuan, stok_min] of contoh) {
      const [exist] = await conn.query('SELECT id FROM barang WHERE kode = ?', [kode]);
      if (exist.length === 0) {
        await conn.query(
          'INSERT INTO barang(kode, nama, harga, stok, satuan, stok_minimum) VALUES (?, ?, ?, ?, ?, ?)',
          [kode, nama, harga, stok, satuan, stok_min]
        );
        console.log(`+ barang: ${kode} - ${nama}`);
      }
    }

    console.log('Seed selesai.');
  } finally {
    conn.release();
    await pool.end();
  }
}

if (require.main === module) {
  seed().catch(err => {
    console.error('Seed gagal:', err.message);
    process.exit(1);
  });
}

module.exports = { seed };
