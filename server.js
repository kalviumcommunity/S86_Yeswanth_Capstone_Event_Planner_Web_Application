const express = require('express');
const cors = require('cors');
const guestRoutes = require('./routes/guestRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/guests', guestRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Event Planner API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
