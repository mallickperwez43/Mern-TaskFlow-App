# TaskFlow 🚀 

A high-performance productivity suite built with the MERN stack, featuring real-time analytics and enterprise-grade security.

## 🛠 Key Technical Features

### 📈 Data-Driven Insights
- **Productivity Flow:** Developed a custom analytics engine using Recharts and MongoDB Aggregation to visualize task completion trends over 7-day windows.
- **Dynamic Distribution:** Real-time tracking of task status ratios (Todo vs. Done) using optimized React `useMemo` hooks.

### 🔐 Advanced Security & Auth
- **Session Management:** Implemented JWT Authentication with **Refresh Token Rotation** stored in `HttpOnly` cookies to prevent XSS and CSRF attacks.
- **Email Workflow:** Integrated a secure password recovery system using **Nodemailer**, **Crypto**, and hashed expiry tokens.
- **Validation:** Strict server-side and client-side schema validation using **Zod**.

### ⚡ Performance & Scalability
- **Database Optimization:** Implemented compound B-tree indexing on MongoDB schemas to reduce query latency for user-specific data.
- **Rate Limiting:** Integrated `express-rate-limit` to protect API endpoints from brute-force attacks.

## 💻 Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, TanStack Query, Recharts.
- **Backend:** Node.js, Express, MongoDB/Mongoose.
- **DevOps:** JWT, Bcrypt, Nodemailer, Zod, Rate-Limiter.

## 🚀 Getting Started
1. Clone the repo.
2. Run `npm install` in both `/client` and `/server`.
3. Set up your `.env` (Template provided below).
4. `npm run dev` to launch.