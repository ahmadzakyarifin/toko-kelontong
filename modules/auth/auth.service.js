// Service Auth - logika bisnis
const bcrypt = require('bcrypt');
const User = require('./auth.model');
const repo = require('./auth.repository');

const login = async ({ username, password }) => {
  if (!username || !password) {
    throw new Error('Username dan password wajib diisi');
  }
  const row = await repo.findByUsername(username);
  if (!row) {
    throw new Error('Username atau password salah');
  }
  const match = await bcrypt.compare(password, row.password);
  if (!match) {
    throw new Error('Username atau password salah');
  }
  return new User(row).toJSON();
};

module.exports = { login };
