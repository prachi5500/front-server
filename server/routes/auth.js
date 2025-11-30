import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authRequired } from '../middleware/auth.js';
import crypto from "crypto";
import nodemailer from "nodemailer";


const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});




router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const exists = await User.findOne({ email }).lean();
    if (exists) return res.status(409).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const usersCount = await User.countDocuments();
    const role = usersCount === 0 ? 'admin' : 'user';
    const user = await User.create({ email, passwordHash, role });
    const token = jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: 'Login failed' });
  }
});


// FORGOT PASSWORD (Request Reset)
router.post("/request-reset", async (req, res) => {
  try {
    const { email } = req.body;
// ........
    // console.log("Finding user with token:", token);

    const user = await User.findOne({ email });
    if (!user) {
      // we don't reveal that user does not exist
      return res.json({ message: "If the account exists, reset email sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetLink = `${process.env.CORS_ORIGIN}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.CONTACT_FROM,
      to: email,
      subject: "Password Reset",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <br/><br/>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    return res.json({ message: "Reset link sent to your email." });
  } catch (e) {
    console.error("RESET EMAIL FAILED:", e);
    return res.status(500).json({ error: "Could not send reset email" });
  }
});




// reset password route
router.post("/reset-password", async (req, res) => {
  try {
    // ........

console.log("REQ BODY FROM FRONTEND:", req.body);

const { token, password } = req.body;
console.log("TOKEN RECEIVED:", token);
console.log("PASSWORD RECEIVED:", password);

    // const { token, password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // token still valid
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.json({ message: "Password reset successful." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to reset password" });
  }
});




router.get('/me', authRequired, async (req, res) => {
  res.json({ user: { id: req.user._id, email: req.user.email, role: req.user.role } });
});




export default router;
