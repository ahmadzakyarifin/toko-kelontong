// Repository User - akses DB langsung
const { db } = require('../../config/db');

const findByUsername = async (username) => {
  const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};

const findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

const create = async ({ username, password, nama, role }) => {
  const [result] = await db.query(
    'INSERT INTO users(username, password, nama, role) VALUES (?, ?, ?, ?)',
    [username, password, nama, role]
  );
  return result.insertId;
};

module.exports = { findByUsername, findById, create };
