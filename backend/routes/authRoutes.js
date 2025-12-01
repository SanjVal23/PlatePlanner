const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");


router.post("/register", authController.register);
router.post("/login", authController.login);
<<<<<<< HEAD
router.post("/reset-password", authController.resetPassword);
router.put("/profile", auth, authController.updateProfile);
=======
router.get("/verify/:token", authController.verify);
>>>>>>> Authentication

module.exports = router;
