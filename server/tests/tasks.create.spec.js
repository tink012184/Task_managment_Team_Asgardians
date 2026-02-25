

jest.mock("../models/task", () => ({
  create: jest.fn(),
  db: {
    base: {
      Types: {
        ObjectId: {
          isValid: jest.fn(),
        },
      },
    },
  },
}));

const Task = require("../models/task");
const { createTask } = require("../controllers/taskController");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("createTask controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 201 and the created task", async () => {
    const req = {
      body: {
        title: "Task 1",
        description: "desc",
        status: "Pending",
        priority: "Low",
        dueDate: "2026-02-23",
        projectId: 1,
      },
    };
    const res = createRes();

    const created = { _id: "TK01", ...req.body };
    Task.create.mockResolvedValue(created);

    await createTask(req, res);

    expect(Task.create).toHaveBeenCalledWith({
      title: "Task 1",
      description: "desc",
      status: "Pending",
      priority: "Low",
      dueDate: "2026-02-23",
      projectId: 1,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  it("returns 400 when title is duplicated", async () => {
    const req = {
      body: {
        title: "Duplicate",
        description: "",
        status: "Pending",
        priority: "Low",
      },
    };
    const res = createRes();

    const err = new Error("Duplicate key");
    err.code = 11000;
    Task.create.mockRejectedValue(err);

    await createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Title must be unique." });
  });

  it("returns 400 when validation fails", async () => {
    const req = { body: { title: "Bad" } };
    const res = createRes();

    Task.create.mockRejectedValue(new Error("Validation failed"));

    await createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Validation failed" });
  });
});