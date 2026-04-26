const router = require("express").Router();
const Report = require("../models/Report");
const User = require("../models/User");
const auth = require("../middleware/auth");

const bcrypt = require("bcryptjs");

router.post("/assign", auth(["admin"]), async (req, res) => {
  const { reportId, officerId } = req.body;

  const active = await Report.countDocuments({
    assignedOfficer: officerId,
    status: { $ne: "Completed" }
  });

  if (active >= 2) {
    return res.status(400).json({ message: "Officer already has 2 cases" });
  }

  await Report.findByIdAndUpdate(reportId, {
    assignedOfficer: officerId,
    status: "Under Investigation"
  });

  res.json({ message: "Assigned successfully" });
});

router.get("/reports", auth(["admin"]), async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});

router.get("/officers", auth(["admin"]), async (req, res) => {
  try {
    const officers = await User.find({ role: "officer" }).select("name email isActive");

    // Calculate active cases for each officer
    const officersWithLoad = await Promise.all(
      officers.map(async (officer) => {
        const count = await Report.countDocuments({
          assignedOfficer: officer._id,
          status: { $ne: "Completed" }
        });
        return {
          ...officer.toObject(),
          activeCases: count
        };
      })
    );

    res.json(officersWithLoad);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch officers" });
  }
});

router.post("/officers", auth(["admin"]), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const officer = await User.create({
      name,
      email,
      password: hashed,
      role: "officer",
      isActive: true
    });

    res.json(officer);
  } catch (err) {
    res.status(500).json({ message: "Failed to create officer" });
  }
});

router.put("/officers/:id/toggle", auth(["admin"]), async (req, res) => {
  try {
    const officer = await User.findById(req.params.id);
    if (!officer) return res.status(404).json({ message: "Officer not found" });

    officer.isActive = !officer.isActive;
    await officer.save();

    res.json({ message: "Officer status updated", isActive: officer.isActive });
  } catch (err) {
    res.status(500).json({ message: "Failed to update officer" });
  }
});

module.exports = router;
