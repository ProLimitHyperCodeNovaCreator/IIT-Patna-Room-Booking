const nodemailer = require("nodemailer");
const {bookingDetailEmail} = require("../utils/bookingEmail");
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mailFunction = async (userEmail, bookingData) => {
  //console.log(process.env.EMAIL_USER, process.env.EMAIL_APP_PASSWORD);
  const transporter = nodemailer.createTransport({
    service: "Gmail",
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
