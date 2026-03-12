const mongoose = require("mongoose");

jest.mock("../models/project", () => ({
  findByIdAndDelete: jest.fn(),
}));

const Project = require("../models/project");
const { deleteProject } = require("../controllers/projectController");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("deleteProject controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  // Verifies invalid IDs are rejected before database deletion call.
  it("returns 400 when project id is invalid", async () => {
    const req = {
      params: { id: "invalid-id" },
    };
    const res = createRes();

    jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false);

    await deleteProject(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid project id." });
    expect(Project.findByIdAndDelete).not.toHaveBeenCalled();
  });

  // Verifies valid IDs return 404 when no matching project is found.
  it("returns 404 when no project is found", async () => {
    const req = {
      params: { id: "507f1f77bcf86cd799439011" },
    };
    const res = createRes();

    jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    Project.findByIdAndDelete.mockResolvedValue(null);

    await deleteProject(req, res);

    expect(Project.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Project not found." });
  });

  // Verifies successful delete returns 200 with confirmation message.
  it("returns 200 when project delete succeeds", async () => {
    const req = {
      params: { id: "507f1f77bcf86cd799439011" },
    };
    const res = createRes();

    jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    Project.findByIdAndDelete.mockResolvedValue({ _id: req.params.id });

    await deleteProject(req, res);

    expect(Project.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Project deleted successfully." });
  });
});
