// server.js
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();

//-- DEBUGGING OUTPUT --
    console.log("LOCAL TIME:", new Date().toString());
    console.log("UTC TIME:", new Date().toISOString());
//----------------------

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/meals", require("./routes/mealRoutes"));
//app.use("/api/calories", require("./routes/calorieRoutes"));
app.use("/api/calories", require("./routes/mealRoutes"));


// Test route (IMPORTANT FOR DEBUG)
app.get("/", (req, res) => {
  res.send("Backend is working ");
});

app.listen(5050, () => {
  console.log("Server running on port 5050");
});