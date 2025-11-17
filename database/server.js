require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Meal = require("./models/meal");

const app = express();
app.use(cors());
app.use(express.json());

// ------------------------------------------
// MongoDB connect
// ------------------------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));


// ------------------------------------------
// Test route
// ------------------------------------------
app.get("/", (req, res) => {
  res.send("Meal Tracker API is running");
});


// ------------------------------------------
// CREATE Meal (C of CRUD)
// ------------------------------------------
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


// ------------------------------------------
// READ Meals (R of CRUD)
// Allows filtering by userId, mealType, date
// GET /api/meals?userId=123&mealType=breakfast&date=2025-01-01
// ------------------------------------------
app.get("/api/meals", async (req, res) => {
  try {
    const { userId, mealType, date } = req.query;
    let filter = {};

    if (userId) filter.userId = userId;
    if (mealType) filter.mealType = mealType;
    if (date) {
      filter.date = {
        $gte: new Date(date),
        $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
      };
    }

    const meals = await Meal.find(filter).sort({ date: -1 });
    res.json(meals);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching meals" });
  }
});


// ------------------------------------------
// UPDATE Meal (U of CRUD)
// PUT /api/meals/:id
// ------------------------------------------
app.put("/api/meals/:id", async (req, res) => {
  try {
    const updatedMeal = await Meal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }   // return updated document
    );

    if (!updatedMeal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    res.json(updatedMeal);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error updating meal" });
  }
});


// ------------------------------------------
// DELETE Meal (D of CRUD)
// DELETE /api/meals/:id
// ------------------------------------------
app.delete("/api/meals/:id", async (req, res) => {
  try {
    const deleted = await Meal.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Meal not found" });
    }

    res.json({ message: "Meal deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error deleting meal" });
  }
});


// ------------------------------------------
// Start server
// ------------------------------------------
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
