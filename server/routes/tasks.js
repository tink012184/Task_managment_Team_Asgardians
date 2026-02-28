const express = require("express");
const router = express.Router();
const {
	createTask,
	getTaskById,
	getAllTasks,
	deleteTask,
} = require("../controllers/taskController");

router.post("/", createTask);
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.delete("/:id", deleteTask);

module.exports = router;
