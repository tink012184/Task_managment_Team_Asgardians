jest.mock("../models/project", () => ({
  find: jest.fn(),
}));

const Project = require("../models/project");
const { getAllProjects } = require("../controllers/projectController");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("getAllProjects controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: returns 200 and array (empty)
  it("returns 200 and an empty array when no projects exist", async () => {
    const req = {};
    const res = createRes();

    Project.find.mockResolvedValue([]);

    await getAllProjects(req, res);

    expect(Project.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  // Test 2: returns 200 and array (with projects)
  it("returns 200 and a list of projects when projects exist", async () => {
    const req = {};
    const res = createRes();

    const projects = [
      { _id: "p1", name: "Project A" },
      { _id: "p2", name: "Project B" },
    ];
    Project.find.mockResolvedValue(projects);

    await getAllProjects(req, res);

    expect(Project.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(projects);
  });

  // Test 3: errors return 500
  it("returns 500 when Project.find throws an error", async () => {
    const req = {};
    const res = createRes();

    Project.find.mockRejectedValue(new Error("DB error"));

    await getAllProjects(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error while listing projects.",
      error: "DB error",
    });
  });
});
