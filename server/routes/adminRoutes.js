const express = require("express");
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const roleCheck = require('../middlewares/roleCheck');

const { createRoom } = require('../controllers/adminControllers');

router.post('/createRoom', verifyToken, roleCheck, createRoom);

module.exports = router;