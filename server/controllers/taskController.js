const Task = require("../models/task");

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
