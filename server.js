const express = require('express');
const app = express();
const guestRoutes = require('./routes/guestRoutes');

app.use(express.json());
app.use('/guests', guestRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Guest Management API');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${3000}`);
});
