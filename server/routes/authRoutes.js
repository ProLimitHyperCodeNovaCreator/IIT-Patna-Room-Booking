const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;
    //console.log(user);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = jwt.sign(
      { name: user.name, email: user.email, role: user.role, id:user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true, // Prevents XSS attacks
      secure: false, // Use HTTPS in production -> process.env.NODE_ENV === "production"
      sameSite: "Lax",
      maxAge: 3600000, // 1 hour expiration
    });
    //console.log(token);

    // Option: Cookie or Redirect with token
    res.redirect(`http://localhost:3000/dashboard/${user.role.toLowerCase()}`);
  }
);

router.get("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "Logged out successfully" });
    res.redirect("http://localhost:3000/login");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during logout", error: error.message });
  }
});

router.get("/token", (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.status(200).json({ message: "Token is valid", user: decoded });
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "No token found" });
  }
});

module.exports = router;
