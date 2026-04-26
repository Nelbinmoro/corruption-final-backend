const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: String,
  description: String,
  files: [String],
  category: { type: String, required: true },
  location: String,
  latitude: Number,
  longitude: Number,
  status: { type: String, default: "Pending" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  officerVerdict: String,
  officerNotes: String
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
