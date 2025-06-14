const express = require("express");
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const { getRooms, roomBook, roomBookings } = require('../controllers/userControllers');

router.get('/rooms', verifyToken, getRooms);
router.get('/roomBookings/:roomId', verifyToken, roomBookings);
router.post('/roomBook', verifyToken, roomBook);

module.exports = router;