const bookingDetailEmail = (bookingData) => {
  const { room, eventTitle, eventDescription, startDate, endDate } = bookingData;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
      <p>Dear User,</p>
      <p>Your request for ${room.name} has been received and approved. Here are the details of your booking:</p>
      <ul style="list-style-type: none; padding: 0;">
        <li><strong>Room Name:</strong> ${room.name}</li>
        <li><strong>Event Name:</strong> ${eventTitle}</li>
        <li><strong>Event Description:</strong> ${eventDescription}</li>
        <li><strong>Start Date:</strong> ${new Date(startDate).toLocaleString()}</li>
        <li><strong>End Date:</strong> ${new Date(endDate).toLocaleString()}</li>
      </ul>
      <p>If you did not request this booking, please ignore this email.</p>
      <p>If you have any questions or need to make changes to your booking, please contact us.</p>
      <p>Best regards,<br/>RoomMaze Team</p>
        <p style="font-size: 0.9em; color: #555;">This is an automated message, please do not reply.</p>
        <footer style="margin-top: 20px; font-size: 0.8em; color: #777;">
            <p>&copy; ${new Date().getFullYear()} RoomMaze. All rights reserved.</p>
        </footer>
    </div>
  `;
}

module.exports = { bookingDetailEmail };