const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const roleCheck = require('../middlewares/roleCheck');
const { protectedDemoCheck, adminDemoCheck } = require('../controllers/demoCheck');
const router = express.Router();

router.get('/public', (req, res) => {
  res.json({ message: "This is public data" });
});

router.get('/protected', verifyToken, protectedDemoCheck);
router.get('/admin', verifyToken, roleCheck, adminDemoCheck);


module.exports = router;