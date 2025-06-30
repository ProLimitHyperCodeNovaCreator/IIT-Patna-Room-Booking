const { PrismaClient } = require("@prisma/client");
const { mailFunction } = require("../engines/nodemailerEngine");
const prisma = new PrismaClient();

const createRoom = async (req, res) => {
  try {
    const { name, capacity, description, location } = req.body;
    const room = await prisma.room.create({
      data: {
        name,
        capacity,
        description,
        location,
      },
    });
    res.status(201).json({ message: "Room created successfully", room});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const requestBookings = async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await prisma.booking.findMany({
      where: {
        roomId: id,
        status: "PENDING",
      },
      include: {
        requestedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    res
      .status(200)
      .json({ message: "Bookings fetched successfully", bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const declineBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.id;
    const booking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "REJECTED",
        approvedById: userId,
      },
    });
    res.status(200).json({ message: "Booking declined successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteClashedBookings = async (roomId, startTime, endTime) => {
  try {
    await prisma.booking.deleteMany({
      where: {
        roomId,
        status: "PENDING",
        AND: [
          {
            startDate: {
              lte: endTime,
            },
          },
          {
            endDate: {
              gte: startTime,
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user.id;
    const booking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      include: {
        requestedBy: {
          select: {
            email: true,
          },
        },
        room: {
          select: {
            name: true,
          },
        },
      },
      data: {
        status: "APPROVED",
        approvedById: userId,
      },
    });
    deleteClashedBookings(booking.roomId, booking.startTime, booking.endTime);
    console.log(booking);
    // Send confirmation email
    await mailFunction(booking.requestedBy.email, booking);
    res.status(200).json({ message: "Booking accepted successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const avaibilityChange = async (req, res) => {
  try {
    const { roomId, isAvailable } = req.body;
    const room = await prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        isAvailable,
      },
    });
    res
      .status(200)
      .json({ message: "Room availability changed successfully", room });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const roomDelete = async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = await prisma.room.delete({
      where: {
        id: roomId,
      },
    });
    res.status(200).json({ message: "Room deleted successfully", room });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createRoom,
  requestBookings,
  declineBooking,
  acceptBooking,
  avaibilityChange,
  roomDelete,
};
