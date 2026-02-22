jest.mock("../models/task", () => ({
  findById: jest.fn(),
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
const { getTaskById } = require("../controllers/taskController");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("getTaskById controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Verifies the controller rejects wrong ID formats with a 400 response.
  it("returns 400 when task id is invalid", async () => {
    const req = { params: { id: "invalid-id" } };
    const res = createRes();

    Task.db.base.Types.ObjectId.isValid.mockReturnValue(false);

    await getTaskById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid task id." });
  });

  // Test 2: Verifies a valid ID with no matching record found returns a 404 response.
  it("returns 404 when no task exists for a valid id", async () => {
    const req = { params: { id: "TK01" } };
    const res = createRes();

    Task.db.base.Types.ObjectId.isValid.mockReturnValue(true);
    Task.findById.mockResolvedValue(null);

    await getTaskById(req, res);

    expect(Task.findById).toHaveBeenCalledWith("TK01");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Task not found." });
  });

  // Test 3: Verifies a successful lookup returns HTTP 200 and returns the task found in the database which sends JSON response with the task data. 
  it("returns 200 and the task when found", async () => {
    const req = { params: { id: "TK02" } };
    const res = createRes();
    const task = {
      _id: "TK02",
      title: "Build read API",
      status: "Pending",
      priority: "High",
    };

    Task.db.base.Types.ObjectId.isValid.mockReturnValue(true);
    Task.findById.mockResolvedValue(task);

    await getTaskById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(task);
  });
});
