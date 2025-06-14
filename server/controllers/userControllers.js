const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getRooms = async (req, res) => {
  try {
    req.users = await prisma.user.findMany();
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const rooms = await prisma.room.findMany();
    res.status(200).json({ message: "Rooms fetched successfully", rooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkForClash = async (
  roomId,
  startDateFromRequest,
  endDateFromRequest
) => {
  const clashBookings = await prisma.booking.findMany({
    where: {
      roomId,
      status: "APPROVED",
      startDate: {
        lt: endDateFromRequest,
      },
      endDate: {
        gt: startDateFromRequest,
      },
    },
  });

  return clashBookings.length > 0;
};

const roomBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId, eventName, eventDescription, startDate, endDate } =
      req.body;
    const clashed = await checkForClash(roomId, startDate, endDate);
    if (!clashed) {
      const bookingRequest = await prisma.booking.create({
        data: {
          roomId,
          eventTitle: eventName,
          eventDescription,
          requestedById: userId,
          startDate,
          endDate,
        },
      });
      res
        .status(201)
        .json({ message: "Room booked successfully", bookingRequest });
    } else {
      res.status(400).json({
        message: "Room is already booked for this period",
        bookingStatus: "rejected",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const roomBookings = async (req, res) => {
  try {
    const {roomId} = req.params;
    const bookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: "APPROVED",
      },
      select: {
        id: true,
        eventTitle: true,
        eventDescription: true,
        startDate: true,
        endDate: true,
        requestedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    res.status(200).json({ message: "Bookings fetched successfully", bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getRooms,
  roomBook,
  roomBookings,
};
