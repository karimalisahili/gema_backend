import { Router } from 'express';
import {
  createUbicacionTecnicaHandler,
  updateUbicacionTecnicaHandler,
  deleteUbicacionTecnicaHandler,
  getUbicacionesTecnicasHandler,
  getUbicacionTecnicaByIdHandler,
  getUbicacionesDependientesHandler,
  getUbicacionesPorNivelHandler,
  getPadresByIdHijoHandler,
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
router.get('/padres/:idHijo', getPadresByIdHijoHandler); // GET /ubicaciones-tecnicas/padres/:idHijo

export default router;
