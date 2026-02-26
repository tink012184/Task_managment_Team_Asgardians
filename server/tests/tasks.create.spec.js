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
jest.mock("../models/task", () => ({
  create: jest.fn(),
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

  // Test 1: Successful create should return 201 and the created task.
  it("returns 201 and the created task when Task.create succeeds", async () => {
    const req = {
      body: {
        title: "New Task",
        description: "Do the thing",
        status: "Pending",
        priority: "Low",
        dueDate: "2026-02-21",
        projectId: "P1",
      },
    };
    const res = createRes();

    const created = {
      _id: "T100",
      ...req.body,
    };

    Task.create.mockResolvedValue(created);

    await createTask(req, res);

    expect(Task.create).toHaveBeenCalledWith({
      title: "New Task",
      description: "Do the thing",
      status: "Pending",
      priority: "Low",
      dueDate: "2026-02-21",
      projectId: "P1",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  // Test 2: Duplicate title (Mongo code 11000) should return 400 with the unique title message.
  it("returns 400 when Mongo throws a duplicate key error (code 11000)", async () => {
    const req = {
      body: {
        title: "Duplicate Title",
        description: "",
        status: "Pending",
        priority: "Low",
      },
    };
    const res = createRes();

    Task.create.mockRejectedValue({ code: 11000 });

    await createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Title must be unique." });
  });

  // Test 3: Any other error should return 400 with the error message.
  it("returns 400 and the error message for non-duplicate errors", async () => {
    const req = {
      body: {
        title: "Any Title",
        description: "",
        status: "Pending",
        priority: "Low",
      },
    };
    const res = createRes();

    Task.create.mockRejectedValue(new Error("Validation failed"));

    await createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Validation failed" });
  });
});
