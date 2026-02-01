# 🚀 TaskFlow | Full‑Stack Task Management 
TaskFlow is a powerful and modern task management application built using the MERN stack.
It includes secure authentication, a productivity dashboard, real‑time task tracking, and a beautiful dark‑mode interface optimized for developers and students.

## 🔗 Live Links

* 🌐 Live Demo: https://mern-task-flow-app.vercel.app
* 🖥️ Backend API: Hosted on Render


## ✨ Key Features


* 🔐 Enterprise‑Grade Authentication

    * JWT Access + Refresh token flow
    * Secure httpOnly cookies
    * Automatic silent token refresh



* 📊 Productivity Dashboard

    * Daily streak
    * Visual task progress
    * Smart insights



* 📱 Responsive UI / Adaptive Sidebar

    * Collapsible sidebar
    * Mobile‑friendly layouts



* 🌗 Smart Theme System

    * Dark / Light mode
    * Saves user preference



* 🔄 Persistent Sessions

    * Zustand state management
    * Local storage sync
    * Auto state cleanup on logout


    * 
* ⚡ Optimized Backend

    * Zod validation
    * Mongoose schemas
    * Secure email reset flow with Nodemailer




## 🛠️ Tech Stack

###  Frontend

* React (Vite)
* Zustand
* TanStack Query v5
* Tailwind CSS
* Shadcn/UI
* Lucide Icons

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Bcrypt
* Zod
* Nodemailer


## 🚀 Installation & Local Setup
### Follow the steps below to run TaskFlow locally.

### 1. Clone the Repository
    1. git clone https://github.com/mallickperwez43/Mern-TaskFlow-App.git
    2. cd Mern-TaskFlow-App

### ⚙️ Backend Setup
### 2. Install Backend Dependencies
    1. cd server
    2. npm install

### 3. Create Backend .env File
* Create a .env file inside server:
    * PORT=5000
    * MONGODB_URI=your_mongodb_connection_string

    **JWT Secrets**
    * JWT_SECRET=your_short_term_secret
    * REFRESH_SECRET=your_long_term_secret

    **CLIENT_URL=http://localhost:5173** 

    * NODE_ENV=development

    **Email (Password Reset)**
    * EMAIL_USER=your_email@gmail.com
    * EMAIL_PASS=your_app_password

### 💻 Frontend Setup
### 4. Install Frontend Dependencies
        1. cd ../client
        2. npm install

### 5. Create Frontend .env File
Inside client/.env:
        
        1. VITE_API_URL=http://localhost:5000/api/v1

### ▶️ Running the App
### 6. Start Backend
        1. cd server
        2. npm run dev

### 7. Start Frontend
        1. cd client
        2. npm run dev

### 🛡️ Architecture & Security Notes

* CORS configured for cross-domain credentials (Vercel → Render)
* Secure Cookies
    * sameSite: "none"
    * secure: true
* Zustand Persistence
    * UI state stored locally
    * Sensitive auth state cleared on logout
* SPA Routing Fix
    * vercel.json rewrite rules to prevent 404 on page refresh

### 📁 Project Structure
    ├── client
    │   ├── src/api          # Axios instance + interceptors
    │   ├── src/components   # UI components
    │   ├── src/layouts      # Auth & Dashboard layouts
    │   ├── src/store        # Zustand stores
    │   └── src/pages        # Feature pages
    └── server
        ├── controllers      # Request handlers
        ├── middleware       # Auth + error handlers
        ├── models           # Mongoose schemas
        ├── routes           # API routes
        └── validators       # Zod validation schemas


### 📜 License
This project is licensed under the **MIT License.**

### 👤 Author
**Mallick Perwez**
* GitHub: https://github.com/mallickperwez43
* Project: **[Mern-TaskFlow-App](https://mern-task-flow-app.vercel.app)**

### 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/mallickperwez43/Mern-TaskFlow-App/issues).

### ⭐ Show your support
If you like this project, please give it a ⭐️!

Made with ❤️ by [Mallick Perwez](https://github.com/mallickperwez43).