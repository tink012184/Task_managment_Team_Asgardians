const mongoose = require("mongoose");
const Task = require("../models/task");

// ✅ CREATE
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, projectId } =
      req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      projectId,
    });

    return res.status(201).json(task);
  } catch (err) {
    // Duplicate title error from Mongo
    if (err && err.code === 11000) {
      return res.status(400).json({ message: "Title must be unique." });
    }
    return res.status(400).json({ message: err.message });
  }
};

// ✅ GET BY ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Use mongoose validator
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task id." });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.status(200).json(task);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE (Week 2)
// PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task id." });
    }

    // Only update allowed fields (prevents unexpected fields being written)
    const { title, description, status, priority, dueDate, projectId } =
      req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, status, priority, dueDate, projectId },
      { new: true, runValidators: true },
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.status(200).json(updatedTask);
  } catch (err) {
    // Duplicate title error from Mongo
    if (err && err.code === 11000) {
      return res.status(400).json({ message: "Title must be unique." });
    }

    // Validation errors, etc.
    return res.status(400).json({ message: err.message });
  }
};
