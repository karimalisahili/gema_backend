import { Router } from 'express';
import {
  createGrupoDeTrabajoHandler,
  deleteGrupoDeTrabajoHandler,
  getGruposDeTrabajoByIdHandler,
  getGruposDeTrabajoHandler,
  updateGrupoDeTrabajoHandler,
} from './gruposDeTrabajo.controller';

const router = Router();

router.post('/', createGrupoDeTrabajoHandler);
router.get('/', getGruposDeTrabajoHandler);
router.get('/:id', getGruposDeTrabajoByIdHandler);
router.put('/:id', updateGrupoDeTrabajoHandler);
router.delete('/:id', deleteGrupoDeTrabajoHandler);
export default router;
