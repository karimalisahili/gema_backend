import { Router } from 'express';
import { createGrupoDeTrabajoHandler } from './gruposDeTrabajo.controller';

const router = Router();

router.post('/', createGrupoDeTrabajoHandler);

export default router;
