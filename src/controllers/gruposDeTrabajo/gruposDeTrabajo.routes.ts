import { Router } from 'express';
import {
  createGrupoDeTrabajoHandler,
  getGruposDeTrabajoByIdHandler,
  getGruposDeTrabajoHandler,
  updateGrupoDeTrabajoHandler,
} from './gruposDeTrabajo.controller';

const router = Router();

router.post('/', createGrupoDeTrabajoHandler);
router.get('/', getGruposDeTrabajoHandler);
router.get('/:id', getGruposDeTrabajoByIdHandler);
router.put('/:id', updateGrupoDeTrabajoHandler);
export default router;
