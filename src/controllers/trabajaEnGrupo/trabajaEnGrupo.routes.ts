import { Router } from 'express';
import {
  createTrabajaEnGrupoHandler,
  deleteTrabajaEnGrupoHandler,
  getAllTrabajaEnGrupoHandler,
  getAllTrabajaEnTodosLosGruposHandler,
} from './trabajaEnGrupo.controller';

const router = Router();

/**
 * @openapi
 * /trabajaEnGrupo:
 *   post:
 *     summary: Asigna un técnico a un grupo de trabajo
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - TrabajaEnGrupo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tecnicoId
 *               - grupoDeTrabajoId
 *             properties:
 *               tecnicoId:
 *                 type: integer
 *                 example: 1
 *               grupoDeTrabajoId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Trabajador asignado correctamente al grupo
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error al asignar trabajador al grupo
 */
router.post('/', createTrabajaEnGrupoHandler);

/**
 * @openapi
 * /trabajaEnGrupo:
 *   get:
 *     summary: Obtiene todos los trabajadores agrupados por grupo de trabajo
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - TrabajaEnGrupo
 *     responses:
 *       200:
 *         description: Lista de grupos con sus trabajadores
 */
router.get('/', getAllTrabajaEnTodosLosGruposHandler);

/**
 * @openapi
 * /trabajaEnGrupo/{grupoDeTrabajoId}:
 *   get:
 *     summary: Obtiene todos los trabajadores de un grupo de trabajo específico
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - TrabajaEnGrupo
 *     parameters:
 *       - in: path
 *         name: grupoDeTrabajoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grupo de trabajo
 *     responses:
 *       200:
 *         description: Lista de trabajadores del grupo
 *       404:
 *         description: Grupo de trabajo no encontrado
 */
router.get('/:grupoDeTrabajoId', getAllTrabajaEnGrupoHandler);

/**
 * @openapi
 * /trabajaEnGrupo/{tecnicoId}/{grupoDeTrabajoId}:
 *   delete:
 *     summary: Elimina la asignación de un técnico a un grupo de trabajo
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - TrabajaEnGrupo
 *     parameters:
 *       - in: path
 *         name: tecnicoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del técnico
 *       - in: path
 *         name: grupoDeTrabajoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grupo de trabajo
 *     responses:
 *       200:
 *         description: Asignación eliminada correctamente
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error al eliminar la asignación
 */
router.delete('/:tecnicoId/:grupoDeTrabajoId', deleteTrabajaEnGrupoHandler);
export default router;
