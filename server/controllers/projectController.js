const Project = require("../models/project");
const mongoose = require("mongoose");

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

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project id." });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({
      message: "Server error while reading project.",
      error: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjectById,
};
