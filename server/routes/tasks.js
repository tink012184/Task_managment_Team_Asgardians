const express = require("express");
const router = express.Router();

const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  searchTasks,
} = require("../controllers/taskController");

// CREATE
router.post("/", createTask);

// GET ALL TASKS
router.get("/", getAllTasks);

// SEARCH
router.get("/search", searchTasks);

// GET BY ID
router.get("/:id", getTaskById);

// UPDATE
router.put("/:id", updateTask);

// DELETE
router.delete("/:id", deleteTask);

module.exports = router;
