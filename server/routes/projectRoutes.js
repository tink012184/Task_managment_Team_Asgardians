const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjectById,
  getAllProjects,
  updateProject,
} = require("../controllers/projectController");

// List all projects (Student C)
router.get("/", getAllProjects);

// Create project (Student A)
router.post("/", createProject);

// Read project by ID (Student B)
router.get("/:id", getProjectById);

// Update project (Student A)
router.put("/:id", updateProject);

module.exports = router;
