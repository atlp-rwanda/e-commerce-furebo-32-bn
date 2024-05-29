import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce APIs Documentation',
      version: '1.0.0',
      description: 'APIs for E-Commerce Team Project',
      license: {
        name: 'ISC'
      }
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Local Development Server for Swagger'
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'Endpoints for user registration, login, and user management.'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    basePath: '/api',
    schemes: ['http'],
    paths: {
      '/api/users/signup': {
        post: {
          summary: 'Create an account',
          tags: ['Authentication'],
          security: [],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    firstName: {
                      type: 'string',
                      example: 'Mugisha'
                    },
                    lastName: {
                      type: 'string',
                      example: 'Walmond'
                    },
                    email: {
                      type: 'string',
                      example: 'mu@gmail.com'
                    },
                    password: {
                      type: 'string',
                      example: 'Walmond@123'
                    },
                    role: {
                      type: 'string',
                      example: 'buyer'
                    },
                    phone: {
                      type: 'string',
                      example: '+250792418795'
                    }
                  },
                  required: ['firstName', 'lastName', 'email', 'password', 'role', 'phone']
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Account created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      firstName: { type: 'string' },
                      lastName: { type: 'string' },
                      email: { type: 'string' },
                      role: { type: 'string' },
                      phone: { type: 'string' }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Bad Request'
            }
          }
        }
      },
      '/api/users/{id}': {
        patch: {
          summary: 'Change user role',
          tags: ['Authentication'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              },
              description: 'User ID'
            }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    role: {
                      type: 'string',
                      example: 'admin'
                    }
                  },
                  required: ['role']
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Role updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      role: { type: 'string' }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Bad Request'
            },
            403: {
              description: 'Forbidden'
            },
            404: {
              description: 'User not found'
            }
          }
        }
      },
      '/api/users/login': {
        post: {
          summary: 'User Login',
          tags: ['Authentication'],
          security: [],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: {
                      type: 'string',
                      example: 'mugishajoseph0923@gmail.com'
                    },
                    password: {
                      type: 'string',
                      example: 'walmond@123'
                    }
                  },
                  required: ['email', 'password']
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Successful login',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: {
                        type: 'string',
                        description: 'JWT token for authentication'
                      },
                      type: {
                        type: 'string',
                        description: 'Authentication type (e.g., Bearer)'
                      },
                      name: {
                        type: 'string',
                        description: "User's full name"
                      },
                      email: {
                        type: 'string',
                        description: "User's email address"
                      },
                      role: {
                        type: 'string',
                        description: "User's role or access level"
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Bad Request'
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
