const router = require("express").Router();
const Report = require("../models/Report");
const auth = require("../middleware/auth");
const multer = require("multer");

const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post(
  "/",
  auth(["user"]),
  upload.array("files"),
  async (req, res) => {
    try {
      const files = req.files.map(f => f.filename);

      const report = await Report.create({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        location: req.body.location,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        files,
        userId: req.user.id
      });

      res.json(report);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  }
);

// User can view ONLY their reports
router.get("/my", auth(["user"]), async (req, res) => {
  const reports = await Report.find({ userId: req.user.id });
  res.json(reports);
});

// Update a report (only if not assigned to an officer)
router.put("/:id", auth(["user"]), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Verify the report belongs to the user
    if (report.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own reports" });
    }

    // Verify the report has not been assigned to an officer
    if (report.assignedOfficer) {
      return res.status(403).json({ message: "Cannot edit a report that has been assigned to an officer" });
    }

    // Update allowed fields
    const { title, description, category, location, latitude, longitude } = req.body;

    if (title !== undefined) report.title = title;
    if (description !== undefined) report.description = description;
    if (category !== undefined) report.category = category;
    if (location !== undefined) report.location = location;
    if (latitude !== undefined) report.latitude = latitude;
    if (longitude !== undefined) report.longitude = longitude;

    await report.save();
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
