const Project = require("../models/project");

const createProject = async (req, res) => {
  try {
    const { name, description, startDate } = req.body;

    if (!name || !description || !startDate) {
      return res.status(400).json({
        message: "Name, description, and start date are required.",
      });
    }

    const newProject = new Project({
      name,
      description,
      startDate,
    });

    const savedProject = await newProject.save();

    return res.status(201).json(savedProject);
  } catch (error) {
    return res.status(500).json({
      message: "Server error while creating project.",
      error: error.message,
    });
  }
};

module.exports = {
  createProject,
};
