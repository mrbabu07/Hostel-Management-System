const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/User.model");

describe("Auth API", () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGODB_URI_TEST || process.env.MONGODB_URI,
    );
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a new student", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        name: "Test Student",
        email: "test@student.com",
        password: "Test@123",
        role: "student",
        rollNumber: "TEST001",
        roomNumber: "A101",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("token");
      expect(res.body.data.user).toHaveProperty("email", "test@student.com");
    });

    it("should not register with duplicate email", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        name: "Test Student 2",
        email: "test@student.com",
        password: "Test@123",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should validate required fields", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        name: "Test",
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "test@student.com",
        password: "Test@123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("token");
    });

    it("should not login with invalid credentials", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "test@student.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/auth/me", () => {
    let token;

    beforeAll(async () => {
      const res = await request(app).post("/api/v1/auth/login").send({
        email: "test@student.com",
        password: "Test@123",
      });
      token = res.body.data.token;
    });

    it("should get current user with valid token", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty("email", "test@student.com");
    });

    it("should not get user without token", async () => {
      const res = await request(app).get("/api/v1/auth/me");

      expect(res.statusCode).toBe(401);
    });
  });
});
