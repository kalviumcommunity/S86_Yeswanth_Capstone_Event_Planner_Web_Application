require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const guestRoutes = require('./routes/guestRoutes');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const taskRoutes = require('./routes/taskRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const commentRoutes = require('./routes/commentRoutes');
const aiRoutes = require('./routes/aiRoutes');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Create uploads folder if not exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 5 : 100,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 3 : 10,
  message: { message: 'Too many login or signup attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.apiLimiter = apiLimiter;
app.authLimiter = authLimiter;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Apply general API rate limit to all /api routes
app.use('/api', apiLimiter);

// Apply strict rate limiting to auth routes specifically
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);

app.use('/guests', guestRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ai', aiRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to Guest Management API');
});

// MongoDB connection
if (require.main === module) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
    });
  })
  .catch(err => {
    console.log('MongoDB connection error:', err);
    // Start server anyway so frontend can develop against API stubs or error responses
    if (!module.hot) {
      app.listen(process.env.PORT || 3000, () => {
        console.log(`Server running (without DB) at http://localhost:${process.env.PORT || 3000}`);
      });
    }
  });

  // Helpful message when MONGO_URI not set
  if (!process.env.MONGO_URI) {
    console.warn('Warning: MONGO_URI is not set. Create a .env file with MONGO_URI and JWT_SECRET to enable full functionality.');
  }
}

module.exports = app;
