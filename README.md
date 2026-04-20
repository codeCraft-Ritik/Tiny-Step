# 🎯 TinySteps - Parental Management Platform

<div align="center">

![GitHub](https://img.shields.io/badge/GitHub-Project-blue?style=for-the-badge&logo=github)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-orange?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

A comprehensive full-stack web application designed to help parents manage their children's routines, tasks, and rewards in a gamified, engaging way.

[🚀 Live Demo](https://tiny-step-ruby.vercel.app/) 

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

**TinySteps** is an innovative parental management platform that transforms routine management and task completion into an engaging, gamified experience for children. Parents can create tasks and rewards, while children earn points by completing their responsibilities.

### Key Highlights:
- 🎮 Gamified task completion system with rewards
- 👨‍👩‍👧‍👦 Multi-user family management
- 📱 Fully responsive mobile-first design
- 🔐 Secure JWT-based authentication with OTP verification
- 🚀 Real-time dashboard updates
- 💎 Advanced reward tracking system
- 🌐 GDPR & COPPA compliant

---

## 🎯 Key Features

### Parent Features
- ✅ User registration and secure authentication
- ✅ Create and manage child profiles
- ✅ Design custom tasks and routines
- ✅ Set up reward systems
- ✅ Monitor child progress and activity
- ✅ Manage family settings and preferences
- ✅ Email notifications and alerts

### Child Features
- ✅ Browse available tasks
- ✅ Mark tasks as complete
- ✅ Earn points and badges
- ✅ Redeem rewards
- ✅ Connect with friends
- ✅ View achievement dashboard
- ✅ Track progress over time

### Security Features
- ✅ JWT-based authentication
- ✅ OTP email verification
- ✅ Password hashing with bcryptjs
- ✅ Rate limiting on API endpoints
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation & sanitization

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI library | ^19.2.4 |
| **Vite** | Build tool & dev server | ^8.0.1 |
| **Tailwind CSS** | Styling framework | ^4.2.2 |
| **React Router** | Client-side routing | ^7.13.2 |
| **Framer Motion** | Animations | ^12.38.0 |
| **Lucide React** | Icon library | ^1.0.1 |
| **React Icons** | Additional icons | ^5.6.0 |
| **Babel** | JavaScript transpiler | ^7.29.0 |

### Backend
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Node.js** | Runtime environment | 16+ |
| **Express** | Web framework | ^4.18.2 |
| **MongoDB** | NoSQL database | ^7.5.0 |
| **Mongoose** | ODM library | ^7.5.0 |
| **JWT** | Authentication | ^9.0.2 |
| **bcryptjs** | Password hashing | ^2.4.3 |
| **Nodemailer** | Email service | ^8.0.5 |
| **Helmet** | Security headers | ^7.0.0 |
| **CORS** | Cross-origin requests | ^2.8.5 |
| **Validator** | Input validation | ^13.11.0 |
| **Dotenv** | Environment config | ^16.0.3 |
| **Nodemon** | Dev auto-reload | ^3.0.2 |

### Development Tools
- **ESLint** - Code linting
- **React Compiler** - Optimized React rendering
- **Vercel** - Deployment platform
- **Render.yaml** - Render deployment config

---

## 📁 Project Structure

```
TinySteps/
├── 📂 frontend/                    # React frontend application
│   ├── src/
│   │   ├── 📂 assets/             # Images, fonts, media
│   │   ├── 📂 components/         # Reusable React components
│   │   │   ├── Footer.jsx
│   │   │   └── OTPVerification.jsx
│   │   ├── 📂 pages/              # Page components
│   │   │   ├── About.jsx
│   │   │   ├── Intro.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── ParentDashboard.jsx
│   │   │   ├── PrivacyPolicy.jsx
│   │   │   ├── TermsOfService.jsx
│   │   │   ├── VerificationSuccess.jsx
│   │   │   ├── 📂 Authentication/
│   │   │   │   ├── ChildSignup.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Signup.jsx
│   │   │   └── 📂 Dashboard/
│   │   │       ├── AddActivityModal.jsx
│   │   │       ├── ChildTasks.jsx
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Friends.jsx
│   │   │       ├── Rewards.jsx
│   │   │       ├── SettingsModal.jsx
│   │   │       └── Task.jsx
│   │   ├── 📂 services/           # API call services
│   │   │   ├── authAPI.js
│   │   │   ├── familyAPI.js
│   │   │   └── rewardAPI.js
│   │   ├── 📂 utils/              # Utility functions
│   │   │   ├── familyInitialization.js
│   │   │   ├── familyScore.js
│   │   │   ├── introAnimations.js
│   │   │   └── validation.js
│   │   ├── 📂 hooks/              # Custom React hooks
│   │   ├── App.jsx                # Main App component
│   │   ├── App.css                # Global styles
│   │   ├── index.css              # CSS reset & base
│   │   └── main.jsx               # Entry point
│   ├── public/
│   │   ├── robots.txt             # SEO robots file
│   │   └── sitemap.xml            # SEO sitemap
│   ├── package.json               # Frontend dependencies
│   ├── vite.config.js             # Vite configuration
│   ├── tailwind.config.js         # Tailwind configuration
│   ├── eslint.config.js           # ESLint rules
│   ├── index.html                 # HTML entry point
│   └── vercel.json                # Vercel deployment config
│
├── 📂 backend/                     # Express backend server
│   ├── 📂 config/
│   │   └── database.js            # MongoDB connection
│   ├── 📂 controllers/            # Request handlers
│   │   ├── authController.js
│   │   └── rewardController.js
│   ├── 📂 middleware/             # Custom middleware
│   │   └── auth.js                # JWT authentication
│   ├── 📂 models/                 # Mongoose schemas
│   │   ├── Child.js
│   │   ├── Reward.js
│   │   └── User.js
│   ├── 📂 routes/                 # API routes
│   │   ├── authRoutes.js
│   │   ├── family.js
│   │   └── rewards.js
│   ├── 📂 utils/                  # Helper utilities
│   │   ├── emailService.js        # Email notifications
│   │   ├── errorHandler.js        # Error handling
│   │   ├── jwt.js                 # JWT utilities
│   │   └── validators.js          # Input validators
│   ├── 📂 scripts/                # Utility scripts
│   │   ├── checkUsers.js
│   │   ├── fixDuplicates.js
│   │   └── seedRewards.js
│   ├── server.js                  # Express app setup
│   ├── package.json               # Backend dependencies
│   ├── render.yaml                # Render deployment config
│   └── README.md                  # Backend documentation
│
├── 📄 package.json                # Root package configuration
├── 📄 README.md                   # This file
├── 📄 MOBILE_RESPONSIVE_FIXES.md  # Mobile optimization guide
└── 📄 .env.example                # Environment variables template
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

```bash
# Check Node.js version (16+ required)
node --version

# Check npm version
npm --version

# MongoDB (choose one):
# - Local MongoDB installation
# - MongoDB Atlas (cloud)
```

### System Requirements
- **OS**: Windows, macOS, or Linux
- **Node.js**: v16 or higher
- **npm**: v8 or higher
- **RAM**: Minimum 2GB
- **Disk Space**: Minimum 500MB

---

## 📥 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/tinysteps.git
cd tinysteps
```

### Step 2: Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd src

# Install dependencies
npm install

# For specific package installation
npm install --legacy-peer-deps
```

### Step 3: Install Backend Dependencies

```bash
# Navigate to backend directory (from root)
cd backend

# Install dependencies
npm install
```

### Step 4: Set Up Environment Variables

#### Backend Setup (.env file)

```bash
# Create .env file in backend directory
touch .env
```

Add the following environment variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/tinysteps
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tinysteps

# JWT Configuration
JWT_SECRET=your-secret-key-here-min-32-chars
JWT_EXPIRE=7d

# Email Configuration (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# OTP Configuration
OTP_EXPIRY=10

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

#### Frontend Setup (.env file)

Create `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=TinySteps
```

---

## 💻 Usage

### Development Environment

#### Start Backend Server

```bash
# From backend directory
cd backend

# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Server runs on: http://localhost:5000
```

#### Start Frontend Development Server

```bash
# From root directory (open new terminal)
npm run dev

# Frontend runs on: http://localhost:5173
```

### Production Build

#### Build Frontend

```bash
# From root directory
npm run build

# Output: dist/ directory ready for deployment
```

#### Build Backend

```bash
# Backend uses standard Node.js, no build needed
# Direct deployment or containerization
```

### Available Scripts

#### Frontend
```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint
```

#### Backend
```bash
npm run dev           # Start with nodemon (auto-reload)
npm start             # Start production server
npm run test          # Run tests (if configured)
```

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "parent@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "parent@example.com",
  "password": "SecurePass123!"
}
```

#### OTP Verification
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "parent@example.com",
  "otp": "123456"
}
```

### Family Management Endpoints

#### Get Family Data
```http
GET /api/family
Authorization: Bearer <jwt-token>
```

#### Add Child
```http
POST /api/family/child
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Tommy",
  "age": 8,
  "email": "child@example.com"
}
```

### Reward Endpoints

#### Get Rewards
```http
GET /api/rewards
Authorization: Bearer <jwt-token>
```

#### Create Reward
```http
POST /api/rewards
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Ice Cream",
  "points": 50,
  "description": "One ice cream treat"
}
```

#### Redeem Reward
```http
POST /api/rewards/:rewardId/redeem
Authorization: Bearer <jwt-token>
```

For detailed API documentation, refer to the [Backend README](./backend/README.md)

---

## 🌐 Deployment

### Deploy Frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production
vercel --prod
```

