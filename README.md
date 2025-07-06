# RoomMaze 🏫📅

**RoomMaze** is a full-stack room booking web application designed for IIT Patna to automate and streamline the process of booking rooms for events, meetings, and student activities. It replaces the manual email-based system with a seamless, trackable, and role-based web solution.

---

## Features

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

### Frontend
- ![Next.js](https://img.shields.io/badge/-Next.js-black?logo=next.js&logoColor=white) **Next.js**
- ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white) **TypeScript**
- ![Tailwind CSS](https://img.shields.io/badge/-TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white) **Tailwind CSS**
- ![ShadCN](https://img.shields.io/badge/-ShadCN-000?logo=tailwindcss&labelColor=gray&color=black) **ShadCN**
- ![Lucide React](https://img.shields.io/badge/-LucideReact-0A0A0A?logo=react&logoColor=white) **Lucide React**

### Backend
- ![Express.js](https://img.shields.io/badge/-Express.js-000000?logo=express&logoColor=white) **Express.js**
- ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?logo=prisma&logoColor=white) **Prisma ORM**
- ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?logo=postgresql&logoColor=white) **PostgreSQL**
- ![Redis](https://img.shields.io/badge/-Redis-DC382D?logo=redis&logoColor=white) **Redis**
- ![BullMQ](https://img.shields.io/badge/-BullMQ-FA5252?logo=nodedotjs&logoColor=white) **BullMQ**
- ![CORS](https://img.shields.io/badge/-CORS-grey?logo=javascript) **CORS**

### DevOps
- ![Docker](https://img.shields.io/badge/-Docker-2496ED?logo=docker&logoColor=white) **Docker**
- ![Docker Compose](https://img.shields.io/badge/-Docker%20Compose-2496ED?logo=docker&logoColor=white) **Docker Compose**

### Integrations
- ![Google OAuth](https://img.shields.io/badge/-GoogleOAuth-4285F4?logo=google&logoColor=white) **Google OAuth**
- ![Nodemailer](https://img.shields.io/badge/-Nodemailer-EA4335?logo=gmail&logoColor=white) **Nodemailer** with Gmail SMTP

### Testing / Performance
- ![Artillery](https://img.shields.io/badge/-Artillery-E63946?logo=fastapi&logoColor=white) **Artillery**


---

## Local Development Setup
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

## Email Notifications

### We use Nodemailer with Gmail to send:

- Approval notifications
- Automated Admin responses

### Setup your Gmail credentials securely via .env as:
```bash
EMAIL_USER=your@gmail.com
EMAIL_PASS=your-gmail-app-password
```
---
## Load Testing with Artillery

### We tested the performance and scalability of the backend using Artillery, a modern load-testing toolkit.

### Test Summary

- Tool: Artillery v2.0.23
- Tested Endpoint: POST /user/roomBook
- Authentication: JWT token provided in cookie
- Rate Limiter: 100 requests per 15 minutes per IP (Express Rate Limit)
- Database: PostgreSQL with Prisma ORM
- Caching: Redis
- Token Verification: JSON Web Tokens (JWT)

### Load Test Results

```bash
Total Requests:        5100
Request Rate:          ~55/sec
2xx Success Responses: 5100 (100%)
Failures:              0
Max Latency:           11 ms
Mean Latency:          5.3 ms
95th Percentile (P95): 7 ms
99th Percentile (P99): 7.9 ms
```

---
## Future Plans
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


