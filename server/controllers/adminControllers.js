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

module.exports = { 
    createRoom,
     
};