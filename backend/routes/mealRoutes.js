const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { addMeal, getMeals } = require("../controllers/mealController");

router.get("/", getMeals);
router.post("/", addMeal);


module.exports = router;
