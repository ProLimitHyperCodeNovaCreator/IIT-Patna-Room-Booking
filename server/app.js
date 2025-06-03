const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');

dotenv.config(); // Load .env variables

const app = express();
const port = process.env.PORT || 5000;

console.log(`✅ Loaded PORT from .env: ${process.env.PORT}`);
console.log(`✅ Allowed Origin: ${process.env.NEXTAUTH_URL}`);

// Middleware
app.use(
  cors({
    origin: process.env.NEXTAUTH_URL || "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies & authentication headers
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

app.get("/", (req, res) => {
  res.send("Hello User!");
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Express server running on http://localhost:${port}`);
});
