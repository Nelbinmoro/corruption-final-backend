const router = require("express").Router();
const Report = require("../models/Report");
const auth = require("../middleware/auth");

router.get("/cases", auth(["officer"]), async (req, res) => {
  const cases = await Report.find({ assignedOfficer: req.user.id })
    .select("title description files status location latitude longitude createdAt updatedAt officerVerdict officerNotes");
  res.json(cases);
});

router.put("/complete/:id", auth(["officer"]), async (req, res) => {
  const { verdict, notes } = req.body;
  await Report.findByIdAndUpdate(req.params.id, {
    status: "Completed",
    officerVerdict: verdict,
    officerNotes: notes
  });
  res.json({ message: "Case completed" });
});

module.exports = router;
