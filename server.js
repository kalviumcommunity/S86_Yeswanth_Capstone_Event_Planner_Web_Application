const express = require("express");
const app = express();
const guestRoutes = require("./routes/guestRoutes");

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/", guestRoutes);

// Server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
