const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjectById,
  getAllProjects,
} = require("../controllers/projectController");

// List all projects (Student C)
router.get("/", getAllProjects);

// Create project (Student A)
router.post("/", createProject);

// Read project by ID (Student B)
router.get("/:id", getProjectById);

module.exports = router;