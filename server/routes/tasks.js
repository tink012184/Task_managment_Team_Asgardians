const express = require("express");
const router = express.Router();

const {
  createTask,
  getTaskById,
  updateTask,
} = require("../controllers/taskController");

router.post("/", createTask);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);

module.exports = router;
