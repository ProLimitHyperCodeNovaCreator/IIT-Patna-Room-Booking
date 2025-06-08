const express = require("express");
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const { getRooms, roomBook } = require('../controllers/userControllers');

router.get('/rooms', verifyToken, getRooms);
router.post('/roomBook', verifyToken, roomBook);

module.exports = router;