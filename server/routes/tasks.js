const express = require("express");
const router = express.Router();

const {
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  searchTasks,
  getAllTasks,
} = require("../controllers/taskController");

router.post("/", createTask);
router.get("/search", searchTasks);
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
