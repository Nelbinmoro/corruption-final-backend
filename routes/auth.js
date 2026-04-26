const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/* -------- SIGNUP -------- */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      role: "user"
    });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

/* -------- LOGIN -------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login Attempt:", { email, password });

    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    if (!user) {
      console.log("Login Failed: User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.isActive === false) {
      return res.status(403).json({ message: "Account is disabled. Contact admin." });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      console.log("Login Failed: Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

router.get("/me", require("../middleware/auth")(["user", "admin", "officer"]), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
