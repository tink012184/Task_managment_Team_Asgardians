const express = require("express");
const router = express.Router();
const { createProject, getProjectById } = require("../controllers/projectController");

router.post("/", createProject);
router.get("/:id", getProjectById);

module.exports = router;
