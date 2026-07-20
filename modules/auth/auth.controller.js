// Controller Auth - handle request/response, validasi input
const { validationResult } = require('express-validator');
const authService = require('./auth.service');

const showLogin = (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('auth/login', { title: 'Login', error: null, old: {} });
};

const doLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('auth/login', {
      title: 'Login',
      error: errors.array().map(e => e.msg).join(', '),
      old: req.body,
    }, { layout: false });
  }
  try {
    const user = await authService.login(req.body);
    req.session.user = user;
    return res.redirect('/');
  } catch (err) {
    return res.status(400).render('auth/login', {
      title: 'Login',
      error: err.message,
      old: req.body,
    }, { layout: false });
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
};

module.exports = { showLogin, doLogin, logout };
