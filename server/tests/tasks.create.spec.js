// server/tests/tasks.create.spec.js

const Task = require("../models/task");
const { createTask } = require("../controllers/taskController");

describe("createTask controller", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        title: "Test Task",
        description: "Test description",
        priority: "High",
        status: "Pending",
        dueDate: "2026-03-15",
        projectId: 101,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.restoreAllMocks(); // resets spies between tests
  });

  it("returns 201 and the created task when creation succeeds", async () => {
    const createdTask = {
      _id: "65f1c2a9e6b2c3d4e5f67890",
      ...req.body,
    };

    const createSpy = jest.spyOn(Task, "create").mockResolvedValue(createdTask);

    await createTask(req, res);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
      projectId: req.body.projectId,
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdTask);
  });

  it("returns 400 with 'Title must be unique.' when Mongo duplicate key occurs", async () => {
    const dupErr = new Error("E11000 duplicate key error");
    dupErr.code = 11000;

    jest.spyOn(Task, "create").mockRejectedValue(dupErr);

    await createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Title must be unique." });
  });

  it("returns 400 and the error message for other errors", async () => {
    const validationErr = new Error("Task validation failed");
    validationErr.name = "ValidationError";

    jest.spyOn(Task, "create").mockRejectedValue(validationErr);

    await createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: validationErr.message });
  });
});
