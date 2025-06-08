import { Router } from 'express';
import tecnicoRoutes from '../controllers/tecnico/tecnico.routes';
import authRoutes from '../controllers/auth/auth.routes';

const router = Router();

router.use('/tecnicos', tecnicoRoutes);
router.use('/login', authRoutes);

export default router;
