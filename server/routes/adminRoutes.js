const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const roleCheck = require("../middlewares/roleCheck");

const {
  createRoom,
  requestBookings,
  declineBooking,
  acceptBooking,
  avaibilityChange,
  roomDelete,
} = require("../controllers/adminControllers");

router.get("/requestedBookings/:id", verifyToken, roleCheck, requestBookings);

router.post("/declineBooking", verifyToken, roleCheck, declineBooking);
router.post("/acceptBooking", verifyToken, roleCheck, acceptBooking);
router.post("/createRoom", verifyToken, roleCheck, createRoom);
router.post("/avaibilityChange", verifyToken, roleCheck, avaibilityChange);
router.post("/roomDelete", verifyToken, roleCheck, roomDelete);

module.exports = router;
