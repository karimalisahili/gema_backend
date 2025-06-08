import { Router } from 'express';
import { loginHandler } from './auth.controller';

const router = Router();

router.post('/', loginHandler);

export default router;
