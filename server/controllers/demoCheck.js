const prisma = require('../config/prismaConfig'); 

const protectedDemoCheck = async (req, res) => {
    const user = req.user; // User should be set by the auth middleware
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    return res.status(200).json({
        message: 'This is protected data',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
}

const adminDemoCheck = async (req, res) => {
    const user = req.user; // User should be set by the auth middleware
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    return res.status(200).json({
        message: 'This is admin-only data',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
}


module.exports = { protectedDemoCheck, adminDemoCheck };