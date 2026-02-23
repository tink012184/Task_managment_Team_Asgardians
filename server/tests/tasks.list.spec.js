jest.mock("../models/task", () => ({
  find: jest.fn(),
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
const { getAllTasks } = require("../controllers/taskController");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("getAllTasks controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 and a list of tasks", async () => {
    const req = {};
    const res = createRes();

    const tasks = [
      { _id: "T1", title: "Task 1", status: "Pending", priority: "Low" },
      { _id: "T2", title: "Task 2", status: "In Progress", priority: "High" },
    ];

    Task.find.mockResolvedValue(tasks);

    await getAllTasks(req, res);

    expect(Task.find).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tasks);
  });

  it("returns 200 and an empty array when there are no tasks", async () => {
    const req = {};
    const res = createRes();

    Task.find.mockResolvedValue([]);

    await getAllTasks(req, res);

    expect(Task.find).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("returns 500 when an error occurs", async () => {
    const req = {};
    const res = createRes();

    Task.find.mockRejectedValue(new Error("DB error"));

    await getAllTasks(req, res);

    expect(Task.find).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "DB error" });
  });
});