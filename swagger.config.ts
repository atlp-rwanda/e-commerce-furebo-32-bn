import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3002;

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
        "/api/users/users": {
          get: {
            summary: "Get all users",
            tags: ["Authentication"], // Adjust tags as necessary
            security: [
              {
                bearerAuth: [], // Specify authentication requirements if any
              },
            ],
            responses: {
              200: {
                description: "List of users",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        users: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              firstName: { type: "string" },
                              lastName: { type: "string" },
                              email: { type: "string" },
                              role: { type: "string" },
                              phone: { type: "string" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              500: {
                description: "Internal Server Error",
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
      "/api/auth/google": {
        post: {
          summary: "Login with Google",
          tags: ["Authentication"],
          security: [],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    tokenId: {
                      type: "string",
                      example: "Google token ID",
                    },
                  },
                  required: ["tokenId"],
                },
              },
            },
          },
          responses: {
            200: {
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
          summary: "Logout from the Application",
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
      "/api/users/profile": {
        get: {
          summary: "View Your Profile",
          tags: ["User Profile"],
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "success",
            },
            404: {
              description: "User not found",
            },
            500: {
              description: "An error occurred while fetching the profile",
            },
          },
        },
      },
      "/api/users/update-profile": {
        patch: {
          summary: "Update user profile",
          tags: ["User Profile"],
          description: "Update the user's profile information",
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    firstName: {
                      type: "string",
                      example: "Aime",
                    },
                    lastName: {
                      type: "string",
                      example: "Brues",
                    },
                    phone: {
                      type: "string",
                      example: "+250792418795",
                    },
                    birthdate: {
                      type: "string",
                      example: "2000-01-01",
                    },
                    gender: {
                      type: "string",
                      example: "male",
                    },
                    preferredLanguage: {
                      type: "string",
                      example: "kinyarwanda",
                    },
                    preferredCurrency: {
                      type: "string",
                      example: "USD",
                    },
                    whereYouLive: {
                      type: "string",
                      example: "KIGALI",
                    },
                    billingAddress: {
                      type: "string",
                      example: "kabeza",
                    },
                    images: {
                      type: "array",
                      description: "Image",
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
            "200": {
              description: "User profile updated successfully",
            },
            "400": {
              description: "Invalid input",
            },
            "404": {
              description: "User profile not found",
            },
            "500": {
              description: "An error occurred while updating the profile",
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
      "/api/createCollection": {
        post: {
          summary: "Create a new collection",
          description: "Create a new collection with the provided name",
          tags: ["Product"],
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
      "/api/createProduct": {
        post: {
          summary: "Create a new Product",
          description: "Create a new Product with in ",
          tags: ["Product"],
          // parameters: [
          //   {
          //     name: "collection_id",
          //     in: "path",
          //     required: true,
          //     schema: {
          //       type: "string",
          //     },
          //     description: "Collection ID",
          //   },
          // ],
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
                      description: "Product Name",
                    },
                    description: {
                      type: "string",
                      description: "Product Description",
                    },
                    price: {
                      type: "number",
                      description: "Price of the product",
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
      "/api/seller/collection/{seller_id}": {
        get: {
          summary: "Get Seller Items",
          description: "Get all items of a seller",
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
          responses: {
            200: {
              description: "Seller Items",
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
        "/api/updateCollection/{id}": {
      "put": {
        "summary": "Update an existing collection",
        "description": "Update the collection with the provided details",
        "tags": ["Product"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "Collection ID"
          }
        ],
        "requestBody": {
          "description": "Updated collection details",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "CollectionName": {
                    "type": "string",
                    "description": "Name of the collection"
                  },
                  "description": {
                    "type": "string",
                    "description": "Description of the collection"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Collection updated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "CollectionName": {
                      "type": "string",
                      "description": "Name of the collection"
                    },
                    "description": {
                      "type": "string",
                      "description": "Description of the collection"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request"
          },
          "404": {
            "description": "Collection not found"
          },
          "500": {
            "description": "Internal server error"
          }
        }
      }
    },
    "/api/deleteCollection/{id}": {
      "delete": {
        "summary": "Delete a collection",
        "description": "Delete the collection with the provided ID",
        "tags": ["Product"],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "Collection ID"
          }
        ],
        "responses": {
          "200": {
            "description": "Collection deleted successfully"
          },
          "400": {
            "description": "Bad Request"
          },
          "404": {
            "description": "Collection not found"
          },
          "500": {
            "description": "Internal server error"
          }
        }
      }
    },
      "/api/availableItems": {
        get: {
          summary: "Get Available Items In all collections",
          description: "Get all available items",
          tags: ["Product"],
          responses: {
            200: {
              description: "Available Items",
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
      "/api/searchProduct": {
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

      "/api/wishlist/{productId}": {
        post: {
          summary: "New wishlist",
          description: "Add new product on wishlist",
          tags: ["Product"],
          parameters: [
            {
              name: "productId",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "Product ID",
            },
          ],
          responses: {
            200: {
              description: "Product added in wishlist successfully",
              400: {
                description: "Bad Request",
              },
              404: {
                description: "Not Found",
              },
              500: {
                description: "Internal server error",
              },
            },
          },
        },
      },

      "/api/wishlist": {
        delete: {
          summary: "Delete wishlist",
          description: "Delete all product in wishlist",
          tags: ["Product"],
          responses: {
            200: {
              description: "Delete all product in wishlist successfully",
              400: {
                description: "Bad Request",
              },
              404: {
                description: "Not Found",
              },
              500: {
                description: "Internal server error",
              },
            },
          },
        },
        get: {
          summary: "Retrieve wishlist",
          description: "Get all products in wishlist",
          tags: ["Product"],
          responses: {
            200: {
              description: "Products are retrieved in wishlist successfully",
              400: {
                description: "Bad Request",
              },
              404: {
                description: "Not Found",
              },
              500: {
                description: "Internal server error",
              },
            },
          },
        },
      },

      "/api/google/auth": {
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
      "/api/availableProducts/{seller_id}": {
        get: {
          summary: "Get available products by a particular seller",
          description:
            "Retrieve a list of available products for a specific seller.",
          tags: ["Product"],
          parameters: [
            {
              name: "seller_id",

              in: "path",
              required: true,
              schema: {
                type: "string",
              },

              description: "ID of the seller to retrieve products for",
            },
          ],
          responses: {
            200: {
              description: "A list of available products",
              content: {
                "application/json": {
                  schema: {
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", description: "Product ID" },
                        productName: {
                          type: "string",
                          description: "Name of the product",
                        },
                        description: {
                          type: "string",
                          description: "Description of the product",
                        },
                        price: {
                          type: "number",
                          description: "Price of the product",
                        },
                        quantity: {
                          type: "number",
                          description: "Quantity of the product",
                        },
                        seller_id: { type: "string", description: "Seller ID" },
                        expireDate: {
                          type: "string",
                          description: "Expiration date of the product",
                          format: "date",
                        },
                        Collection_id: {
                          type: "string",
                          description: "Collection ID",
                        },
                        images: {
                          type: "array",
                          items: {
                            type: "string",
                            description: "Image URL of the product",
                          },
                          description: "Images of the product",
                        },
                        category: {
                          type: "string",
                          description: "Category of the product",
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
                description: "Seller not found",
              },
              500: {
                description: "Internal server error",
              },
            },
          },
        },
      },
      "/api/updateAvailability/{id}": {
        patch: {
          summary: "Update product availability",
          tags: ["Product"],
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
                    availability: {
                      type: "boolean",
                      example: true,
                    },
                  },
                  required: ["availability"],
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Product availability updated successfully",
            },
            "400": {
              description: "Bad Request",
            },
            "401": {
              description: "Unauthorized",
            },
            "404": {
              description: "Product not found",
            },
            "500": {
              description: "Internal server error",
            },
          },
        },
      },

      "/api/cart": {
        post: {
          summary: "Create Cart",
          tags: ["Cart"],
          security: [{ bearerAuth: [] }],
          responses: {
            201: {
              description: "Cart created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      cartId: { type: "string" },
                      items: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            productId: { type: "string" },
                            quantity: { type: "number" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            500: {
              description: "Internal server error",
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
          },
        },
      },
      "/api/cart/add/{productId}": {
        post: {
          summary: "Add Item to Cart",
          tags: ["Cart"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "productId",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "ID of the product to add to cart",
            },
          ],
          responses: {
            200: {
              description: "Item added to cart successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      cart: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          items: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                productId: { type: "string" },
                                quantity: { type: "number" },
                              },
                            },
                          },
                          total: { type: "number" },
                        },
                      },
                    },
                  },
                },
              },
            },
            500: {
              description: "Internal server error",
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
          },
        },
      },
      "/api/cart/view": {
        get: {
          summary: "View Cart",
          tags: ["Cart"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Cart retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      items: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            productId: { type: "string" },
                            quantity: { type: "number" },
                            productName: { type: "string" },
                            price: { type: "number" },
                            image: { type: "string" },
                          },
                        },
                      },
                      total: { type: "number" },
                    },
                  },
                },
              },
            },
            500: {
              description: "Internal server error",
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
          },
        },
      },
      "/api/cart/update/{productId}": {
        patch: {
          summary: "Update Cart Item",
          tags: ["Cart"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "productId",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "ID of the product in cart to update",
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    quantity: {
                      type: "number",
                      example: 2,
                    },
                  },
                  required: ["quantity"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Cart updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      cart: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          items: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                productId: { type: "string" },
                                quantity: { type: "number" },
                              },
                            },
                          },
                          total: { type: "number" },
                        },
                      },
                    },
                  },
                },
              },
            },
            500: {
              description: "Internal server error",
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
          },
        },
      },
      "/api/cart/remove/{productId}": {
    "delete": {
      "summary": "Remove Item from Cart",
      "tags": ["Cart"],
      "security": [{ "bearerAuth": [] }],
      "parameters": [
        {
          "name": "productId",
          "in": "path",
          "required": true,
          "schema": {
            "type": "string"
          },
          "description": "ID of the product to remove from cart"
        },
      ],
      "responses": {
        "200": {
          "description": "Item removed from cart successfully",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": { "type": "string" },
                  "cart": {
                    "type": "object",
                    "properties": {
                      "id": { "type": "string" },
                      "items": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "productId": { "type": "string" },
                            "quantity": { "type": "number" }
                          },
                        },
                      },
                      "total": { "type": "number" }
                    },
                  },
                },
              },
            },
          },
        },
        "404": {
          "description": "Cart or product not found",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": { "type": "string" }
                },
              },
            },
          },
        },
        "500": {
          "description": "Internal server error",
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "message": { "type": "string" }
                },
              },
            },
          },
        },
      },
    },
  },
      "/api/cart/clear": {
        post: {
          summary: "Clear Cart",
          tags: ["Cart"],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Cart cleared successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      cart: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          items: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                productId: { type: "string" },
                                quantity: { type: "number" },
                              },
                            },
                          },
                          total: { type: "number" },
                        },
                      },
                    },
                  },
                },
              },
            },
            500: {
              description: "Internal server error",
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
          },
        },
      },
      "/api/deleteProduct/{product_id}": {
        delete: {
          summary: "Delete a product in a collection",
          description: "Delete a product with the provided id of the product",
          tags: ["Product"],
          parameters: [
            {
              name: "product_id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "Product ID",
            },
          ],
          responses: {
            202: {
              description: "Product deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      deletedProduct: {
                        type: "object",
                        description: "deleted Product",
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
      "/api/updateProduct/{product_id}": {
        patch: {
          summary: "Update image of the product",
          description: "Update image of the product by secure Url",
          tags: ["Product"],
          parameters: [
            {
              name: "product_id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "Product ID",
            },
          ],
          requestBody: {
            description: "Product details",
            required: true,
            content: {
              "application/json": {
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
                    availabilty: {
                      type: "boolean",
                      description: "Availability of the product",
                    },
                    category: {
                      type: "string",
                      description: "Category of the product",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Images added successfully",
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
                      availability: { type: "boolean" },
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
      "/api/updateAllProductImages/{product_id}": {
        patch: {
          summary: "Update all images of the product",
          description: "Update all images of the product ",
          tags: ["Product"],
          parameters: [
            {
              name: "product_id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "Product ID",
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
              description: "Images added successfully",
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
      "/api/updateProductImage/{product_id}": {
        patch: {
          summary: "Update image of the product",
          description: "Update image of the product by secure Url",
          tags: ["Product"],
          parameters: [
            {
              name: "product_id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "Product ID",
            },
          ],
          requestBody: {
            description: "Images details",
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    imageUrl: {
                      type: "string",
                      description: "secure Url of the image",
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
              description: "Images added successfully",
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
      "/api/removeProductImage/{product_id}": {
        patch: {
          summary: "Remove image of the product",
          description: "Remove images of the product by secure Url ",
          tags: ["Product"],
          parameters: [
            {
              name: "product_id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "Product ID",
            },
          ],
          requestBody: {
            description: "Image details",
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    imageUrl: {
                      type: "string",
                      description: "secure Url of the image",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Images added successfully",
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
      "/api/addProductImage/{product_id}": {
        patch: {
          summary: "Remove image of the product",
          description: "Remove images of the product by secure Url ",
          tags: ["Product"],
          parameters: [
            {
              name: "product_id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "Product ID",
            },
          ],
          requestBody: {
            description: "Image details",
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
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
              description: "Images added successfully",
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
      "/api/viewProduct/{product_id}": {
        get: {
          summary: "View Product",
          description: "View Product by providing its id",
          tags: ["Product"],
          parameters: [
            {
              name: "product_id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "Product ID",
            },
          ],
          responses: {
            200: {
              description: "Collection created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      product: {
                        type: "object",
                        description: "requested product",
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
      },
      "/api/sellerViewProduct/{product_id}/{collection_id}": {
        get: {
          summary: "View Product By seller",

          description: "Seller can view product in his collection",
          tags: ["Product"],
          parameters: [
            {
              name: "product_id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "Product ID",
            },
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
          responses: {
            200: {
              description: "Product found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      product: {
                        type: "object",
                        description: "Requested product",
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
      },
      "/api/reviewProduct/{product_id}": {
        post: {
          summary: "Review Product",
          description: "Review a product by providing its id",
          tags: ["Product"],
          parameters: [
            {
              name: "product_id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "Product ID",
            },
          ],
          requestBody: {
            description: "Review details",
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    review: {
                      type: "string",
                      description: "Review of the product",
                    },
                    rating: {
                      type: "number",
                      description: "Rating of the product",
                    }
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Review added successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      review: {
                        type: "object",
                        description: "Review of the product",
                      },
                      rating: {
                        type: "number",
                        description: "Rating of the product",
                      }
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
      "/api/getReviews/{product_id}": {
        get: {
          summary: "Get Reviews",
          description: "Get reviews of a product by providing its id",
          tags: ["Product"],
          parameters: [
            {
              name: "product_id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "Product ID",
            },
          ],
          responses: {
            200: {
              description: "Reviews found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      reviews: {
                        type: "array",
                        description: "Reviews of the product",
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
      },
      "/api/deleteReview/{product_id}/{review_id}": {
        delete: {
          summary: "Delete Review",
          tags: ["Product"],
          description: "Delete a review by providing its id",
          parameters: [
            {
              name: "product_id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "Product ID",
            },
            {
              name: "review_id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "Review ID",
            },
          ],
          responses: {
            200: {
              description: "Review deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      review: {
                        type: "object",
                        description: "Deleted review",
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
      },
      "/api/checkout/": {
  "post": {
    "summary": "Checkout",
    "description": "Make checkout",
    "tags": ["Order"],
    "requestBody": {
      "required": true,
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "street": {
                "type": "string",
                "example": "123 Main St"
              },
              "city": {
                "type": "string",
                "example": "Metropolis"
              },
              "country": {
                "type": "string",
                "example": "Countryland"
              },
              "zipCode": {
                "type": "string",
                "example": "12345"
              }
            },
            "required": ["street", "city", "country", "zipCode"]
          }
        }
      }
    },
    "responses": {
      "200": {
        "description": "Order and payment processed successfully",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string",
                  "example": "Order and payment processed successfully"
                },
                "data": {
                  "type": "object"
                }
              }
            }
          }
        }
      },
      "401": {
        "description": "Unauthorized",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "message": {
                  "type": "string",
                  "example": "Unable to process order and payment"
                },
                "error": {
                  "type": "string"
                }
              }
            }
          }
        }
      },
      "400": {
        "description": "Bad Request",
        "content": {
          "application/json": {
            "schema": {
              "type": "object"
            }
          }
        }
      },
      "404": {
        "description": "Not Found",
        "content": {
          "application/json": {
            "schema": {
              "type": "object"
            }
          }
        }
      },
      "500": {
        "description": "Internal server error",
        "content": {
          "application/json": {
            "schema": {
              "type": "object"
            }
          }
        }
      }
    }
  }
}

      ,
      "/api/notifications/": {
        get: {
          summary: "Get Notifications",
          tags: ["Notifications"],

          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Notifications retrieved successfully",
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
      "/api/notifications/read": {
        patch: {
          summary: "Mark Notifications as read",
          tags: ["Notifications"],

          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    notification_ids: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                    },
                  },
                  required: ["notification_ids"],
                },
              },
            },
          },
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Notifications  Marked as Read",
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
      "/api/stats": {
        get: {
          summary: "Get Product Statistics",
          description:
            "Retrieve statistics for products within a specified date range.",
          tags: ["Stats"],
          parameters: [
            {
              name: "start",
              in: "query",
              required: true,
              schema: {
                type: "string",
                format: "date",
                example: "2024-01-01",
              },
              description: "Start date (YYYY-MM-DD) for the statistics query.",
            },
            {
              name: "end",
              in: "query",
              required: true,
              schema: {
                type: "string",
                format: "date",
                example: "2024-06-25",
              },
              description: "End date (YYYY-MM-DD) for the statistics query.",
            },
          ],
          responses: {
            200: {
              description: "Successful response with product statistics.",
              400: {
                description: "Bad Request",
              },
              404: {
                description: "Not Found",
              },
              500: {
                description: "Internal server error",
              },
            },
          },
        },
      },
      "/api/order/{orderId}/status": {
        get: {
          summary: "Get Order Status",
          description: "Retrieve the status of a specific order.",
          tags: ["Order"],
          parameters: [
            {
              name: "orderId",
              in: "path",
              description: "ID of the order to retrieve status for",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            "200": {
              description: "Order status retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      orderId: {
                        type: "string",
                        description: "ID of the order",
                      },
                      status: {
                        type: "string",
                        description: "Status of the order",
                      },
                      expectedDeliveryDate: {
                        type: "string",
                        description: "Expected delivery date of the order",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad Request",
            },
            "404": {
              description: "Order not found",
            },
            "500": {
              description: "Internal server error",
            },
          },
        },
        patch: {
          summary: "Update Order Status",
          description: "Update the status of a specific order.",
          tags: ["Order"],
          parameters: [
            {
              name: "orderId",
              in: "path",
              description: "ID of the order to update status for",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      description: "New status of the order",
                    },
                  },
                  required: ["status"],
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Order status updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                        description: "New status of the order",
                      },
                      expectedDeliveryDate: {
                        type: "string",
                        description:
                          "Updated expected delivery date of the order",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad Request",
            },
            "404": {
              description: "Order not found",
            },
            "500": {
              description: "Internal server error",
            },
          },
        },
      },
      
        "/api/chats/sendmessages": {
          "post": {
            "summary": "Send public message",
            "tags": ["Chat"],
            "security": [{ "bearerAuth": [] }],
            "requestBody": {
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "content": {
                        "type": "string",
                        "example": "hello"
                      }
                    },
                    "required": ["content"]
                  }
                }
              }
            },
            "responses": {
              "200": {
                "description": "Message sent"
              },
              "400": {
                "description": "Bad Request"
              },
              "401": {
                "description": "Unauthorized"
              },
              "404": {
                "description": "User not found"
              },
              "500": {
                "description": "Internal server error"
              }
            }
          }
        },
        "/api/chats/messages": {
          "get": {
            "summary": "Get all messages",
            "tags": ["Chat"],
            "security": [{ "bearerAuth": [] }],
            "responses": {
              "200": {
                "description": "A list of all messages",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "example": "60d21b8667d0d8992e610c85"
                          },
                          "content": {
                            "type": "string",
                            "example": "hello"
                          },
                          "userId": {
                            "type": "string",
                            "example": "60d0fe4f5311236168a109ca"
                          },
                          "createdAt": {
                            "type": "string",
                            "format": "date-time",
                            "example": "2021-06-23T18:25:43.511Z"
                          }
                        }
                      }
                    }
                  }
                }
              },
              "400": {
                "description": "Bad Request"
              },
              "401": {
                "description": "Unauthorized"
              },
              "500": {
                "description": "Internal server error"
              }
            }
          },
          "delete": {
            "summary": "Delete all messages",
            "tags": ["Chat"],
            "security": [{ "bearerAuth": [] }],
            "responses": {
              "200": {
                "description": "All messages deleted successfully"
              },
              "400": {
                "description": "Bad Request"
              },
              "401": {
                "description": "Unauthorized"
              },
              "500": {
                "description": "Internal server error"
              }
            }
          }
        },
        "/api/chats/messages/{id}": {
          "delete": {
            "summary": "Delete a single message",
            "tags": ["Chat"],
            "security": [{ "bearerAuth": [] }],
            "parameters": [
              {
                "name": "id",
                "in": "path",
                "required": true,
                "schema": {
                  "type": "string"
                },
                "description": "ID of the message to delete"
              }
            ],
            "responses": {
              "200": {
                "description": "Message deleted successfully"
              },
              "400": {
                "description": "Bad Request"
              },
              "401": {
                "description": "Unauthorized"
              },
              "404": {
                "description": "Message not found"
              },
              "500": {
                "description": "Internal server error"
              
            
          }
        },
      
      
      "/api/stats": {
        get: {
          summary: 'Get Product Statistics',
          description: 'Retrieve statistics for products within a specified date range.',
          tags: ['Stats'],
          parameters: [
            {
              name: 'start',
              in: 'query',
              required: true,
              schema: {
                type: 'string',
                format: 'date',
                example: '2024-01-01',
              },
              description: 'Start date (YYYY-MM-DD) for the statistics query.',
            },
            {
              name: 'end',
              in: 'query',
              required: true,
              schema: {
                type: 'string',
                format: 'date',
                example: '2024-06-25',
              },
              description: 'End date (YYYY-MM-DD) for the statistics query.',
            },
          ],
          responses: {
            200: {
              description: "Successful response with product statistics.",
              400: {
                description: "Bad Request",
              },
              404: {
                description: "Not Found",
              },
              500: {
                description: "Internal server error",
              },
            },
          },
        },
      },
      "/api/order/{orderId}/status": {
        "get": {
          "summary": "Get Order Status",
          "description": "Retrieve the status of a specific order.",
          "tags": ["Order"],
          "parameters": [
            {
              "name": "orderId",
              "in": "path",
              "description": "ID of the order to retrieve status for",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Order status retrieved successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "orderId": {
                        "type": "string",
                        "description": "ID of the order"
                      },
                      "status": {
                        "type": "string",
                        "description": "Status of the order"
                      },
                      "expectedDeliveryDate": {
                        "type": "string",
                        "description": "Expected delivery date of the order"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request"
            },
            "404": {
              "description": "Order not found"
            },
            "500": {
              "description": "Internal server error"
            }
          }
        },
        "patch": {
          "summary": "Update Order Status",
          "description": "Update the status of a specific order.",
          "tags": ["Order"],
          "parameters": [
            {
              "name": "orderId",
              "in": "path",
              "description": "ID of the order to update status for",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string",
                      "description": "New status of the order"
                    }
                  },
                  "required": ["status"]
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Order status updated successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "type": "string",
                        "description": "New status of the order"
                      },
                      "expectedDeliveryDate": {
                        "type": "string",
                        "description": "Updated expected delivery date of the order"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request"
            },
            "404": {
              "description": "Order not found"
            },
            "500": {
              "description": "Internal server error"
            }
          }
        }
        
      }
      
    },
   },
    },
  },

  apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsdoc(options);
export default specs;