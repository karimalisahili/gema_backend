import { Router } from 'express';
import {
  createTecnicoHandler,
  getAllTecnicosHandler,
} from './tecnico.controller';

const router = Router();

/**
 * @openapi
 * /tecnicos:
 *   post:
 *     summary: Crea un nuevo técnico
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Técnicos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre
 *               - Correo
 *             properties:
 *               Nombre:
 *                 type: string
 *                 example: Juan Pérez
 *               Correo:
 *                 type: string
 *                 example: juan.perez@email.com
 *     responses:
 *       201:
 *         description: Técnico creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     userId:
 *                       type: integer
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error al crear el técnico
 */
router.post('/', createTecnicoHandler);
/**
 * @openapi
 * /tecnicos:
 *   get:
 *     summary: Obtiene todos los técnicos
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Técnicos
 *     responses:
 *       200:
 *         description: Lista de técnicos
 */
/**
 * Handler para obtener todos los técnicos.
 * @param req Express request
 * @param res Express response
 */
router.get('/', getAllTecnicosHandler);
export default router;
