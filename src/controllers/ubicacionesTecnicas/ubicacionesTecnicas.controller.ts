import { Request, Response } from 'express';
import {
  createUbicacionTecnica,
  updateUbicacionTecnica,
  deleteUbicacionTecnica,
  getUbicacionesTecnicas,
  getUbicacionTecnicaById,
  getUbicacionesDependientes,
  getUbicacionesPorNivel,
  getPadresByIdHijo,
} from './ubicacionesTecnicas.service';

export const createUbicacionTecnicaHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ubicacion = await createUbicacionTecnica(req.body);
    res.status(201).json({
      data: ubicacion,
    });
    return;
  } catch (error) {
    console.error('Error in createUbicacionTecnicaHandler:', error);
    res.status(500).json({
      error: 'Error al crear la ubicación técnica',
    });
    return;
  }
};

/**
 * Crea una nueva ubicación técnica.
 * Método: POST
 * Endpoint: /ubicaciones-tecnicas
 * Body:
 *   - descripcion: string (requerido)
 *   - abreviacion: string (requerido)
 *   - padres: Array<{ idPadre: number; esUbicacionFisica?: boolean }> (opcional)
 *     - idPadre: ID del padre
 *     - esUbicacionFisica: true si este padre es la ubicación física principal
 * Descripción: Crea una ubicación técnica y la asocia a uno o varios padres.
 * Ejemplo de body para padres:
 *   padres: [
 *     { idPadre: 1, esUbicacionFisica: true },
 *     { idPadre: 2 }
 *   ]
 * Si hay varios padres, solo uno debe tener esUbicacionFisica: true (el resto se asume false).
 */
export const updateUbicacionTecnicaHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const idUbicacion = Number(req.params.id);
    const ubicacion = await updateUbicacionTecnica(idUbicacion, req.body);
    res.status(200).json({ data: ubicacion });
    return;
  } catch (error) {
    console.error('Error in updateUbicacionTecnicaHandler:', error);
    res.status(500).json({ error: 'Error al actualizar la ubicación técnica' });
    return;
  }
};

/**
 * Actualiza una ubicación técnica existente.
 * Método: PUT
 * Endpoint: /ubicaciones-tecnicas/:id
 * Params:
 *   - id: number (en la ruta, requerido)
 * Body:
 *   - descripcion: string (opcional)
 *   - abreviacion: string (opcional)
 *   - padres: Array<{ idPadre: number; esUbicacionFisica?: boolean }> (opcional)
 * Descripción: Actualiza los datos de una ubicación técnica. Si se envía el campo padres, se actualizan las relaciones de padres y se recalculan nivel y código de identificación.
 * Ejemplo de body para padres igual que en creación.
 */
export const deleteUbicacionTecnicaHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const idUbicacion = Number(req.params.id);
    const ubicacion = await deleteUbicacionTecnica(idUbicacion);
    res.status(200).json({ data: ubicacion });
    return;
  } catch (error) {
    console.error('Error in deleteUbicacionTecnicaHandler:', error);
    res.status(500).json({ error: 'Error al eliminar la ubicación técnica' });
    return;
  }
};

/**
 * Elimina una ubicación técnica y todos sus descendientes recursivamente.
 * Método: DELETE
 * Endpoint: /ubicaciones-tecnicas/:id
 * Params:
 *   - id: number (en la ruta, requerido)
 * Descripción: Elimina la ubicación técnica y, en cascada, todos los hijos cuya relación apunte a este padre, sin importar si es física o virtual.
 */
export const getUbicacionesTecnicasHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ubicaciones = await getUbicacionesTecnicas();
    res.status(200).json({ data: ubicaciones });
    return;
  } catch (error) {
    console.error('Error in getUbicacionesTecnicasHandler:', error);
    res
      .status(500)
      .json({ error: 'Error al obtener las ubicaciones técnicas' });
    return;
  }
};

/**
 * Obtiene todas las ubicaciones técnicas.
 * Método: GET
 * Endpoint: /ubicaciones-tecnicas
 * Descripción: Retorna todas las ubicaciones técnicas registradas en el sistema.
 */
export const getUbicacionTecnicaByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const idUbicacion = Number(req.params.id);
    const ubicacion = await getUbicacionTecnicaById(idUbicacion);
    res.status(200).json({ data: ubicacion });
    return;
  } catch (error) {
    console.error('Error in getUbicacionTecnicaByIdHandler:', error);
    res.status(404).json({ error: 'Ubicación técnica no encontrada' });
    return;
  }
};

/**
 * Handler para obtener todas las ubicaciones dependientes de una ubicación dada (sin importar si es padre físico o no).
 * Endpoint: GET /ubicaciones-tecnicas/ramas/:id
 */
export const getUbicacionesDependientesHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const idUbicacion = Number(req.params.id);
    // Asegura que el query param nivel se pase correctamente como número o undefined
    const nivel =
      req.query.nivel !== undefined ? Number(req.query.nivel) : undefined;
    const dependientes = await getUbicacionesDependientes(idUbicacion, nivel);
    res.status(200).json({ data: dependientes });
    return;
  } catch (error) {
    console.error('Error in getUbicacionesDependientesHandler:', error);
    res
      .status(500)
      .json({ error: 'Error al obtener las ubicaciones dependientes' });
    return;
  }
};

/**
 * Obtiene todas las ubicaciones técnicas de un nivel específico.
 * Método: GET
 * Endpoint: /ubicaciones-tecnicas/nivel/:nivel
 * Params:
 *   - nivel: number (en la ruta, requerido)
 * Descripción: Retorna todas las ubicaciones técnicas del nivel solicitado.
 */
export const getUbicacionesPorNivelHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const nivel = Number(req.params.nivel);
    const ubicaciones = await getUbicacionesPorNivel(nivel);
    res.status(200).json({ data: ubicaciones });
    return;
  } catch (error) {
    console.error('Error en getUbicacionesPorNivelHandler:', error);
    res
      .status(500)
      .json({ error: 'Error al obtener las ubicaciones por nivel' });
    return;
  }
};

/**
 * Handler para obtener todos los padres jerárquicos de un hijo.
 * Endpoint: GET /ubicaciones-tecnicas/padres/:idHijo
 */
export const getPadresByIdHijoHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const idHijo = Number(req.params.idHijo);
    const padres = await getPadresByIdHijo(idHijo);
    res.status(200).json({ data: padres });
    return;
  } catch (error) {
    console.error('Error in getPadresByIdHijoHandler:', error);
    res.status(500).json({ error: 'Error al obtener los padres jerárquicos' });
    return;
  }
};
