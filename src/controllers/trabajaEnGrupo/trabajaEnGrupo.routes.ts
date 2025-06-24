import { Router } from 'express';
import {
  createTrabajaEnGrupoHandler,
  deleteTrabajaEnGrupoHandler,
  getAllTrabajaEnGrupoHandler,
  getAllTrabajaEnTodosLosGruposHandler,
} from './trabajaEnGrupo.controller';

const router = Router();

router.post('/', createTrabajaEnGrupoHandler);
router.get('/', getAllTrabajaEnTodosLosGruposHandler);
router.get('/:grupoDeTrabajoId', getAllTrabajaEnGrupoHandler);
router.delete('/:tecnicoId/:grupoDeTrabajoId', deleteTrabajaEnGrupoHandler);
export default router;
