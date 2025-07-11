import { Router } from 'express';
import {
  createGrupoDeTrabajoHandler,
  deleteGrupoDeTrabajoHandler,
  getGruposDeTrabajoByIdHandler,
  getGruposDeTrabajoHandler,
  updateGrupoDeTrabajoHandler,
} from './gruposDeTrabajo.controller';

const router = Router();

/**
 * @openapi
 * /grupos:
 *   post:
 *     summary: Crea un nuevo grupo de trabajo
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - GruposDeTrabajo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - nombre
 *               - supervisorId
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: GT-001
 *               nombre:
 *                 type: string
 *                 example: Grupo de Mantenimiento
 *               supervisorId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Grupo de trabajo creado correctamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error al crear el grupo de trabajo
 */
router.post('/', createGrupoDeTrabajoHandler);
/**
 * @openapi
 * /grupos:
 *   get:
 *     summary: Obtiene todos los grupos de trabajo
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - GruposDeTrabajo
 *     responses:
 *       200:
 *         description: Lista de grupos de trabajo
 */
router.get('/', getGruposDeTrabajoHandler);

/**
 * @openapi
 * /grupos/{id}:
 *   get:
 *     summary: Obtiene un grupo de trabajo por ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - GruposDeTrabajo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grupo de trabajo
 *     responses:
 *       200:
 *         description: Grupo de trabajo encontrado
 *       404:
 *         description: Grupo de trabajo no encontrado
 */
router.get('/:id', getGruposDeTrabajoByIdHandler);

/**
 * @openapi
 * /grupos/{id}:
 *   put:
 *     summary: Actualiza un grupo de trabajo por ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - GruposDeTrabajo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grupo de trabajo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               nombre:
 *                 type: string
 *               supervisorId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Grupo de trabajo actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Grupo de trabajo no encontrado
 *       500:
 *         description: Error al actualizar el grupo de trabajo
 */

router.put('/:id', updateGrupoDeTrabajoHandler);
/**
 * @openapi
 * /grupos/{id}:
 *   delete:
 *     summary: Elimina un grupo de trabajo por ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - GruposDeTrabajo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grupo de trabajo
 *     responses:
 *       200:
 *         description: Grupo de trabajo eliminado correctamente
 *       404:
 *         description: Grupo de trabajo no encontrado
 *       500:
 *         description: Error al eliminar el grupo de trabajo
 */
router.delete('/:id', deleteGrupoDeTrabajoHandler);
export default router;
