const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mealType: { type: String, required: true },
  recipeName: { type: String, required: true },
  calories: { type: Number, required: true },
  date: { type: String, required: true }
});

module.exports = mongoose.model("Meal", mealSchema);
