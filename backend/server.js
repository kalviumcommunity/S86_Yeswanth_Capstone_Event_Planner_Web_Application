require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const guestRoutes = require('./routes/guestRoutes');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/guests', guestRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Guest Management API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
