const { PrismaClient } = require("@prisma/client");
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
        const rooms = await prisma.room.findMany();
        res.status(201).json({ message: "Room created successfully", room, rooms });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const requestBookings = async (req, res) => {
    try {
        const{id} = req.params;
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
        res.status(200).json({ message: "Bookings fetched successfully", bookings });
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
                status: "DECLINED",
                approvedById: userId, 
            },
        });
        res.status(200).json({ message: "Booking declined successfully", booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
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
            data: {
                status: "APPROVED",
                approvedById: userId,
            },
        });
        res.status(200).json({ message: "Booking accepted successfully", booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { 
    createRoom,
    requestBookings,
    declineBooking,
    acceptBooking,
};