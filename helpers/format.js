// Helper format & util
const formatRupiah = (num) => {
  const n = Number(num || 0);
  return 'Rp ' + n.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

const generateKode = (prefix, date = new Date()) => {
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${ymd}-${rand}`;
};

module.exports = { formatRupiah, generateKode };
