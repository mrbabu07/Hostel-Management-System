const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/User.model");
const Menu = require("../src/models/Menu.model");

describe("Menu API", () => {
  let managerToken;
  let studentToken;

  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGODB_URI_TEST || process.env.MONGODB_URI,
    );

    // Create manager
    const manager = await User.create({
      name: "Test Manager",
      email: "manager@test.com",
      password: "Manager@123",
      role: "manager",
    });

    // Create student
    const student = await User.create({
      name: "Test Student",
      email: "student@test.com",
      password: "Student@123",
      role: "student",
      rollNumber: "TEST001",
    });

    // Login manager
    const managerRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "manager@test.com", password: "Manager@123" });
    managerToken = managerRes.body.data.token;

    // Login student
    const studentRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "student@test.com", password: "Student@123" });
    studentToken = studentRes.body.data.token;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Menu.deleteMany({});
    await mongoose.connection.close();
  });

  describe("POST /api/v1/menus", () => {
    it("should create menu as manager", async () => {
      const res = await request(app)
        .post("/api/v1/menus")
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          date: "2024-01-20",
          mealType: "breakfast",
          items: [
            { name: "Idli", description: "Steamed rice cakes" },
            { name: "Sambar", description: "Lentil soup" },
          ],
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("mealType", "breakfast");
    });

    it("should not create menu as student", async () => {
      const res = await request(app)
        .post("/api/v1/menus")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          date: "2024-01-20",
          mealType: "lunch",
          items: [{ name: "Rice", description: "Steamed rice" }],
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe("GET /api/v1/menus", () => {
    it("should get menus for a date", async () => {
      const res = await request(app)
        .get("/api/v1/menus?date=2024-01-20")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
