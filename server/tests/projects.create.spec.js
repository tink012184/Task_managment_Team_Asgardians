const { createProject } = require("../controllers/projectController");
const Project = require("../models/project");

describe("createProject controller", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {
        name: "Project Alpha",
        description: "This is a test project",
        startDate: "2026-03-06",
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

  it("should return 400 if required fields are missing", async () => {
    req.body = {
      name: "",
      description: "",
      startDate: "",
    };

    await createProject(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Name, description, and start date are required.",
    });
  });

  it("should create a new project and return 201", async () => {
    const mockSavedProject = {
      _id: "P1001",
      name: "Project Alpha",
      description: "This is a test project",
      startDate: "2026-03-06",
    };

    jest.spyOn(Project.prototype, "save").mockResolvedValue(mockSavedProject);

    await createProject(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockSavedProject);
  });

  it("should return 500 if there is a server error", async () => {
    jest
      .spyOn(Project.prototype, "save")
      .mockRejectedValue(new Error("Database failure"));

    await createProject(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error while creating project.",
      error: "Database failure",
    });
  });
});
