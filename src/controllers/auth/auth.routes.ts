import { Router } from 'express';
import { loginHandler } from './auth.controller';

const router = Router();
/**
 * @openapi
 * /login:
 *   post:
 *     summary: Inicia sesión y obtiene un token JWT
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Correo:
 *                 type: string
 *               Contraseña:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token JWT generado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/', loginHandler);

export default router;
