const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/email");

// ---------------- REGISTER ----------------
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);

    const token = crypto.randomBytes(32).toString("hex");

    const user = new User({
      name,
      email,
      password: hashed,
      isVerified: false,
      verificationToken: token,
      verificationExpires: Date.now() + 60 * 60 * 1000 // 1 hr
    });

    await user.save();

    // Build verification link
    const verifyURL = `${process.env.FRONTEND_URL}/verify/${token}`;

    const html = `
      <h2>Verify Your PlatePlanner Account</h2>
      <p>Click the link below to activate your account:</p>
      <a href="${verifyURL}" target="_blank">Verify Account</a>
    `;

    const { previewUrl } = await sendEmail({
      to: email,
      subject: "Verify your PlatePlanner account",
      html
    });

    res.json({
      message: "User registered. Please check your email.",
      previewUrl
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error during registration" });
  }
};

// ---------------- VERIFY ----------------
exports.verify = async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    // redirect to login page
    return res.redirect(`${process.env.FRONTEND_URL}/setup`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error during verification" });
  }
};

// ---------------- LOGIN ----------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(403).json({ error: "Please verify your account first." });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: "Invalid credentials" });

    res.json({
      message: "Login successful",
      user
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during login" });
  }
};
