const mongoose = require("mongoose");

jest.mock("../models/task", () => ({
  findByIdAndUpdate: jest.fn(),
}));

beforeEach(() => {
  req = { params: {}, body: {} };
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
});

const Task = require("../models/task");
const { updateTask } = require("../controllers/taskController");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("updateTask controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Invalid ObjectId should return 400.
  it("returns 400 when task id is invalid", async () => {
    const req = {
      params: { id: "invalid-id" },
      body: {
        title: "Updated",
        status: "Pending",
        priority: "Low",
      },
    };
    const res = createRes();

    // Mock ObjectId validation to fail
    jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false);

    await updateTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid task id." });
    expect(Task.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  // Test 2: Task not found should return 404.
  it("returns 404 when no task is found", async () => {
    const req = {
      params: { id: "65f0c1a1b2c3d4e5f6a7b8c9" },
      body: {
        title: "Updated",
        status: "Pending",
        priority: "Low",
      },
    };
    const res = createRes();

    jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);

    Task.findByIdAndUpdate.mockResolvedValue(null);

    await updateTask(req, res);

    expect(Task.findByIdAndUpdate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Task not found." });
  });

  // Test 3: Successful update should return 200 and updated task.
  it("returns 200 and the updated task when update succeeds", async () => {
    const req = {
      params: { id: "65f0c1a1b2c3d4e5f6a7b8c9" },
      body: {
        title: "Updated Title",
        description: "Updated Desc",
        status: "In Progress",
        priority: "High",
        dueDate: "2026-02-21",
        projectId: "P1",
      },
    };
    const res = createRes();

    jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);

    const updatedDoc = {
      _id: req.params.id,
      ...req.body,
    };

    Task.findByIdAndUpdate.mockResolvedValue(updatedDoc);

    await updateTask(req, res);

    expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
        projectId: req.body.projectId,
      },
      { new: true, runValidators: true },
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedDoc);
  });
});
