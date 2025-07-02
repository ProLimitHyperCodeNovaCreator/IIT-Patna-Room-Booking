const { PrismaClient } = require("@prisma/client");
const { mailFunction } = require("../config/nodemailerEngine");
const client = require("../config/client");
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
    const serializeRoom = JSON.stringify(room);
    await client.rpush("room:list", serializeRoom);
    await client.expire("room:list", 60 * 60); // Set expiration time to 1 hour
    res.status(201).json({ message: "Room created successfully", room });
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
        startDate: {
          gte: new Date(),
        },
      },
      include: {
        requestedBy: {
          select: {
            name: true,
            email: true,
          },
        },
        room: {
          select: {
            name: true,
            capacity: true,
            location: true,
          },
        },
      },
      orderBy: {
        startDate: "asc",
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
      include: {
        requestedBy: {
          select: {
            name: true,
            email: true,
          },
        },
        room: {
          select: {
            name: true,
            capacity: true,
            location: true,
          },
        },
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
            name: true,
            email: true,
          },
        },
        room: {
          select: {
            name: true,
            capacity: true,
            location: true,
          },
        },
      },
      data: {
        status: "APPROVED",
        approvedById: userId,
      },
    });
    deleteClashedBookings(booking.roomId, booking.startTime, booking.endTime);
    await client.rpush(`room:${booking.roomId}:bookings:approved`, JSON.stringify(booking));
    await client.expire(`room:${booking.roomId}:bookings:approved`, 60 * 60); // Set expiration time to 1 hour
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
    const key = "room:list";
    const roomList = await client.lrange(key, 0, -1);
    const updatedList = roomList.map((item) => {
      const parsed = JSON.parse(item);
      if (parsed.id === roomId) {
        return JSON.stringify({ ...parsed, isAvailable });
      }
      return item;
    });
    await client.del(key);
    await client.rpush(key, ...updatedList);
    await client.expire(key, 60 * 60);
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
    const key = "room:list";
    const roomList = await client.lrange(key, 0, -1);
    const filteredList = roomList.filter((item) => {
      const parsed = JSON.parse(item);
      return parsed.id !== roomId;
    });
    await client.del(key);
    await client.rpush(key, ...filteredList);
    await client.expire(key, 60 * 60);
    await client.del(`room:${roomId}:bookings:approved`);
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
