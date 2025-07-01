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
import { exportUbicacionesToExcel } from '../../scripts/exportToExcel';

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
 *     - estaHabilitado: boolean (opcional, por defecto true)
 * Descripción: Crea una ubicación técnica y la asocia a uno o varios padres.
 * Ejemplo de body para padres:
 *   padres: [
 *     { idPadre: 1, esUbicacionFisica: true },
 *     { idPadre: 2 }
 *   ]
 * Si hay varios padres, solo uno debe tener esUbicacionFisica: true (el resto se asume false).
 */
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
      error: `Error al crear la ubicación técnica: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`,
    });
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
 *   - estaHabilitado: boolean (opcional)
 * Descripción: Actualiza los datos de una ubicación técnica. Si se envía el campo padres, se actualizan las relaciones de padres y se recalculan nivel y código de identificación.
 * Ejemplo de body para padres igual que en creación.
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
    res.status(500).json({
      error: `Error al actualizar la ubicación técnica: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`,
    });
    return;
  }
};

/**
 * Deshabilita una ubicación técnica y todos sus descendientes recursivamente (soft delete).
 * Método: DELETE
 * Endpoint: /ubicaciones-tecnicas/:id
 * Params:
 *   - id: number (en la ruta, requerido)
 * Descripción: Deshabilita la ubicación técnica y, en cascada, todos los hijos cuya relación apunte a este padre, sin importar si es física o virtual. No se elimina físicamente, solo se pone estaHabilitado=false.
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
    res.status(500).json({
      error: `Error al deshabilitar la ubicación técnica: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`,
    });
    return;
  }
};

/**
 * Obtiene todas las ubicaciones técnicas habilitadas.
 * Método: GET
 * Endpoint: /ubicaciones-tecnicas
 * Descripción: Retorna todas las ubicaciones técnicas registradas en el sistema que están habilitadas.
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
    res.status(500).json({
      error: `Error al obtener las ubicaciones técnicas: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`,
    });
    return;
  }
};

/**
 * Obtiene una ubicación técnica por su ID.
 * Método: GET
 * Endpoint: /ubicaciones-tecnicas/:id
 * Params:
 *   - id: number (en la ruta, requerido)
 * Descripción: Retorna la ubicación técnica correspondiente al ID, si está habilitada.
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
    res.status(404).json({
      error: `Ubicación técnica no encontrada: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`,
    });
    return;
  }
};

/**
 * Obtiene todas las ubicaciones dependientes (descendientes) de una ubicación dada.
 * Método: GET
 * Endpoint: /ubicaciones-tecnicas/ramas/:id
 * Query params:
 *   - nivel: number (opcional)
 * Descripción: Retorna todas las ubicaciones dependientes (descendientes) de la ubicación dada. Si se indica nivel, solo retorna las de ese nivel.
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
    res.status(500).json({
      error: `Error al obtener las ubicaciones dependientes: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`,
    });
    return;
  }
};

/**
 * Obtiene todas las ubicaciones técnicas de un nivel específico.
 * Método: GET
 * Endpoint: /ubicaciones-tecnicas/nivel/:nivel
 * Params:
 *   - nivel: number (en la ruta, requerido)
 * Descripción: Retorna todas las ubicaciones técnicas del nivel solicitado que están habilitadas.
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
    res.status(500).json({
      error: `Error al obtener las ubicaciones por nivel: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`,
    });
    return;
  }
};

/**
 * Exporta todas las ubicaciones técnicas a un archivo Excel.
 * Método: GET
 * Endpoint: /ubicaciones-tecnicas/export/excel
 * Descripción: Genera un archivo Excel con todas las ubicaciones técnicas en un formato jerárquico.
 */
export const exportUbicacionesToExcelHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const buffer = await exportUbicacionesToExcel();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=ubicaciones_tecnicas.xlsx'
    );
    res.send(buffer);
    return;
  } catch (error) {
    console.error('Error in exportUbicacionesToExcelHandler:', error);
    res.status(500).json({
      error: `Error al exportar a Excel: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`,
    });
    return;
  }
};

/**
 * Obtiene todos los padres jerárquicos de un hijo.
 * Método: GET
 * Endpoint: /ubicaciones-tecnicas/padres/:idHijo
 * Params:
 *   - idHijo: number (en la ruta, requerido)
 * Descripción: Retorna todos los padres jerárquicos de la ubicación técnica indicada.
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
    res.status(500).json({
      error: `Error al obtener los padres jerárquicos: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`,
    });
    return;
  }
};
