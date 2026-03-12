const mongoose = require("mongoose");

jest.mock("../models/project", () => ({
  findByIdAndUpdate: jest.fn(),
}));

const Project = require("../models/project");
const { updateProject } = require("../controllers/projectController");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("updateProject controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("returns 400 when project id is invalid", async () => {
    const req = {
      params: { id: "invalid-id" },
      body: {
        name: "Updated Project",
        description: "Updated description",
        startDate: "2026-03-12",
      },
    };
    const res = createRes();

    jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(false);

    await updateProject(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid project id." });
    expect(Project.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("returns 404 when no project is found", async () => {
    const req = {
      params: { id: "507f1f77bcf86cd799439011" },
      body: {
        name: "Updated Project",
        description: "Updated description",
        startDate: "2026-03-12",
      },
    };
    const res = createRes();

    jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    Project.findByIdAndUpdate.mockResolvedValue(null);

    await updateProject(req, res);

    expect(Project.findByIdAndUpdate).toHaveBeenCalledWith(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate,
      },
      { new: true, runValidators: true },
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Project not found." });
  });

  it("returns 200 and the updated project when update succeeds", async () => {
    const req = {
      params: { id: "507f1f77bcf86cd799439011" },
      body: {
        name: "Updated Project",
        description: "Updated description",
        startDate: "2026-03-12",
      },
    };
    const res = createRes();

    const updatedProject = {
      _id: req.params.id,
      ...req.body,
    };

    jest.spyOn(mongoose.Types.ObjectId, "isValid").mockReturnValue(true);
    Project.findByIdAndUpdate.mockResolvedValue(updatedProject);

    await updateProject(req, res);

    expect(Project.findByIdAndUpdate).toHaveBeenCalledWith(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate,
      },
      { new: true, runValidators: true },
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedProject);
  });
});
