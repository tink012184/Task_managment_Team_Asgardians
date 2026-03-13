jest.mock("../models/project", () => ({
  find: jest.fn(),
}));

const Project = require("../models/project");
const { searchProjects } = require("../controllers/projectController");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("searchProjects controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 and [] when q is missing/blank", async () => {
    const req = { query: {} };
    const res = createRes();

    await searchProjects(req, res);

    expect(Project.find).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("returns 200 and matching projects when q is provided", async () => {
    const req = { query: { q: "test" } };
    const res = createRes();

    const projects = [{ _id: "1", name: "Test Project" }];
    Project.find.mockResolvedValue(projects);

    await searchProjects(req, res);

    expect(Project.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(projects);
  });

  it("returns 500 when Project.find throws", async () => {
    const req = { query: { q: "test" } };
    const res = createRes();

    Project.find.mockRejectedValue(new Error("DB error"));

    await searchProjects(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error while searching projects.",
      error: "DB error",
    });
  });
});
