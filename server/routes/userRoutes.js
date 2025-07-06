const express = require("express");
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const { getRooms, roomBook, roomBookings, requestedBookings } = require('../controllers/userControllers');
const {limiter} = require('../config/rateLimit');

router.get('/rooms', verifyToken, getRooms);
router.get('/roomBookings/:roomId', verifyToken, roomBookings);
router.post('/roomBook', verifyToken, limiter, roomBook);
router.get('/requestedBookings', verifyToken, requestedBookings);

module.exports = router;