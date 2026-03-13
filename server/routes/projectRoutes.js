const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjectById,
  getAllProjects,
  searchProjects,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

// List all projects (Student C)
router.get("/", getAllProjects);

// Create project (Student A)
router.post("/", createProject);

// Search projects
router.get("/search", searchProjects);

// Read project by ID (Student B)
router.get("/:id", getProjectById);

// Update project (Student A)
router.put("/:id", updateProject);

// Delete project (Student B)
router.delete("/:id", deleteProject);

module.exports = router;
