require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/meals", require("./routes/mealRoutes"));
app.use("/api/forum", require("./routes/postRoutes"));

// Test route
app.get("/", (req, res) => {
        res.send("Backend is working");
});

(async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 5050;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server due to DB error:', err.message);
        process.exit(1);
    }
})();
