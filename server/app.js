const express = require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const app = express()
const port = process.env.PORT || 5000

// Enable CORS for your Next.js frontend
app.use(
  cors({
    origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
    credentials: true,
  }),
)

app.use(express.json())

// Middleware to verify access token and extract role
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const token = authHeader.split(" ")[1]

  try {
    // In a real application, you would validate this token with Microsoft
    // This is a simplified example
    if (!token) {
      throw new Error("Invalid token")
    }

    // For demo purposes, we'll extract role from the Authorization header
    // In a real app, you would decode and verify the JWT token
    const roleHeader = req.headers["x-user-role"]
    req.userRole = roleHeader || "user"

    next()
  } catch (error) {
    console.error("Authentication error:", error)
    res.status(401).json({ message: "Invalid token" })
  }
}

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin access required" })
  }
  next()
}

// Public route
app.get("/api/public", (req, res) => {
  res.json({ message: "This is public data" })
})

// Protected route for all authenticated users
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
  })
})

// Admin-only route
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
  })
})

app.listen(port, () => {
  console.log(`Express server running on port ${port}`)
})
