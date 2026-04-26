// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");

// const connectDB = require("./db");

// // Routes
// const authRoutes = require("./routes/auth");
// const reportRoutes = require("./routes/report");
// const adminRoutes = require("./routes/admin");
// const officerRoutes = require("./routes/officer");

// const app = express();

// /* -------- MIDDLEWARE -------- */
// app.use(cors());
// app.use(express.json());
// app.use("/uploads", express.static("uploads"));

// /* -------- DATABASE -------- */
// connectDB();

// /* -------- ROUTES -------- */
// app.use("/auth", authRoutes);
// app.use("/report", reportRoutes);
// app.use("/admin", adminRoutes);
// app.use("/officer", officerRoutes);

// /* -------- TEST ROUTE -------- */
// app.get("/", (req, res) => {
//   res.send("Anti-Corruption Portal API Running");
// });

// /* -------- SERVER LOGIC -------- */
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


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

/* -------- CORS CONFIG -------- */
const allowedOrigins = [
  "http://localhost:5173", // local frontend
  "https://your-app.netlify.app" // deployed frontend (CHANGE THIS)
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

/* -------- MIDDLEWARE -------- */
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

/* -------- ERROR HANDLER (IMPORTANT) -------- */
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({
    error: err.message || "Server Error"
  });
});

/* -------- SERVER -------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});