import { Router } from 'express';
import tecnicoRoutes from '../controllers/tecnico/tecnico.routes';
import authRoutes from '../controllers/auth/auth.routes';
import { authenticate } from '../middleware/auth.middleware'; // Importa el middleware

const router = Router();

// Protege la ruta de tecnicos
router.use('/tecnicos', authenticate, tecnicoRoutes);
router.use('/login', authRoutes);

export default router;
