const requireRole = (req, res, next)=>{
    const role = req.user.role;
    if(role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    next();
}

module.exports = requireRole;