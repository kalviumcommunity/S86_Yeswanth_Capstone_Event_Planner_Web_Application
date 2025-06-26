require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const guestRoutes = require('./routes/guestRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use('/guests', guestRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to Guest Management API');
});

// MongoDB connection
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
.catch(err => console.log('MongoDB connection error:', err));
