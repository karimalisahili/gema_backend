import express from 'express';
import cors from 'cors';
import { db } from './db';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

const app = express();
const port = process.env.PORT || 3000;

// Configuración condicional de CORS
if (process.env.NODE_ENV === 'development') {
  // En desarrollo, permite solicitudes desde cualquier origen
  app.use(cors());
} else {
  // En producción, solo permite solicitudes desde la URL autorizada
  const productionUrl = process.env.PRODUCTION_URL;
  if (!productionUrl) {
    console.error('Error: PRODUCTION_URL environment variable is not defined.');
    process.exit(1);
  }
  app.use(cors({ origin: productionUrl }));
}

// Middleware to parse JSON bodies
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta de prueba "Hola Mundo"
app.get('/hola', (_req, res) => {
  res.json({ mensaje: 'Hola mundo' });
});

app.use('/', routes);

(async () => {
  try {
    await db.execute('SELECT 1');
    console.log('Connected to PostgreSQL via Drizzle ORM.');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
  });
})();
