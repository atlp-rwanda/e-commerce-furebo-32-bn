import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce APIs Documentation",
      version: "1.0.0",
      description: "APIs for E-Commerce Team Project",
      license: {
        name: "ISC",
      },
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Local Development Server for Swagger",
      },
      {
        url: "https://e-commerce-furebo-32-bn-1.onrender.com",
        description: "Production server (HTTPS)",
      },
    ],
    tags: [
      {
        name: "Authentication",
        description:
          "Endpoints for user registration, login, and user management.",
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
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths: {
      "/api/users/signup": {
        post: {
          summary: "Create an account",
          tags: ["Authentication"],
          security: [],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    firstName: {
                      type: "string",
                      example: "Mugisha",
                    },
                    lastName: {
                      type: "string",
                      example: "Walmond",
                    },
                    email: {
                      type: "string",
                      example: "mu@gmail.com",
                    },
                    password: {
                      type: "string",
                      example: "Walmond@123",
                    },
                    role: {
                      type: "string",
                      example: "buyer",
                    },
                    phone: {
                      type: "string",
                      example: "+250792418795",
                    },
                  },
                  required: [
                    "firstName",
                    "lastName",
                    "email",
                    "password",
                    "role",
                    "phone",
                  ],
                },
              },
            },
          },
          responses: {
            201: {
              description: "User created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      firstName: { type: "string" },
                      lastName: { type: "string" },
                      email: { type: "string" },
                      role: { type: "string" },
                      phone: { type: "string" },
                    },
                    required: [
                      "firstName",
                      "lastName",
                      "email",
                      "role",
                      "phone",
                    ],
                  },
                },
              },
            },
            400: {
              description: "Bad Request",
            },
          },
        },
      },

      // User Login Route Documentation
      "/api/users/login": {
        post: {
          summary: "Login with Email and Password",
          tags: ["Authentication"],
          security: [],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: {
                      type: "string",
                      example: "mu@gmail.com",
                    },
                    password: {
                      type: "string",
                      example: "Walmond@123",
                    },
                  },
                  required: ["email", "password"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "User logged in successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      token: { type: "string" },
                    },
                  },
                },
              },
            },
            400: {
              description: "Bad Request",
            },
            401: {
              description: "Unauthorized",
            },
          },
        },
      },

      "/api/users/{id}": {
        patch: {
          summary: "Change user role",
          tags: ["Authentication"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "User ID",
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    role: {
                      type: "string",
                      example: "admin",
                    },
                  },
                  required: ["role"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Role updated successfully",
            },
            400: {
              description: "Bad Request",
            },
            401: {
              description: "Unauthorized",
            },
            404: {
              description: "User not found",
            },
          },
        },
      },

      "/api/users/{id}/updatepassword": {
        patch: {
          summary: "User updating his/her password",
          tags: ["Authentication"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "User ID",
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    oldPassword: {
                      type: "string",
                      example: "Walmond@123",
                    },
                    newPassword: {
                      type: "string",
                      example: "Test@123",
                    },
                    confirmNewPassword: {
                      type: "string",
                      example: "Test@123",
                    },
                  },
                  required: [
                    "oldPassword",
                    "newPassword",
                    "confirmNewPassword",
                  ],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Password updated successfully",
            },
            400: {
              description: "New password and confirm password do not match",
            },
            401: {
              description: "Incorrect old password",
            },
            404: {
              description: "User not found",
            },
            500: {
              description: "An error occurred while updating the password",
            },
          },
        },
      },

      // Change Account Status Endpoint
      "/api/users/change-account-status/{id}": {
        patch: {
          summary: "Change user account status",
          tags: ["Authentication"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "User ID",
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    activationReason: {
                      type: "string",
                      example: "Violation",
                    },
                  },
                  required: ["status"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Account status updated successfully",
            },
            400: {
              description: "Bad Request",
            },
            401: {
              description: "Unauthorized",
            },
            404: {
              description: "User not found",
            },
            500: {
              description:
                "An error occurred while updating the account status",
            },
          },
        },
      },
      "/api/product/create": {
        post: {
          summary: "Create a new product",
          tags: ["Products"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      example: "Product Name",
                    },
                    description: {
                      type: "string",
                      example: "Product Description",
                    },
                    price: {
                      type: "number",
                      example: 10.99,
                    },
                    stock: {
                      type: "number",
                      example: 100,
                    },
                    expireDate: {
                      type: "string",
                      format: "date",
                      example: "2024-12-31",
                    },
                  },
                  required: [
                    "name",
                    "description",
                    "price",
                    "stock",
                    "expireDate",
                  ],
                },
              },
            },
          },
          responses: {
            201: {
              description: "Product created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          product: {
                            type: "object",
                            properties: {
                              id: { type: "number" },
                              name: { type: "string" },
                              description: { type: "string" },
                              price: { type: "number" },
                              stock: { type: "number" },
                              expireDate: { type: "string", format: "date" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Bad Request",
            },
            500: {
              description: "Internal Server Error",
            },
          },
        },
      },
      "/api/product/all": {
        get: {
          summary: "Retrieve all products",
          tags: ["Products"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "A list of products",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        name: { type: "string" },
                        description: { type: "string" },
                        price: { type: "number" },
                        stock: { type: "number" },
                        available: { type: "boolean" },
                        expireDate: { type: "string", format: "date" },
                      },
                    },
                  },
                },
              },
            },
            400: { description: "Bad Request" },
            500: { description: "Internal Server Error" },
          },
        },
      },

      "/api/product/update/{id}": {
        patch: {
          summary: "Update product details",
          tags: ["Products"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "Product ID",
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    stock: {
                      type: "number",
                      example: 50,
                    },
                    available: {
                      type: "boolean",
                      example: true,
                    },
                    expireDate: {
                      type: "string",
                      format: "date",
                      example: "2025-12-31",
                    },
                  },
                  required: [
                    "stock",
                    "available",
                    "expireDate",
                  ],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Product details updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          product: {
                            type: "object",
                            properties: {
                              id: { type: "number" },
                              stock: { type: "number" },
                              available: { type: "boolean" },
                              expireDate: { type: "string", format: "date" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Bad Request",
            },
            404: {
              description: "Product not found",
            },
            500: {
              description: "Internal Server Error",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsdoc(options);
export default specs;
