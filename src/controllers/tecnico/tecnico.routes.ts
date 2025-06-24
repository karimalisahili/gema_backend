import { Router } from 'express';
import {
  createTecnicoHandler,
  getAllTecnicosHandler,
} from './tecnico.controller';

const router = Router();

router.post('/', createTecnicoHandler);
router.get('/', getAllTecnicosHandler);
export default router;
