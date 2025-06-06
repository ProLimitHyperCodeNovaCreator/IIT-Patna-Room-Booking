const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getRooms = async (req, res) => {
    try {
        req.users = await prisma.user.findMany();
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const rooms = await prisma.room.findMany();
        res.status(200).json({ message: "Rooms fetched successfully", rooms});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
    
};

module.exports = { 
    getRooms,

 };