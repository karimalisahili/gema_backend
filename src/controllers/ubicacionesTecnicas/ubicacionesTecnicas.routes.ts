import { Router } from 'express';
import {
  createUbicacionTecnicaHandler,
  updateUbicacionTecnicaHandler,
  deleteUbicacionTecnicaHandler,
} from './ubicacionesTecnicas.controller';

const router = Router();

router.post('/', createUbicacionTecnicaHandler);
router.put('/:id', updateUbicacionTecnicaHandler);
router.delete('/:id', deleteUbicacionTecnicaHandler);

export default router;
