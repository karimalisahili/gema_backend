import { Router } from 'express';
import {
  createUbicacionTecnicaHandler,
  updateUbicacionTecnicaHandler,
  deleteUbicacionTecnicaHandler,
  getUbicacionesTecnicasHandler,
  getUbicacionTecnicaByIdHandler,
  getUbicacionesDependientesHandler,
  getUbicacionesPorNivelHandler,
  exportUbicacionesToExcelHandler,
} from './ubicacionesTecnicas.controller';

const router = Router();

router.get('/export/excel', exportUbicacionesToExcelHandler);
router.get('/ramas/:id', getUbicacionesDependientesHandler);
router.get('/nivel/:nivel', getUbicacionesPorNivelHandler); // GET /ubicaciones-tecnicas/nivel/:nivel
router.get('/', getUbicacionesTecnicasHandler);
router.get('/:id', getUbicacionTecnicaByIdHandler);
router.post('/', createUbicacionTecnicaHandler);
router.put('/:id', updateUbicacionTecnicaHandler);
router.delete('/:id', deleteUbicacionTecnicaHandler);

export default router;
