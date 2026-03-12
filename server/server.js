require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const tasksRouter = require("./routes/tasks");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "https://task-managment-team-asgardians.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/tasks", tasksRouter);
app.use("/api/projects", projectRoutes);

app.get("/", (_req, res) => {
  res.send("Task Management API is running.");
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`✅ API running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

startServer();
