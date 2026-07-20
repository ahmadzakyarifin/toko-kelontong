// Middleware: cek sudah login (session)
function ensureAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  if (req.accepts(['html', 'json']) === 'json') {
    return res.status(401).json({ error: 'Belum login' });
  }
  return res.redirect('/auth/login');
}

// Middleware: cek role tertentu
function requireRole(...roles) {
  return function (req, res, next) {
    if (!req.session || !req.session.user) {
      return res.redirect('/auth/login');
    }
    if (!roles.includes(req.session.user.role)) {
      if (req.accepts(['html', 'json']) === 'json') {
        return res.status(403).json({ error: 'Akses ditolak' });
      }
      req.session.flash = { type: 'error', message: 'Akses ditolak: role tidak diperbolehkan.' };
      return res.redirect('/');
    }
    return next();
  };
};

module.exports = { ensureAuth, requireRole };
