const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
  try {
    const { name, email, password, firstName, lastName } = req.body;

    // Prevent duplicate users
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create user (not verified yet)
    const newUser = new User({
      name: name || `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
<<<<<<< HEAD
      firstName: firstName || name,
      lastName: lastName || '',
      allergies: [],
      dietaryRestrictions: []
=======
      isVerified: false,
      verificationToken
>>>>>>> Authentication
    });

    await newUser.save();

    // Prepare transporter.
    // If SMTP env vars are provided use them (e.g. SendGrid), otherwise fall back to Ethereal for dev.
    let transporter;
    const hasSmtp = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
    if (hasSmtp) {
      const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
      const smtpSecure = (process.env.SMTP_SECURE === 'true') || smtpPort === 465;
      console.log('Using real SMTP ->', process.env.SMTP_HOST, smtpPort, 'secure=', smtpSecure);
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      console.log('No SMTP settings found, using Ethereal test account for email previews');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

<<<<<<< HEAD
    res.status(201).json({
      token,
      userId: newUser._id,
      user: {
        username: newUser.email,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        allergies: newUser.allergies,
        dietaryRestrictions: newUser.dietaryRestrictions
      }
    });
=======
    // Build verification link to frontend verify page
    const frontendBase = process.env.FRONTEND_URL || "http://localhost:3000";
    const verifyLink = `${frontendBase}/verify/${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'no-reply@plateplanner.local',
      to: email,
      subject: 'Plate Planner - Verify your email',
      text: `Hi ${name || ''},\n\nPlease verify your email by clicking the link: ${verifyLink}\n\nIf you did not sign up, ignore this email.`,
      html: `<p>Hi ${name || ''},</p><p>Please verify your email by clicking the link below:</p><p><a href="${verifyLink}">Verify your account</a></p>`
    };

    let info;
    let preview;
    try {
      info = await transporter.sendMail(mailOptions);
      if (nodemailer.getTestMessageUrl && info) {
        preview = nodemailer.getTestMessageUrl(info);
        console.log('Preview email URL:', preview);
      }
    } catch (emailErr) {
      console.error('Error sending verification email:', emailErr);
      const responsePayload = { message: 'User created but verification email failed to send.' };
      if (preview) responsePayload.previewUrl = preview;
      if (process.env.NODE_ENV !== 'production') responsePayload.emailError = emailErr.message;
      return res.status(201).json(responsePayload);
    }

    const responsePayload = { message: 'User created. Check your email for verification.' };
    if (preview) responsePayload.previewUrl = preview;

    res.status(201).json(responsePayload);
>>>>>>> Authentication

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};

exports.verify = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ error: 'Missing token' });

    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ error: 'Invalid token or user not found' });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('VERIFY ERROR:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user existence
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Prevent login if email not verified
    if (!user.isVerified) {
      return res.status(401).json({ error: 'Email not verified. Please check your inbox.' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      userId: user._id,
      user: {
        username: user.email,
        email: user.email,
        firstName: user.firstName || user.name,
        lastName: user.lastName || '',
        allergies: user.allergies || [],
        dietaryRestrictions: user.dietaryRestrictions || [],
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        goalType: user.goalType,
        calorieGoal: user.calorieGoal
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and new password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ error: "Password reset failed" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const { firstName, lastName, email, gender, height, weight, goalType, calorieGoal, allergies, dietaryRestrictions } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update basic info fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (email !== undefined) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }
      user.email = email;
    }
    
    // Update health/goal fields
    if (gender !== undefined) user.gender = gender;
    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (goalType !== undefined) user.goalType = goalType;
    if (calorieGoal !== undefined) user.calorieGoal = calorieGoal;
    if (allergies !== undefined) user.allergies = allergies;
    if (dietaryRestrictions !== undefined) user.dietaryRestrictions = dietaryRestrictions;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        username: user.email,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        allergies: user.allergies,
        dietaryRestrictions: user.dietaryRestrictions,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        goalType: user.goalType,
        calorieGoal: user.calorieGoal
      }
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ error: "Profile update failed" });
  }
};
