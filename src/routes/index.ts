import { Router } from 'express';
import tecnicoRoutes from '../controllers/tecnico/tecnico.routes';
import grupoDeTrabajoRoutes from '../controllers/gruposDeTrabajo/gruposDeTrabajo.routes';
import authRoutes from '../controllers/auth/auth.routes';
import { authenticate } from '../middleware/auth.middleware'; // Importa el middleware
import trabajaEnGrupoRoutes from '../controllers/trabajaEnGrupo/trabajaEnGrupo.routes';
const router = Router();

// Protege la ruta de tecnicos
router.use('/tecnicos', authenticate, tecnicoRoutes);
router.use('/grupos', authenticate, grupoDeTrabajoRoutes);
router.use('/trabajaEnGrupo', authenticate, trabajaEnGrupoRoutes);
router.use('/login', authRoutes);

export default router;
