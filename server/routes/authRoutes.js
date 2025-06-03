const express = require('express');
const { login, callback, logout, getToken } = require('../controllers/authControllers');

const router = express.Router();

router.get('/login', login);
router.get('/callback', callback);
router.get('/logout', logout);
router.get('/token', getToken);

module.exports = router;
