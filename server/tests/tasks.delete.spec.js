jest.mock("../models/task", () => ({
  findByIdAndDelete: jest.fn(),
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
const { deleteTask } = require("../controllers/taskController");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("deleteTask controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when task id is invalid", async () => {
    const req = { params: { id: "invalid-id" } };
    const res = createRes();

    Task.db.base.Types.ObjectId.isValid.mockReturnValue(false);

    await deleteTask(req, res);

    expect(Task.findByIdAndDelete).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid task id." });
  });

  it("returns 404 when no task exists for a valid id", async () => {
    const req = { params: { id: "TK01" } };
    const res = createRes();

    Task.db.base.Types.ObjectId.isValid.mockReturnValue(true);
    Task.findByIdAndDelete.mockResolvedValue(null);

    await deleteTask(req, res);

    expect(Task.findByIdAndDelete).toHaveBeenCalledWith("TK01");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Task not found." });
  });

  it("returns 200 when a task is deleted successfully", async () => {
    const req = { params: { id: "TK02" } };
    const res = createRes();

    Task.db.base.Types.ObjectId.isValid.mockReturnValue(true);
    Task.findByIdAndDelete.mockResolvedValue({ _id: "TK02" });

    await deleteTask(req, res);

    expect(Task.findByIdAndDelete).toHaveBeenCalledWith("TK02");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Task deleted successfully.",
    });
  });
});
