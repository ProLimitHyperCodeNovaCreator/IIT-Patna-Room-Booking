# RoomMaze 🏫📅

**RoomMaze** is a full-stack room booking web application designed for IIT Patna to automate and streamline the process of booking rooms for events, meetings, and student activities. It replaces the manual email-based system with a seamless, trackable, and role-based web solution.

---

## 🚀 Features

### 👨‍🎓 For Users:
- Login securely via **Google OAuth**
- Fill event details and request room bookings
- Receive **automated email updates** (confirmation)
- View request status in real time

### 🛠️ For Admins:
- View all booking requests in a dashboard
- Accept or reject requests with remarks
- Approved bookings are auto-logged in a **vacancy chart**
- Admins are authenticated via roles (future-ready for role-based dashboards)

---

## ⚙️ Tech Stack

### Frontend:
- [Next.js](w)
- [TypeScript](w)
- [Tailwind CSS](w)
- [ShadCN](w)
- [Lucide React](w)

### Backend:
- [Express.js](w)
- [Prisma ORM](w)
- [PostgreSQL](w)
- [Redis](w)
- [BullMQ](w)
- [CORS](w)

### DevOps:
- [Docker](w)
- [Docker Compose](w)

### Integrations:
- [Google OAuth](w) (Authentication)
- [Nodemailer](w) with Gmail SMTP (Email Notifications)

---

## 🧑‍💻 Local Development Setup
### Prerequisites:
- Node.js ≥ 18.x
- Docker & Docker Compose
- PostgreSQL, Redis

---

## Steps:

### 1. Clone the repository
```bash
git clone https://github.com/your-username/roommaze.git
cd roommaze
```

### 2. Setup environment variables
```bash
cp .env.example .env
```
### Fill in your DB_URL, Gmail SMTP creds, Google OAuth client ID/secret, etc.

### 3. Start development containers
```bash
docker-compose up --build
```

### 4. Access the app
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 📩 Email Notifications

### We use Nodemailer with Gmail to send:

- Approval notifications
- Automated Admin responses

### Setup your Gmail credentials securely via .env as:
```bash
EMAIL_USER=your@gmail.com
EMAIL_PASS=your-gmail-app-password
```
---

## 🔮 Future Plans
- Switch to Microsoft Azure AD for institute-wide SSO
- Add role-based dashboards for faculty, admins, and students
- Outlook calendar sync for approved event
- Room availability view and filtering
- Admin analytics dashboard

---

## 🤝 Contributing
### Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change or improve.

---

## 📄 License
### MIT © Aditya Agarwal – IIT Patna

---

## 💌 Contact
### Feel free to reach out for feedback, ideas, or collaboration:
- LinkedIn: [www.linkedin.com/in/aditya-agarwal-39a350298]
- Email: [adityaworkspace0539@gmail.com]


