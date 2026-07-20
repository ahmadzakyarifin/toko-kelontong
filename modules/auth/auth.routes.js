const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ctrl = require('./auth.controller');

router.get('/login', ctrl.showLogin);
router.post('/login',
  [
    body('username').trim().notEmpty().withMessage('Username wajib diisi'),
    body('password').notEmpty().withMessage('Password wajib diisi'),
  ],
  ctrl.doLogin
);
router.get('/logout', ctrl.logout);

module.exports = router;

