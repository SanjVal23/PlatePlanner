const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    mealType: { 
      type: String, 
      enum: ["breakfast", "lunch", "dinner", "snack"], 
      required: true 
    },
    foodItem: { type: String, required: true },
    calories: { type: Number, required: true },
    imageUrl: String,
    notes: String,
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meal", MealSchema);
