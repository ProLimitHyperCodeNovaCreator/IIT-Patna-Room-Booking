const express = require("express");
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const roleCheck = require('../middlewares/roleCheck');
const { getRooms } = require('../controllers/userControllers');

router.get('/rooms', verifyToken, getRooms);

module.exports = router;