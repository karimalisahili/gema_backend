import { Router } from 'express';
import {
  createGrupoDeTrabajoHandler,
  getGruposDeTrabajoByIdHandler,
  getGruposDeTrabajoHandler,
} from './gruposDeTrabajo.controller';

const router = Router();

router.post('/', createGrupoDeTrabajoHandler);
router.get('/', getGruposDeTrabajoHandler);
router.get('/:id', getGruposDeTrabajoByIdHandler);
export default router;
