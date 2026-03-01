const express = require("express");
const router = express.Router();

const {
  createTask,
  getAllTasks, // ✅ add this
  getTaskById,
  updateTask,
  deleteTask,
  searchTasks,
  getAllTasks,
} = require("../controllers/taskController");

// CREATE
router.post("/", createTask);

// READ ALL  ✅ THIS FIXES YOUR ERROR
router.get("/", getAllTasks);

// READ BY ID
router.get("/:id", getTaskById);

// UPDATE
router.put("/:id", updateTask);

// DELETE
router.delete("/:id", deleteTask);

module.exports = router;