Configuration is in `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### Deploy Backend (Render/Railway/Heroku)

#### Using Render

1. Connect your GitHub repository to Render
2. Create new Web Service
3. Use configuration from `render.yaml`:

```yaml
services:
  - type: web
    name: tinysteps-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
```

4. Add environment variables in Render dashboard
5. Deploy

---

## 🔧 Development

### Project Architecture

```
├─ Frontend (React SPA)
│  ├─ Vite for fast dev server
│  ├─ Tailwind for styling
│  └─ React Router for navigation
│
├─ Backend (Express API)
│  ├─ RESTful API design
│  ├─ JWT authentication
│  └─ MongoDB data persistence
│
└─ Database (MongoDB)
   ├─ User/Parent documents
   ├─ Child profiles
   ├─ Tasks & Rewards
   └─ Progress tracking
```

### Code Style

- **Frontend**: React hooks, functional components, JSX
- **Backend**: ES6 modules, async/await, middleware pattern
- **Database**: Mongoose schema validation
- **Styling**: Tailwind CSS utility classes

### Linting

```bash
# Frontend
npm run lint

# Fix linting issues
npm run lint -- --fix
```

### Performance Optimizations

1. **Frontend**
   - React Compiler enabled for optimizations
   - Code splitting with React Router
   - Lazy loading of components
   - Image optimization

2. **Backend**
   - Database indexing on frequently queried fields
   - Caching strategies
   - Rate limiting for API protection
   - Gzip compression

3. **Mobile**
   - Responsive design (320px - 2xl screens)
   - Safe area support for notches
   - Touch-optimized UI
   - Minimal bundle size

---

## 🧪 Testing

### Manual Testing Workflow

1. **Authentication Test**
   - Register new account
   - Verify OTP
   - Login with credentials

2. **Task Management Test**
   - Create task
   - Assign to child
   - Mark as complete
   - Verify points update

3. **Reward System Test**
   - Create reward
   - Check points requirement
   - Redeem reward
   - Verify balance update

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📚 Documentation

- [Frontend Documentation](./src/README.md)
- [Backend Documentation](./backend/README.md)
- [Mobile Responsive Guide](./MOBILE_RESPONSIVE_FIXES.md)
- [API Reference](#api-documentation)
- [Contributing Guidelines](#contributing)

---


## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/tinysteps.git
   cd tinysteps
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Make Changes**
   - Follow code style guidelines
   - Write clean, documented code
   - Test thoroughly

4. **Commit Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

5. **Push to Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

6. **Open Pull Request**
   - Describe changes clearly
   - Reference related issues
   - Ensure CI passes

### Development Guidelines

- Keep commits atomic and descriptive
- Write meaningful commit messages
- Follow existing code patterns
- Add comments for complex logic
- Update documentation when needed

---

## 📋 Roadmap

- [ ] Mobile app (React Native)
- [ ] Dark mode support
- [ ] Advanced analytics dashboard
- [ ] Multiple language support (i18n)
- [ ] Social features (leaderboards)
- [ ] Offline support with service workers
- [ ] End-to-end testing
- [ ] GraphQL API alternative
- [ ] Admin dashboard
- [ ] Advanced reporting

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

You are free to use, modify, and distribute this software for personal or commercial purposes.

---

## ✨ Acknowledgments

### Technologies Used
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js](https://expressjs.com)
- [MongoDB](https://www.mongodb.com)
- [Vercel](https://vercel.com)


<div align="center">

### ⭐ If you find this project helpful, please consider giving it a star!

Made with ❤️ by the TinySteps Team

[⬆ Back to top](#-tinysteps---parental-management-platform)

</div>
