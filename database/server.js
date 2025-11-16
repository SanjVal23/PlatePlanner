require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Meal = require("./models/meal");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("Meal Tracker API is running");
});

// CREATE meal route
app.post("/api/meals", async (req, res) => {
  try {
    const meal = new Meal(req.body);
    await meal.save();
    res.status(201).json(meal);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creating meal" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
