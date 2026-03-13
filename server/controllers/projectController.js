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

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({
      message: "Server error while listing projects.",
      error: error.message,
    });
  }
};

const searchProjects = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.status(200).json([]);

    const regex = new RegExp(q, "i");
    const projects = await Project.find({
      $or: [{ name: regex }, { description: regex }],
    });

    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({
      message: "Server error while searching projects.",
      error: error.message,
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, startDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project id." });
    }

    if (!name || !description || !startDate) {
      return res.status(400).json({
        message: "Name, description, and start date are required.",
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { name, description, startDate },
      { new: true, runValidators: true },
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found." });
    }

    return res.status(200).json(updatedProject);
  } catch (error) {
    return res.status(500).json({
      message: "Server error while updating project.",
      error: error.message,
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project id." });
    }

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found." });
    }

    return res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while deleting project.",
      error: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjectById,
  getAllProjects,
  searchProjects,
  updateProject,
  deleteProject,
};
