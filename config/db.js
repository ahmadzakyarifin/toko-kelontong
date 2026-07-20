require('dotenv').config();
const mysql = require('mysql2/promise');

// Pool koneksi ke database (tanpa nama DB dulu agar bisa membuat DB jika belum ada)
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true,
});

const dbName = process.env.DB_NAME || 'kasir_toko';

// Koneksi yang sudah menyertakan nama database (dipakai di app & query biasa)
const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true,
});

// Membuat database jika belum ada (dipakai oleh skrip migrate/seed)
async function ensureDatabase() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  } finally {
    conn.release();
  }
}

module.exports = { pool, db, dbName, ensureDatabase };
