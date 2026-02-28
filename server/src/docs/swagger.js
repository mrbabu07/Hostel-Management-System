const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart Hostel/Mess Management API",
      version: "1.0.0",
      description:
        "Complete API documentation for Hostel/Mess Management System",
      contact: {
        name: "API Support",
        email: "support@hostelmess.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api/v1",
        description: "Development server",
      },
      {
        url: "https://api.hostelmess.com/api/v1",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["student", "manager", "admin"] },
            rollNumber: { type: "string" },
            roomNumber: { type: "string" },
            phone: { type: "string" },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Menu: {
          type: "object",
          properties: {
            _id: { type: "string" },
            date: { type: "string", format: "date" },
            mealType: {
              type: "string",
              enum: ["breakfast", "lunch", "dinner"],
            },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                },
              },
            },
            createdBy: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Bill: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            month: { type: "number" },
            year: { type: "number" },
            breakfastCount: { type: "number" },
            breakfastAmount: { type: "number" },
            lunchCount: { type: "number" },
            lunchAmount: { type: "number" },
            dinnerCount: { type: "number" },
            dinnerAmount: { type: "number" },
            totalAmount: { type: "number" },
            isPaid: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Complaint: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            category: { type: "string" },
            status: {
              type: "string",
              enum: ["pending", "in-progress", "resolved", "rejected"],
            },
            adminNote: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            errors: { type: "array", items: { type: "object" } },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "object" },
            message: { type: "string" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
