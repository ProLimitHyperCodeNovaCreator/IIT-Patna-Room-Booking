const nodemailer = require("nodemailer");
const {bookingDetailEmail} = require("../utils/bookingEmail");

const mailFunction = async (userEmail, bookingData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"RoomMaze" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Room Booking Confirmation",
    html: bookingDetailEmail(bookingData),
  });
};

module.exports = {mailFunction};
