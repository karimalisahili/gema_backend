import { Router } from 'express';
import {
  createTrabajaEnGrupoHandler,
  deleteTrabajaEnGrupoHandler,
  getAllTrabajaEnGrupoHandler,
} from './trabajaEnGrupo.controller';

const router = Router();

router.post('/', createTrabajaEnGrupoHandler);
router.get('/:grupoDeTrabajoId', getAllTrabajaEnGrupoHandler);
router.delete('/:tecnicoId/:grupoDeTrabajoId', deleteTrabajaEnGrupoHandler);
export default router;
