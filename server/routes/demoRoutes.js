const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const roleCheck = require('../middlewares/roleCheck');
const { protecteddemo, admindemo } = require('../controllers/demoCheck');
const router = express.Router();

router.get('/public', (req, res) => {
  res.json({ message: "This is public data" });
});

router.get('/protected',verifyToken, protecteddemo);
router.get('/admin', verifyToken, roleCheck, admindemo);

module.exports = router;