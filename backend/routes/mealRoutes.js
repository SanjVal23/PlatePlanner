
/*
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Meal = require("../models/Meal");
const mongoose = require("mongoose");

// Convert token user ID into ObjectId
const oid = (id) => new mongoose.Types.ObjectId(id);

// ------------------ GET all meals for user ------------------
router.get("/", auth, async (req, res) => {
  try {
    const meals = await Meal.find({ userId: oid(req.userId) }).sort({ date: -1 });
    res.json(meals);
  } catch (err) {
    console.error("GET meals error:", err);
    res.status(500).json({ error: "Server error fetching meals" });
  }
});

// ------------------ GET single day meals ------------------
router.get("/:date", auth, async (req, res) => {
  try {
    const { date } = req.params;
    const meal = await Meal.findOne({ userId: oid(req.userId), date });

    res.json(meal || {
      date,
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    });

  } catch (err) {
    console.error("GET day meal error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------ SAVE/UPDATE a day's meals ------------------
router.post("/", auth, async (req, res) => {
  try {
    const { date, breakfast, lunch, dinner, snacks } = req.body;

    if (!date) return res.status(400).json({ error: "date is required" });

    const updated = await Meal.findOneAndUpdate(
      {
        userId: oid(req.userId),
        date
      },
      {
        userId: oid(req.userId),
        date,
        breakfast,
        lunch,
        dinner,
        snacks
      },
      { upsert: true, new: true } // create if missing
    );

    res.json(updated);

  } catch (err) {
    console.error("SAVE meal error:", err);
    res.status(500).json({ error: "Server error saving meals" });
  }
});

// ------------------ DELETE day ------------------
router.delete("/:date", auth, async (req, res) => {
  try {
    const { date } = req.params;

    const deleted = await Meal.findOneAndDelete({
      userId: oid(req.userId),
      date
    });

    res.json({ message: "Day deleted", deleted });

  } catch (err) {
    console.error("DELETE day error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------ GET total calories for a day ------------------
router.get("/:date/total", auth, async (req, res) => {
  try {
    const { date } = req.params;

    const meal = await Meal.findOne({
      userId: oid(req.userId),
      date
    });

    if (!meal) {
      return res.json({ date, totalCalories: 0 });
    }

    const total =
      [...meal.breakfast, ...meal.lunch, ...meal.dinner, ...meal.snacks]
        .reduce((sum, m) => sum + (m.calories || 0), 0);

    res.json({
      date,
      totalCalories: total
    });

  } catch (err) {
    console.error("GET total calorie error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/today/total", auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const meal = await Meal.findOne({
      userId: oid(req.userId),
      date: today
    });

    if (!meal) {
      return res.json({ date: today, totalCalories: 0 });
    }

    const total =
      [...meal.breakfast, ...meal.lunch, ...meal.dinner, ...meal.snacks]
        .reduce((sum, m) => sum + (m.calories || 0), 0);

    res.json({
      date: today,
      totalCalories: total
    });

  } catch (err) {
    console.error("TODAY total error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// Get total calories for a specific day
router.get("/:date/calories", auth, async (req, res) => {
  try {
    const { date } = req.params;

    const meal = await Meal.findOne({
      userId: req.userId,
      date
    });

    if (!meal) {
      return res.json({
        date,
        totalCalories: 0,
        meals: []
      });
    }

    // Combine all meals for calorie sum
    const allMeals = [
      ...meal.breakfast,
      ...meal.lunch,
      ...meal.dinner,
      ...meal.snacks
    ];

    const totalCalories = allMeals.reduce(
      (sum, meal) => sum + (meal.calories || 0),
      0
    );

    res.json({
      date,
      totalCalories,
      meals: meal
    });

  } catch (err) {
    console.error("Specific day calorie error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET total calories for a specific date


router.get("/day", auth, async (req, res) => {
  try {
    console.log("GET /api/meals/day HIT");
    console.log("Query:", req.query);
    console.log("User:", req.userId);

    const { date } = req.query;
    if (!date) {
      console.log("Missing date!");
      return res.status(400).json({ error: "Date required" });
    }

    const meals = await Meal.findOne({
      userId: req.userId,
      date: date,
    });

    console.log("Meals returned:", meals);

    if (!meals) {
      return res.json({ date, total: 0, meals: [] });
    }

    const total =
      meals.breakfast.reduce((s, m) => s + m.calories, 0) +
      meals.lunch.reduce((s, m) => s + m.calories, 0) +
      meals.dinner.reduce((s, m) => s + m.calories, 0) +
      meals.snacks.reduce((s, m) => s + m.calories, 0);

    res.json({ date, total, meals });

  } catch (err) {
    console.error("DAY ROUTE ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
*/

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Meal = require("../models/Meal");
const mongoose = require("mongoose");

// Convert JWT user ID → ObjectId
const oid = (id) => new mongoose.Types.ObjectId(id);

/* ============================================================
   ORDER MATTERS — Specific routes FIRST, generic ":date" LAST
   ============================================================ */

