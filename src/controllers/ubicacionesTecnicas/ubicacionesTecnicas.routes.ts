import { Router } from 'express';
import {
  createUbicacionTecnicaHandler,
  updateUbicacionTecnicaHandler,
  deleteUbicacionTecnicaHandler,
  getUbicacionesTecnicasHandler,
  getUbicacionTecnicaByIdHandler,
  getUbicacionesDependientesHandler,
} from './ubicacionesTecnicas.controller';

const router = Router();

router.get('/ramas/:id', getUbicacionesDependientesHandler);
router.get('/', getUbicacionesTecnicasHandler);
router.get('/:id', getUbicacionTecnicaByIdHandler);
router.post('/', createUbicacionTecnicaHandler);
router.put('/:id', updateUbicacionTecnicaHandler);
router.delete('/:id', deleteUbicacionTecnicaHandler);

export default router;
