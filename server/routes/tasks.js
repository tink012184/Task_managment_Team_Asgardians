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

// READ ALL  ✅ THIS FIXES YOUR ERROR
router.get("/", getAllTasks);

// READ BY ID
router.get("/:id", getTaskById);

// UPDATE
router.put("/:id", updateTask);

// DELETE
router.delete("/:id", deleteTask);

//SEARCH
router.get("/:id", searchTasks);

module.exports = router;
