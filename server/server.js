require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const tasksRouter = require("./routes/tasks");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/tasks", tasksRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ API running on http://localhost:${PORT}`),
);
