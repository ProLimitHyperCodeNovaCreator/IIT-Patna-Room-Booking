const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const client = require("../config/client");

const getRooms = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await client.lrange("room:list", 0, -1);
    if(result.length > 0) {
      const parsedResult = result.map((room) => JSON.parse(room));
      return res.status(200).json({ message: "Rooms fetched successfully", rooms: parsedResult });
    }

    const rooms = await prisma.room.findMany();
    const serializeRooms = rooms.map((room)=>JSON.stringify(room));
    if(serializeRooms.length > 0) {
      await client.rpush("room:list", ...serializeRooms);
      await client.expire("room:list", 60 * 60); // Set expiration time to 1 hour
    }
    res.status(200).json({ message: "Rooms fetched successfully", rooms });
  } catch (error) {
    //console.error(error);
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
      return res
        .status(201)
        .json({ message: "Room booked successfully", bookingRequest });
    } else {
      return res.status(400).json({
        message: "Room is already booked for this period",
        bookingStatus: "rejected",
      });
    }
  } catch (error) {
    //console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const roomBookings = async (req, res) => {
  try {
    const {roomId} = req.params;
    const result = await client.lrange(`room:${roomId}:bookings:approved`, 0, -1);
    if (result.length > 0) {
      const parsedResult = result.map((booking) => JSON.parse(booking));
      return res.status(200).json({ message: "Bookings fetched successfully", bookings: parsedResult });
    }
    const bookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: "APPROVED",
        endDate:{
          gte : new Date()
        }
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
      orderBy: {
        startDate: "desc",
      },
    });
    const serializeBookings = bookings.map((booking) => JSON.stringify(booking));
    if (serializeBookings.length > 0) {
      await client.rpush(`room:${roomId}:bookings:approved`, ...serializeBookings);
      await client.expire(`room:${roomId}:bookings:approved`, 60 * 60);
    }
    res.status(200).json({ message: "Bookings fetched successfully", bookings });
  } catch (error) {
    //console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const requestedBookings = async(req,res)=>{
  const userId = req.user.id;
  if(!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        requestedById: userId,
      },
      select: {
        id: true,
        room: {
          select: {
            name: true,
          },
        },
        eventTitle: true,
        eventDescription: true,
        startDate: true,
        endDate: true,
        status: true,
      },
    });
    res.status(200).json({ message: "Bookings fetched successfully", bookings });
  } catch (error) {
    //console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getRooms,
  roomBook,
  roomBookings,
  requestedBookings
};
