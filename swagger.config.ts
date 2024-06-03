import swaggerJsdoc from "swagger-jsdoc";
import dotenv from 'dotenv';

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
        description: "Production server (HTTPS)"
      }
    ],
    tags: [
      {
        name: "Authentication",
        description: "Endpoints for user registration, login, and user management.",
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
                    required: ["firstName", "lastName", "email", "role", "phone"],
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
                  required: ["oldPassword", "newPassword", "confirmNewPassword"],
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
              description: "An error occurred while updating the account status",
            },
          },
        },
      },

      // New path for logout
      '/api/users/logout': {
        post: {
          summary: 'Logout from the application',
          tags: ['Authentication'],
          security: [{ bearerAuth: [] }], // Require bearer token for authentication
          responses: {
            200: {
              description: 'Logout successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                    }
                  }
                }
              }
            },
            400: {
              description: 'Bad Request'
            },
            401: {
              description: 'Unauthorized',
            },
            403: {
              description: 'Forbidden'
            },
            404: {
              description: 'User not found'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};

const specs = swaggerJsdoc(options);
export default specs;