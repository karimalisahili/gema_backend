import { db } from '../../db';
import { trabajaEnGrupo } from '../../tables/trabajaEnGrupo';
import { createTrabajaEnGrupoParams } from '../../types/trabajaEnGrupo';

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
      message: 'Grupo de trabajo creado correctamente',
      trabajaEnGrupo: inserted[0],
    };
  } catch (error) {
    console.error('Error adding worker to group');
    throw new Error('Error al añadir trabajador al grupo de trabajo');
  }
};
