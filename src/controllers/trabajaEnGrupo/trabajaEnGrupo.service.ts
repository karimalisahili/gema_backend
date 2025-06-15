import { db } from '../../db';
import { trabajaEnGrupo } from '../../tables/trabajaEnGrupo';
import { createTrabajaEnGrupoParams } from '../../types/trabajaEnGrupo';
import { grupoDeTrabajo } from '../../tables/grupoDeTrabajo';
import { and, eq } from 'drizzle-orm';

export const createTrabajaEnGrupo = async (
  params: createTrabajaEnGrupoParams
) => {
  try {
    const inserted = await db
      .insert(trabajaEnGrupo)
      .values({
        tecnicoId: params.tecnicoId,
        grupoDeTrabajoId: params.grupoDeTrabajoId,
      })
      .returning();

    if (!inserted.length) {
      throw new Error('Error al crear el grupo de trabajo');
    }

    return {
      message: 'Trabajador añadido al grupo de trabajo',
      trabajaEnGrupo: inserted[0],
    };
  } catch (error) {
    console.error('Error adding worker to group');
    throw new Error('Error al añadir trabajador al grupo de trabajo');
  }
};

export const deleteTrabajaEnGrupo = async (
  tecnicoId: number,
  grupoDeTrabajoId: number
) => {
  try {
    const deleted = await db
      .delete(trabajaEnGrupo)
      .where(
        and(
          eq(trabajaEnGrupo.tecnicoId, tecnicoId),
          eq(trabajaEnGrupo.grupoDeTrabajoId, grupoDeTrabajoId)
        )
      )
      .returning();

    if (!deleted.length) {
      throw new Error('Error al eliminar la relacion trabajaEnGrupo');
    }

    return {
      message: 'Trabajador eliminado del grupo de trabajo',
      trabajaEnGrupo: deleted[0],
    };
  } catch (error) {
    console.error(
      `Error eliminando asignación para tecnicoId ${tecnicoId} y grupoDeTrabajoId ${grupoDeTrabajoId}:`,
      error
    );
    throw new Error(
      'Error al eliminar la asignación del trabajador al grupo de trabajo'
    );
  }
};
