import { Router } from 'express';
import {
  createTrabajaEnGrupoHandler,
  deleteTrabajaEnGrupoHandler,
} from './trabajaEnGrupo.controller';

const router = Router();

router.post('/', createTrabajaEnGrupoHandler);
router.delete('/:tecnicoId/:grupoDeTrabajoId', deleteTrabajaEnGrupoHandler);
export default router;
