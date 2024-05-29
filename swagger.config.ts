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
        name: 'ISC',
      },
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Local Development Server for Swagger',
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'Endpoints for user registration, login, logout, and user management.',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
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
                    firstName: { type: 'string', example: 'Mugisha' },
                    lastName: { type: 'string', example: 'Walmond' },
                    email: { type: 'string', example: 'mu@gmail.com' },
                    password: { type: 'string', example: 'Walmond@123' },
                    role: { type: 'string', example: 'buyer' },
                    phone: { type: 'string', example: '+250792418795' },
                  },
                  required: ['firstName', 'lastName', 'email', 'password', 'role', 'phone'],
                },
              },
            },
          },
          responses: {
            201: {
              description: 'User created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string' },
                      message: { type: 'string' },
                      token: { type: 'string' },
                      data: {
                        type: 'object',
                        properties: {
                          user: { type: 'object' },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Bad Request',
            },
          },
        },
      },
      '/api/users/login': {
        post: {
          summary: 'Login with Email and Password',
          tags: ['Authentication'],
          security: [],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', example: 'test@gmail.com' },
                    password: { type: 'string', example: 'Test@123' },
                  },
                  required: ['email', 'password'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string' },
                      message: { type: 'string' },
                      token: { type: 'string' },
                      data: {
                        type: 'object',
                        properties: {
                          user: { type: 'object' },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Bad Request',
            },
            401: {
              description: 'Invalid email or password',
            },
          },
        },
      },
      '/api/users/logout': {
        post: {
          summary: 'Logout user',
          tags: ['Authentication'],
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: 'User logged out successfully',
           
            },
            400: {
              description: 'Authorization token is missing',
            
            },
            500: {
              description: 'An error occurred during logout',
          
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);
export default specs;
