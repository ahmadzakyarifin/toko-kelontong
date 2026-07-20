// Migration runner sederhana.
// Cara kerja: jalankan file di folder migrations/ berurutan,
// catat yang sudah dijalankan ke tabel migrations.

const fs = require('fs');
const path = require('path');
const { pool, dbName, ensureDatabase } = require('../config/db');

const migrationsDir = path.join(__dirname, '..', 'migrations');

async function createMigrationsTable(conn) {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);
}

async function getApplied(conn) {
  const [rows] = await conn.query('SELECT name FROM migrations');
  return new Set(rows.map(r => r.name));
}

async function run() {
  await ensureDatabase();
  const conn = await pool.getConnection();
  try {
    await conn.query(`USE \`${dbName}\``);
    await createMigrationsTable(conn);
    const applied = await getApplied(conn);

    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.js'))
      .sort();

    let count = 0;
    for (const file of files) {
      if (applied.has(file)) {
        console.log(`- lewati (sudah ada): ${file}`);
        continue;
      }
      console.log(`+ migrate: ${file}`);
      const migration = require(path.join(migrationsDir, file));
      await migration.up(conn);
      await conn.query('INSERT INTO migrations(name) VALUES (?)', [file]);
      count++;
    }
    console.log(count === 0 ? 'Migrasi sudah terbaru, tidak ada yang dijalankan.' : `Selesai. ${count} migrasi dijalankan.`);
  } finally {
    conn.release();
    await pool.end();
  }
}

if (require.main === module) {
  run().catch(err => {
    console.error('Migrasi gagal:', err.message);
    process.exit(1);
  });
}

module.exports = { run };
