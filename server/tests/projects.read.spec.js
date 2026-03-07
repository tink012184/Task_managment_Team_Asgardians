const { getProjectById } = require("../controllers/projectController");
const Project = require("../models/project");

describe("getProjectById controller", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      params: {
        id: "507f1f77bcf86cd799439011",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Verifies invalid IDs are rejected with 400 error.
  it("should return 400 when project id is invalid", async () => {
    req.params.id = "invalid-id";

    await getProjectById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid project id." });
  });

  // Verifies a missing project returns 404 when no document is found but the ID is valid.
  it("should return 404 when project does not exist", async () => {
    jest.spyOn(Project, "findById").mockResolvedValue(null);

    await getProjectById(req, res);

    expect(Project.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Project not found." });
  });

  // Verifies an existing ID returns 200 with the project payload.
  it("should return 200 and project when id exists", async () => {
    const mockProject = {
      _id: "507f1f77bcf86cd799439011",
      name: "Project Alpha",
      description: "Read endpoint test",
      startDate: "2026-03-06",
    };

    jest.spyOn(Project, "findById").mockResolvedValue(mockProject);

    await getProjectById(req, res);

    expect(Project.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockProject);
  });
});
