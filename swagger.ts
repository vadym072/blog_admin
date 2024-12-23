import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'API documentation for the Blog application',
    },
    servers: [
      {
        url: 'https://blog-admin-gamma.vercel.app/api', // Update this URL based on your environment
      },
    ],
  },
  apis: ['./app/api/**/*.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerUi, swaggerDocs };