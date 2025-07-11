import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GEMA Backend API',
      version: '1.0.0',
      description: 'Documentación de la API de GEMA Backend',
    },
    servers: [
      {
        url: 'http://localhost:3000',
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
    security: [{ bearerAuth: [] }],
  },
  apis: [
    './src/controllers/**/*.ts', // Puedes ajustar el path según tu estructura
    './src/routes/*.ts',
  ],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
