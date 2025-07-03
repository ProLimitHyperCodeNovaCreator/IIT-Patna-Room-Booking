const dotenv = require("dotenv");
dotenv.config(); // Load .env variables
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const demoRoutes = require('./routes/demoRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const session = require("express-session");
const passport = require("passport");
require("./config/passport");


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
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api', demoRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

app.get("/", (req, res) => {
  res.send("Hello User!");
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Express server running on http://localhost:${port}`);
});
