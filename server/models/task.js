const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    dueDate: { type: Date },
    projectId: { type: Number },
  },
  { timestamps: { createdAt: "dateCreated", updatedAt: "dateModified" } },
);

module.exports = mongoose.model("Task", taskSchema);
