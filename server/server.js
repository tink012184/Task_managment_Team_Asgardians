require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const tasksRouter = require("./routes/tasks");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

// Allow Angular dev server to call the API
app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json());

// API routes
app.use("/api/tasks", tasksRouter);
app.use("/api/projects", projectRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`✅ API running on http://localhost:${PORT}`),
    );
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

startServer();
