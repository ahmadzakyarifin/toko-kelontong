// Model/entity User
class User {
  constructor({ id, username, password, nama, role, created_at, updated_at }) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.nama = nama;
    this.role = role;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
  toJSON() {
    const { password, ...safe } = this;
    return safe;
  }
}
module.exports = User;
