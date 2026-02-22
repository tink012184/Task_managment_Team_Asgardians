const express = require("express");
const router = express.Router();
const { createTask, getTaskById } = require("../controllers/taskController");

router.post("/", createTask);
router.get("/:id", getTaskById);

module.exports = router;
