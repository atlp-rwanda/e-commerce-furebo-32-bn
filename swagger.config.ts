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
          "Endpoints for user registration, login, logout, and user management.",
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

      "/api/users/logout": {
        post: {
          summary: "Logout from the application",
          tags: ["Authentication"],
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Logout successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
            },
            "401": {
              description: "Unauthorized",
            },
            "403": {
              description: "Forbidden",
            },
            "404": {
              description: "User not found",
            },
          },
        },
      },

      "/api/users/{id}/role": {
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
      "/api/users/requestpasswordreset": {
        post: {
          summary: "Request Password Reset",
          tags: ["Password Reset"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: {
                      type: "string",
                      example: "user@example.com",
                    },
                  },
                  required: ["email"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Password reset email sent",
            },
            404: {
              description: "User not found",
            },
          },
        },
      },
      "/api/users/resetpassword": {
        post: {
          summary: "Reset Password",
          tags: ["Password Reset"],
          security: [],
          parameters: [
            {
              name: "token",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "Password reset token",
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    newPassword: {
                      type: "string",
                      example: "NewPassword@123",
                    },
                  },
                  required: ["newPassword"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Password reset successfully",
            },
            404: {
              description: "Invalid or expired token",
            },
          },
        },
      },
      // Email Verification Route Documentation
      "/api/users/verify-email": {
        get: {
          summary: "Verify Email",
          tags: ["Email Verification"],
          security: [],
          parameters: [
            {
              name: "token",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "Email verification token",
            },
          ],
          responses: {
            200: {
              description: "Email verified successfully",
            },
            404: {
              description: "Invalid token",
            },
            500: {
              description: "Internal server error",
            },
          },
        },
      },
      "/createCollection/{seller_id}": {
        post: {
          summary: "Create a new collection",
          description: "Create a new collection with the provided name",
          tags: ["Product"],
          parameters: [
            {
              name: "seller_id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "Seller ID",
            },
          ],
          requestBody: {
            description: "Collection details",
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    CollectionName: {
                      type: "string",
                      description: "Name of the collection",
                    },
                    description: {
                      type: "string",
                      description: "Description of the collection",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Collection created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      CollectionName: {
                        type: "string",
                        description: "Name of the collection",
                      },
                      description: {
                        type: "string",
                        description: "Description of the collection",
                      },
                      seller_id: {
                        type: "string",
                      },
                    },
                  },
                },
              },
              400: {
                description: "Bad Request",
              },
              500: {
                description: "Internal server error",
              },
            },
          },
        },
      },
      "/createProduct/{collection_id}": {
        post: {
          summary: "Create a new Product",
          description: "Create a new Product with in ",
          tags: ["Product"],
          parameters: [
            {
              name: "collection_id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "Collection ID",
            },
          ],
          requestBody: {
            description: "Product details",
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    productName: {
                      type: "string",
                      description: "Name of the collection",
                    },
                    description: {
                      type: "string",
                      description: "Description of the collection",
                    },
                    price: {
                      type: "number",
                      description: "Name of the collection",
                    },
                    quantity: {
                      type: "number",
                      description: "Quantinty Of the products",
                    },
                    expireDate: {
                      type: "string",
                      description: "expiration date of the product",
                      format: "date",
                    },
                    category: {
                      type: "string",
                      description: "Category of the product",
                    },
                    images: {
                      type: "array",
                      description: "Images",
                      items: {
                        type: "string",
                        format: "binary",
                        description: "Image file(s) of the product",
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Collection created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      productName: { type: "string" },
                      description: { type: "string" },
                      price: { type: "number" },
                      quantity: { type: "number" },
                      seller_id: { type: "string" },
                      expireDate: { type: "string" },
                      Collection_id: { type: "string" },
                      images: { type: "array" },
                      category: { type: "string" },
                    },
                  },
                },
              },
              400: {
                description: "Bad Request",
              },
              500: {
                description: "Internal server error",
              },
            },
          },
        },
      },
      "/searchProduct": {
        post: {
          summary: "search for Products",
          description: "search for products by name, price or category ",
          tags: ["Product"],
          parameters: [
            {
              name: "search",
              in: "query",
              schema: {
                type: "string",
              },
              description: "name of the product",
            },
            {
              name: "price_range",
              in: "query",
              schema: {
                type: "string",
              },
              description: "range of prices",
            },
            {
              name: "category",
              in: "query",
              schema: {
                type: "string",
              },
              description: "category of the product",
            },
          ],
          responses: {
            200: {
              description: "Search results",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      productName: { type: "string" },
                      description: { type: "string" },
                      price: { type: "number" },
                      quantity: { type: "number" },
                      seller_id: { type: "string" },
                      expireDate: { type: "string" },
                      Collection_id: { type: "string" },
                      images: { type: "array" },
                      category: { type: "string" },
                    },
                  },
                },
              },
              400: {
                description: "Bad Request",
              },
              500: {
                description: "Internal server error",
              },
            },
          },
        },
      },

      "/google/auth": {
        get: {
          summary: "Login with Google",
          tags: ["Authentication"],
          responses: {
            200: {
              description: "Login Successful",
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
          },
          400: {
            description: "Bad Request",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
      "/product/markAvailable/{productId}": {
        patch: {
          summary: "Mark a product as available or unavailable",
          tags: ["Product"],
          parameters: [
            {
              name: "productId",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "ID of the product to update",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    availability: {
                      type: "boolean",
                    },
                  },
                  required: ["availability"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Product availability updated successfully",
            },
            400: {
              description: "Bad Request",
            },
            404: {
              description: "Product not found",
            },
            500: {
              description: "Internal server error",
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
