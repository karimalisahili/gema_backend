import { db } from '../../db';
import { ubicacionTecnica } from '../../tables/ubicacionTecnica';
import { incluyen } from '../../tables/incluyen';
import {
  CreateUbicacionesTecnicasParams,
  UpdateUbicacionesTecnicasParams,
} from '../../types/ubicacionesTecnicas';
import { eq, and, inArray } from 'drizzle-orm';

/**
 * Crea una nueva ubicación técnica.
 * Endpoint: POST /ubicaciones-tecnicas
 * Body:
 *   - descripcion: string (requerido)
 *   - abreviacion: string (requerido)
 *   - padres: Array<{ idPadre: number; esUbicacionFisica?: boolean }> (opcional)
 *     - idPadre: ID del padre
 *     - esUbicacionFisica: true si este padre es la ubicación física principal
 * Descripción: Crea una ubicación técnica y la asocia a uno o varios padres.
 */
export const createUbicacionTecnica = async (
  params: CreateUbicacionesTecnicasParams
) => {
  try {
    if (!params.descripcion || !params.abreviacion) {
      throw new Error('Los campos descripcion y abreviacion son obligatorios');
    }

    let nivel = 1;
    let codigo_Identificacion = params.abreviacion;
    if (params.padres && params.padres.length > 0) {
      // Buscar el padre con esUbicacionFisica true
      const padreFisico = params.padres.find(p => p.esUbicacionFisica);
      const padreIdParaCodigo = padreFisico
        ? padreFisico.idPadre
        : params.padres[0].idPadre;
      const padresIds = params.padres.map(p => p.idPadre);
      const padres = await db
        .select()
        .from(ubicacionTecnica)
        .where(inArray(ubicacionTecnica.idUbicacion, padresIds));
      const padreParaCodigo = padres.find(
        p => p.idUbicacion === padreIdParaCodigo
      );
      if (!padreParaCodigo) {
        throw new Error('El padre para el código no existe');
      }
      nivel = (padreParaCodigo.nivel ?? 0) + 1;
      codigo_Identificacion = `${padreParaCodigo.codigo_Identificacion}-${params.abreviacion}`;
    }

    const inserted = await db
      .insert(ubicacionTecnica)
      .values({
        descripcion: params.descripcion,
        abreviacion: params.abreviacion,
        codigo_Identificacion,
        nivel,
      })
      .returning();

    if (!inserted.length) {
      throw new Error('Error al crear la ubicación técnica');
    }
    const idHijo = inserted[0].idUbicacion;

    if (params.padres && params.padres.length > 0) {
      for (const padre of params.padres) {
        await db.insert(incluyen).values({
          idPadre: padre.idPadre,
          idHijo,
          esUbicacionFisica: padre.esUbicacionFisica ?? false,
        });
      }
    }

    return {
      message: 'Ubicación técnica creada correctamente',
      ubicacion: inserted[0],
    };
  } catch (error) {
    console.error('Error creating ubicacion tecnica:', error);
    // Lanzar el error real junto con el mensaje personalizado
    throw new Error(
      `Error al crear la ubicación técnica: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};

/**
 * Actualiza una ubicación técnica existente.
 * Endpoint: PUT /ubicaciones-tecnicas/:id
 * Params:
 *   - idUbicacion: number (en la ruta)
 * Body:
 *   - descripcion: string (opcional)
 *   - abreviacion: string (opcional)
 *   - padres: Array<{ idPadre: number; esUbicacionFisica?: boolean }> (opcional)
 * Descripción: Actualiza los datos de una ubicación técnica. Si se envía el campo padres, se actualizan las relaciones de padres.
 */
export const updateUbicacionTecnica = async (
  idUbicacion: number,
  params: UpdateUbicacionesTecnicasParams
) => {
  try {
    const updateData: any = {};
    if (params.descripcion !== undefined)
      updateData.descripcion = params.descripcion;
    if (params.abreviacion !== undefined)
      updateData.abreviacion = params.abreviacion;

    // Only recalculate nivel and codigo_Identificacion if padres is present in the request
    if (params.padres && params.padres.length > 0) {
      const padresIds = params.padres.map(p => p.idPadre);
      const padres = await db
        .select()
        .from(ubicacionTecnica)
        .where(inArray(ubicacionTecnica.idUbicacion, padresIds));
      const padreFisico = params.padres.find(p => p.esUbicacionFisica);
      const padreIdParaCodigo = padreFisico
        ? padreFisico.idPadre
        : params.padres[0].idPadre;
      const padreParaCodigo = padres.find(
        p => p.idUbicacion === padreIdParaCodigo
      );
      let nivel: number;
      let codigo_Identificacion: string;
      if (padreParaCodigo) {
        nivel = (padreParaCodigo.nivel ?? 0) + 1;
        codigo_Identificacion = `${
          padreParaCodigo.codigo_Identificacion ?? ''
        }-${params.abreviacion ?? ''}`;
      } else {
        nivel = 1;
        codigo_Identificacion = params.abreviacion ?? '';
      }
      updateData.nivel = nivel;
      updateData.codigo_Identificacion = codigo_Identificacion;
    }

    const updated = await db
      .update(ubicacionTecnica)
      .set(updateData)
      .where(eq(ubicacionTecnica.idUbicacion, idUbicacion))
      .returning();

    if (!updated.length) {
      throw new Error('Ubicación técnica no encontrada o sin cambios');
    }

    if (params.padres) {
      await db.delete(incluyen).where(eq(incluyen.idHijo, idUbicacion));
      for (const padre of params.padres) {
        await db.insert(incluyen).values({
          idPadre: padre.idPadre,
          idHijo: idUbicacion,
          esUbicacionFisica: padre.esUbicacionFisica ?? false,
        });
      }
    }

    return {
      message: 'Ubicación técnica actualizada correctamente',
      ubicacion: updated[0],
    };
  } catch (error) {
    console.error('Error updating ubicacion tecnica:', error);
    throw new Error(
      `Error al actualizar la ubicación técnica: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};

/**
 * Elimina una ubicación técnica por su ID y elimina recursivamente todos los hijos donde este sea padre (sin importar esUbicacionFisica).
 * Endpoint: DELETE /ubicaciones-tecnicas/:id
 * Params:
 *   - idUbicacion: number (en la ruta)
 * Descripción: Elimina la ubicación técnica y, en cascada, todos los hijos cuya relación apunte a este padre.
 */
export const deleteUbicacionTecnica = async (idUbicacion: number) => {
  try {
    // Buscar todos los hijos donde este es padre (sin importar esUbicacionFisica)
    const hijos = await db
      .select({ idHijo: incluyen.idHijo })
      .from(incluyen)
      .where(eq(incluyen.idPadre, idUbicacion));

    // Eliminar recursivamente los hijos
    for (const hijo of hijos) {
      await deleteUbicacionTecnica(hijo.idHijo);
    }

    // Eliminar relaciones en Incluyen donde este es hijo
    await db.delete(incluyen).where(eq(incluyen.idHijo, idUbicacion));
    // Eliminar relaciones en Incluyen donde este es padre
    await db.delete(incluyen).where(eq(incluyen.idPadre, idUbicacion));

    // Eliminar la ubicación técnica
    const deleted = await db
      .delete(ubicacionTecnica)
      .where(eq(ubicacionTecnica.idUbicacion, idUbicacion))
      .returning();
    if (!deleted.length) {
      throw new Error('Ubicación técnica no encontrada');
    }
    return {
      message: 'Ubicación técnica eliminada correctamente',
      ubicacion: deleted[0],
    };
  } catch (error) {
    console.error('Error deleting ubicacion tecnica:', error);
    throw new Error(
      `Error al eliminar la ubicación técnica: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};

export const getUbicacionesTecnicas = async () => {
  try {
    const ubicaciones = await db.select().from(ubicacionTecnica);
    return ubicaciones;
  } catch (error) {
    console.error('Error fetching ubicaciones tecnicas:', error);
    throw new Error(
      `Error al obtener las ubicaciones técnicas: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};

export const getUbicacionTecnicaById = async (idUbicacion: number) => {
  try {
    const ubicacion = await db
      .select()
      .from(ubicacionTecnica)
      .where(eq(ubicacionTecnica.idUbicacion, idUbicacion));
    if (!ubicacion.length) {
      throw new Error('Ubicación técnica no encontrada');
    }
    return ubicacion[0];
  } catch (error) {
    console.error('Error fetching ubicacion tecnica by id:', error);
    throw new Error(
      `Error al obtener la ubicación técnica: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};

export const getUbicacionesDependientes = async (
  idUbicacion: number
): Promise<any[]> => {
  try {
    const dependientes: any[] = [];
    const hijos = await db
      .select({ idHijo: incluyen.idHijo })
      .from(incluyen)
      .where(eq(incluyen.idPadre, idUbicacion));
    for (const hijo of hijos) {
      const ubicacion = await db
        .select()
        .from(ubicacionTecnica)
        .where(eq(ubicacionTecnica.idUbicacion, hijo.idHijo));
      if (ubicacion.length) {
        dependientes.push(ubicacion[0]);
        const subdependientes = await getUbicacionesDependientes(hijo.idHijo);
        dependientes.push(...subdependientes);
      }
    }
    return dependientes;
  } catch (error) {
    console.error('Error fetching ubicaciones dependientes:', error);
    throw new Error(
      `Error al obtener las ubicaciones dependientes: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};
