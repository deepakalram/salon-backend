import swaggerJSDoc from 'swagger-jsdoc';

export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'salon-nodeapi',
      version: '1.0.0',
      description: 'API documentation for salon application',
    },
  },
  apis: ['../routes/web_routes/*.js'], // Path to the API routes
};
export const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;