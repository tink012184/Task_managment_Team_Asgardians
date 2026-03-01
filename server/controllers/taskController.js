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

// ✅ DELETE (Week 2)
// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task id." });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.status(200).json({ message: "Task deleted successfully." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
// ✅ SEARCH (Week 2)
// GET /api/tasks/search?q=keyword
exports.searchTasks = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();

    // If no query provided, return empty array (keeps it simple)
    if (!q) {
      return res.status(200).json([]);
    }

    const regex = new RegExp(q, "i");

    const results = await Task.find({
      $or: [{ title: regex }, { description: regex }],
    });

    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
// ✅ LIST ALL TASKS (Week 1)
// GET /api/tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    return res.status(200).json(tasks);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};