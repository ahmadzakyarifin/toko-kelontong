// Controller Auth - handle request/response, validasi input
const { validationResult } = require('express-validator');
const authService = require('./auth.service');

const showLogin = (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('auth/login', { title: 'Login', errors: {}, generalError: null, old: {} });
};

const doLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Konversi array error express-validator ke object per-field
    const fieldErrors = {};
    const rawArray = errors.array();
    for (let i = 0; i < rawArray.length; i++) {
      const e = rawArray[i];
      if (e.path && !fieldErrors[e.path]) {
        fieldErrors[e.path] = e.msg;
      }
    }
    return res.status(400).render('auth/login', {
      title: 'Login',
      errors: fieldErrors,
      generalError: null,
      old: req.body,
    });
  }
  try {
    const user = await authService.login(req.body);
    req.session.user = user;
    return res.redirect('/');
  } catch (err) {
    return res.status(400).render('auth/login', {
      title: 'Login',
      errors: {},
      generalError: err.message,
      old: req.body,
    });
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
};

module.exports = { showLogin, doLogin, logout };