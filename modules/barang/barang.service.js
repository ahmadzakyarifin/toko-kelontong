// Service Barang - validasi bisnis & aturan
const repo = require('./barang.repository');

const list = (opts) => repo.list(opts);

const get = async (id) => {
  const row = await repo.findById(id);
  if (!row) throw new Error('Barang tidak ditemukan');
  return row;
};

const getByKode = (kode) => repo.findByKode(kode);

const create = async (data) => {
  const kodeExists = await repo.findByKode(data.kode);
  if (kodeExists) throw new Error('Kode barang sudah digunakan');
  if (Number(data.harga) < 0) throw new Error('Harga tidak boleh negatif');
  if (Number(data.stok) < 0) throw new Error('Stok tidak boleh negatif');
  return repo.create({
    kode: data.kode,
    nama: data.nama,
    harga: Number(data.harga),
    stok: Number(data.stok),
    satuan: data.satuan || 'pcs',
    stok_minimum: Number(data.stok_minimum || 5),
  });
};

const update = async (id, data) => {
  await get(id); // throw if not found
  if (Number(data.harga) < 0) throw new Error('Harga tidak boleh negatif');
  if (Number(data.stok) < 0) throw new Error('Stok tidak boleh negatif');
  return repo.update(id, {
    nama: data.nama,
    harga: Number(data.harga),
    stok: Number(data.stok),
    satuan: data.satuan || 'pcs',
    stok_minimum: Number(data.stok_minimum || 5),
  });
};

const remove = async (id) => {
  await get(id);
  return repo.remove(id);
};

const stokMenipis = () => repo.listStokMenipis();

module.exports = { list, get, getByKode, create, update, remove, stokMenipis };
