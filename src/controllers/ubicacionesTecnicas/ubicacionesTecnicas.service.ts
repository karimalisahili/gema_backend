import { db } from '../../db';
import { ubicacionTecnica } from '../../tables/ubicacionTecnica';
import { CreateUbicacionesTecnicasParams } from '../../types/ubicacionesTecnicas';
import { eq } from 'drizzle-orm';

export const createUbicacionTecnica = async (
  params: CreateUbicacionesTecnicasParams
) => {
  try {
    // Validate input
    if (!params.descripcion || !params.abreviacion) {
      throw new Error('Los campos descripcion y abreviacion son obligatorios');
    }

    let codigo_Identificacion: string;
    let nivel: number;

    if (params.padreId) {
      // Fetch parent row using drizzle-orm eq
      const parent = await db
        .select()
        .from(ubicacionTecnica)
        .where(eq(ubicacionTecnica.idUbicacion, params.padreId))
        .limit(1);

      if (!parent.length) {
        throw new Error('Ubicación técnica superior no encontrada');
      }

      // Concatenate parent's codigo_Identificacion with current abreviacion
      codigo_Identificacion = `${parent[0].codigo_Identificacion}-${params.abreviacion}`;
      nivel = (parent[0].nivel ?? 0) + 1;
    } else {
      // Root level: use abreviacion as codigo_Identificacion and nivel 1
      codigo_Identificacion = params.abreviacion;
      nivel = 1;
    }

    const inserted = await db
      .insert(ubicacionTecnica)
      .values({
        descripcion: params.descripcion,
        abreviacion: params.abreviacion,
        codigo_Identificacion,
        nivel,
        padreId: params.padreId ?? null,
      })
      .returning();

    if (!inserted.length) {
      throw new Error('Error al crear la ubicación técnica');
    }

    return {
      message: 'Ubicación técnica creada correctamente',
      ubicacion: inserted[0],
    };
  } catch (error) {
    console.error('Error creating ubicacion tecnica:', error);
    throw new Error('Error al crear la ubicación técnica');
  }
};

export const updateUbicacionTecnica = async (
  idUbicacion: number,
  params: Partial<CreateUbicacionesTecnicasParams>
) => {
  try {
    // Prevent updating codigo_Identificacion directly
    if ('codigo_Identificacion' in params) {
      throw new Error(
        'No se puede actualizar codigo_Identificacion directamente'
      );
    }
    // Only allow updating descripcion or abreviacion
    const updateData: any = {};
    if (params.descripcion) updateData.descripcion = params.descripcion;
    if (params.abreviacion) updateData.abreviacion = params.abreviacion;
    if (params.padreId !== undefined) updateData.padreId = params.padreId;

    if (Object.keys(updateData).length === 0) {
      throw new Error('No hay campos válidos para actualizar');
    }

    // If abreviacion or padreId changes, recalculate codigo_Identificacion
    if (params.abreviacion || params.padreId !== undefined) {
      let codigo_Identificacion: string;
      let nivel: number;
      let abreviacion = params.abreviacion;
      let padreId = params.padreId;
      // Fetch parent if padreId is set
      if (padreId) {
        const parent = await db
          .select()
          .from(ubicacionTecnica)
          .where(eq(ubicacionTecnica.idUbicacion, padreId))
          .limit(1);
        if (!parent.length) {
          throw new Error('Ubicación técnica superior no encontrada');
        }
        codigo_Identificacion = `${parent[0].codigo_Identificacion}-${
          abreviacion ?? ''
        }`;
        nivel = (parent[0].nivel ?? 0) + 1;
      } else {
        // Root level
        codigo_Identificacion = abreviacion ?? '';
        nivel = 1;
      }
      updateData.codigo_Identificacion = codigo_Identificacion;
      updateData.nivel = nivel;
    }

    const updated = await db
      .update(ubicacionTecnica)
      .set(updateData)
      .where(eq(ubicacionTecnica.idUbicacion, idUbicacion))
      .returning();

    if (!updated.length) {
      throw new Error('Ubicación técnica no encontrada o sin cambios');
    }
    return {
      message: 'Ubicación técnica actualizada correctamente',
      ubicacion: updated[0],
    };
  } catch (error) {
    console.error('Error updating ubicacion tecnica:', error);
    throw new Error('Error al actualizar la ubicación técnica');
  }
};

export const deleteUbicacionTecnica = async (idUbicacion: number) => {
  try {
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
    throw new Error('Error al eliminar la ubicación técnica');
  }
};
