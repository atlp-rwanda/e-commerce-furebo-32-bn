// src/swagger.config.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce platform API documentation',
      version: '1.0.0',
      description: 'This is the api documentation of the backend routes of the e-commerce platform',
    },
  },
  apis: ['./src/routes/*.ts']
};

const specs = swaggerJsdoc(options);
export default specs;
