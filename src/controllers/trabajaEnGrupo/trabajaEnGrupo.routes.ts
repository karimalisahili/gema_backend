import { Router } from 'express';
import { createTrabajaEnGrupoHandler } from './trabajaEnGrupo.controller';

const router = Router();

router.post('/', createTrabajaEnGrupoHandler);

export default router;
