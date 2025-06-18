import { db } from '../../db';
import { ubicacionTecnica } from '../../tables/ubicacionTecnica';
import { incluyen } from '../../tables/incluyen';
import {
  CreateUbicacionesTecnicasParams,
  UpdateUbicacionesTecnicasParams,
} from '../../types/ubicacionesTecnicas';
import { eq, inArray } from 'drizzle-orm';

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
    throw new Error('Error al crear la ubicación técnica');
  }
};

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
    throw new Error('Error al actualizar la ubicación técnica');
  }
};

export const deleteUbicacionTecnica = async (idUbicacion: number) => {
  try {
    await db.delete(incluyen).where(eq(incluyen.idHijo, idUbicacion));
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

export const getUbicacionesTecnicas = async () => {
  try {
    const ubicaciones = await db.select().from(ubicacionTecnica);
    return ubicaciones;
  } catch (error) {
    console.error('Error fetching ubicaciones tecnicas:', error);
    throw new Error('Error al obtener las ubicaciones técnicas');
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
    throw new Error('Error al obtener la ubicación técnica');
  }
};
