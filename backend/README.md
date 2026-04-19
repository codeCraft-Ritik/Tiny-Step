# TinySteps Backend API

Node.js + Express + MongoDB backend for TinySteps - Parental Management Platform

## 📋 Features

- ✅ User Authentication (JWT)
- ✅ Parent Account Management
- ✅ Child Profile Management
- ✅ Task/Routine Management
- ✅ Reward System
- ✅ Progress Tracking
- ✅ Notification System
- ✅ COPPA & GDPR Compliance
- ✅ Security Best Practices
- ✅ Rate Limiting
- ✅ Error Handling

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Mongoose Schema Validation
- **Security**: Helmet.js, CORS, Rate Limiting
- **Development**: Nodemon

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (Local or MongoDB Atlas)
- npm or yarn

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Environment Setup

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

**Important environment variables:**

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/tinysteps

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173

# Database
DB_NAME=tinysteps
```

### Step 3: Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**OR use MongoDB Atlas (Cloud):**
- Replace `MONGODB_URI` with your Atlas connection string
- Format: `mongodb+srv://username:password@cluster.mongodb.net/tinysteps?retryWrites=true&w=majority`

### Step 4: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will be running at: `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js           # MongoDB connection setup
├── models/
│   ├── User.js               # Parent user model
│   ├── Child.js              # Child profile model
│   ├── Task.js               # Task/routine model
│   ├── TaskCompletion.js     # Task completion tracking
│   ├── Reward.js             # Reward/sticker model
│   └── Notification.js       # Notification model
├── routes/                   # API routes (to be added)
├── controllers/              # Request handlers (to be added)
├── middleware/               # Custom middleware (to be added)
├── utils/                    # Helper functions (to be added)
├── .env                      # Environment variables
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── package.json              # Dependencies
└── server.js                 # Main server file
```

## 🗄️ Database Models

### User (Parent)
- Authentication & profile management
- Child account ownership
- Preferences & settings
- GDPR compliance

### Child
- Child profile information
- Age & preferences
- Stats & achievements
- Parent assignment

### Task
- Routine/task definitions
- Scheduling & frequency
- Points & rewards
- Category & difficulty

### TaskCompletion
- Records task completions
- Verification status
- Photo evidence
- Quality ratings

### Reward
- Reward definitions
- Points/stickers cost
- Redemption tracking
- One-time or recurring

### Notification
- In-app & email notifications
- Status & delivery tracking
- Expiration handling
- Priority levels

## 🔐 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention (Mongoose)
- ✅ Account lockout (5 failed attempts)
- ✅ HTTPS support (production)

## 🧪 Testing

```bash
# Run tests (to be added)
npm test

# Run tests with coverage
npm run test:coverage
```

## 📡 API Endpoints (Coming)

### Authentication
- `POST /api/auth/register` - Register new parent
- `POST /api/auth/login` - Login parent
- `POST /api/auth/logout` - Logout parent
- `POST /api/auth/refresh-token` - Refresh JWT
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Parents
- `GET /api/users/profile` - Get parent profile
- `PUT /api/users/profile` - Update parent profile
- `DELETE /api/users/account` - Delete account

### Children
- `POST /api/children` - Create child profile
- `GET /api/children` - Get all children
- `GET /api/children/:id` - Get specific child
- `PUT /api/children/:id` - Update child
- `DELETE /api/children/:id` - Delete child

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/child/:childId` - Get child's tasks
- `POST /api/tasks/:id/complete` - Mark task complete

### Rewards
- `POST /api/rewards` - Create reward
- `GET /api/rewards` - Get all rewards
- `GET /api/rewards/:id` - Get specific reward
- `PUT /api/rewards/:id` - Update reward
- `DELETE /api/rewards/:id` - Delete reward

### Dashboard
- `GET /api/dashboard/stats` - Get parent dashboard stats
- `GET /api/progress/child/:childId` - Get child progress

## 🚀 Deployment

### Docker (Recommended)

```bash
# Build Docker image
docker build -t tinysteps-backend .

# Run Docker container
docker run -p 5000:5000 --env-file .env tinysteps-backend
```

### Heroku

```bash
# Install Heroku CLI
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_atlas_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### AWS/DigitalOcean

See deployment guides in `/docs/deployment`

## 📝 Environment Variables Checklist

- [ ] `MONGODB_URI` - Your MongoDB connection string
- [ ] `PORT` - Server port (default: 5000)
- [ ] `JWT_SECRET` - Secret key for JWT (min 32 characters)
- [ ] `JWT_EXPIRE` - Token expiration (e.g., 7d)
- [ ] `NODE_ENV` - development/production
- [ ] `FRONTEND_URL` - Frontend URL for CORS
- [ ] `DB_NAME` - Database name

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running (`mongod`)

### JWT Authentication Error
```
Error: JsonWebTokenError: invalid token
```
**Solution**: Check JWT_SECRET is set correctly & token is valid

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Verify FRONTEND_URL in .env matches your frontend URL

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in .env or kill process on port 5000

## 📖 Documentation

- [API Documentation](./docs/API.md) - Detailed API reference
- [Database Schema](./docs/DATABASE.md) - Database design
- [Authentication Flow](./docs/AUTH.md) - Auth system details
- [Deployment Guide](./docs/DEPLOYMENT.md) - Deployment steps

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For issues and questions:
- GitHub Issues: [Create an issue]
- Email: support@tinysteps.com

---

**Happy Coding! 🚀**
