require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./db");

// Routes
const authRoutes = require("./routes/auth");
const reportRoutes = require("./routes/report");
const adminRoutes = require("./routes/admin");
const officerRoutes = require("./routes/officer");

const app = express();

/* -------- MIDDLEWARE -------- */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* -------- DATABASE -------- */
connectDB();

/* -------- ROUTES -------- */
app.use("/auth", authRoutes);
app.use("/report", reportRoutes);
app.use("/admin", adminRoutes);
app.use("/officer", officerRoutes);

/* -------- TEST ROUTE -------- */
app.get("/", (req, res) => {
  res.send("Anti-Corruption Portal API Running");
});

/* -------- SERVER LOGIC -------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