router.get("/history", auth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - days);

    const logs = await Meal.find({
      userId: oid(req.userId),
      date: { $gte: startDate.toISOString().split("T")[0] }
    });

    const map = {};

    logs.forEach(log => {
      const dateKey = log.date;
      const total =
        [...log.breakfast, ...log.lunch, ...log.dinner, ...log.snacks].reduce(
          (sum, m) => sum + (m.calories || 0),
          0
        );
      map[dateKey] = total;
    });

    const result = Object.keys(map).map(date => ({
      date,
      totalCalories: map[date],
    }));

    res.json(result);

  } catch (err) {
    console.error("WEEKLY HISTORY ERROR:", err);
    res.status(500).json({ error: "Server error loading history" });
  }
});


// ------------------ GET today's total calories ------------------
router.get("/today/total", auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const meal = await Meal.findOne({
      userId: oid(req.userId),
      date: today,
    });

    if (!meal) {
      return res.json({ date: today, totalCalories: 0 });
    }

    const total =
      [...meal.breakfast, ...meal.lunch, ...meal.dinner, ...meal.snacks].reduce(
        (sum, m) => sum + (m.calories || 0),
        0
      );

    res.json({ date: today, totalCalories: total });
  } catch (err) {
    console.error("TODAY total error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ------------------ GET total calories from query ?date=YYYY-MM-DD ------------------
router.get("/day", auth, async (req, res) => {
  try {
    console.log("GET /api/meals/day HIT");
    console.log("Query:", req.query);
    console.log("User:", req.userId);

    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "Date required" });

    const mealLog = await Meal.findOne({
      userId: oid(req.userId),
      date: date,
    });

    if (!mealLog) {
      return res.json({ date, total: 0, meals: [] });
    }

    const total =
      mealLog.breakfast.reduce((s, m) => s + m.calories, 0) +
      mealLog.lunch.reduce((s, m) => s + m.calories, 0) +
      mealLog.dinner.reduce((s, m) => s + m.calories, 0) +
      mealLog.snacks.reduce((s, m) => s + m.calories, 0);

    res.json({ date, total, meals: mealLog });

  } catch (err) {
    console.error("DAY ROUTE ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// ------------------ GET total calories for a specific date param ------------------
router.get("/:date/total", auth, async (req, res) => {
  try {
    const { date } = req.params;

    const meal = await Meal.findOne({
      userId: oid(req.userId),
      date,
    });

    if (!meal) return res.json({ date, totalCalories: 0 });

    const total =
      [...meal.breakfast, ...meal.lunch, ...meal.dinner, ...meal.snacks].reduce(
        (sum, m) => sum + (m.calories || 0),
        0
      );

    res.json({ date, totalCalories: total });

  } catch (err) {
    console.error("GET total calorie error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ------------------ GET meals + calories for a specific date ------------------
router.get("/:date/calories", auth, async (req, res) => {
  try {
    const { date } = req.params;

    const meal = await Meal.findOne({
      userId: oid(req.userId),
      date,
    });

    if (!meal) {
      return res.json({
        date,
        totalCalories: 0,
        meals: [],
      });
    }

    const allMeals = [
      ...meal.breakfast,
      ...meal.lunch,
      ...meal.dinner,
      ...meal.snacks,
    ];

    const totalCalories = allMeals.reduce(
      (sum, m) => sum + (m.calories || 0),
      0
    );

    res.json({
      date,
      totalCalories,
      meals: meal,
    });

  } catch (err) {
    console.error("Specific day calorie error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


/* ============================================================
   GENERIC DAY ROUTE — MUST BE LAST!!
   ============================================================ */

// ------------------ GET all meals for user ------------------
router.get("/", auth, async (req, res) => {
  try {
    const meals = await Meal.find({ userId: oid(req.userId) }).sort({ date: -1 });
    res.json(meals);
  } catch (err) {
    console.error("GET meals error:", err);
    res.status(500).json({ error: "Server error fetching meals" });
  }
});


// ------------------ GET meals for a single day (fallback) ------------------
router.get("/:date", auth, async (req, res) => {
  try {
    const { date } = req.params;

    const meal = await Meal.findOne({
      userId: oid(req.userId),
      date,
    });

    res.json(
      meal || {
        date,
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
      }
    );

  } catch (err) {
    console.error("GET day meal error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ------------------ SAVE/UPDATE meals ------------------
router.post("/", auth, async (req, res) => {
  try {
    const { date, breakfast, lunch, dinner, snacks } = req.body;

    if (!date) return res.status(400).json({ error: "date is required" });

    const updated = await Meal.findOneAndUpdate(
      {
        userId: oid(req.userId),
        date,
      },
      {
        userId: oid(req.userId),
        date,
        breakfast,
        lunch,
        dinner,
        snacks,
      },
      { upsert: true, new: true }
    );

    res.json(updated);

  } catch (err) {
    console.error("SAVE meal error:", err);
    res.status(500).json({ error: "Server error saving meals" });
  }
});


// ------------------ DELETE a day's meals ------------------
router.delete("/:date", auth, async (req, res) => {
  try {
    const { date } = req.params;

    const deleted = await Meal.findOneAndDelete({
      userId: oid(req.userId),
      date,
    });

    res.json({ message: "Day deleted", deleted });

  } catch (err) {
    console.error("DELETE day error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
