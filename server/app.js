const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config(); // Load .env variables

const app = express();
const port = process.env.PORT || 5000;

console.log(`✅ Loaded PORT from .env: ${process.env.PORT}`);
console.log(`✅ Allowed Origin: ${process.env.NEXTAUTH_URL}`);

// Middleware
app.use(
  cors({
    origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    if (!token) throw new Error("Invalid token");

    // Fake role extraction for demo (in real-world, decode the token)
    const roleHeader = req.headers["x-user-role"];
    req.userRole = roleHeader || "user";

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Role check middleware
const requireAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  next();
};

// Routes
app.get("/api/public", (req, res) => {
  res.json({ message: "This is public data" });
});

app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({
    message: "This is protected data for all authenticated users",
    data: {
      items: [
        { id: 1, name: "Protected Item 1" },
        { id: 2, name: "Protected Item 2" },
        { id: 3, name: "Protected Item 3" },
      ],
    },
  });
});

app.get("/api/admin", authenticateToken, requireAdmin, (req, res) => {
  res.json({
    message: "This is admin-only data",
    data: {
      stats: {
        users: 42,
        activeSessions: 12,
        systemLoad: "23%",
      },
      adminControls: true,
    },
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Express server running on http://localhost:${port}`);
});
