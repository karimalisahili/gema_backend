import { db } from '../../db';
import { grupoDeTrabajo } from '../../tables/grupoDeTrabajo';
import { createGrupoDeTrabajoParams } from '../../types/gruposDeTrabajo';

export const createGrupoDeTrabajo = async (
  params: createGrupoDeTrabajoParams
) => {
  try {
    const inserted = await db
      .insert(grupoDeTrabajo)
      .values({
        codigo: params.codigo,
        nombre: params.nombre,
        supervisorId: params.idSupervisor,
      })
      .returning();

    if (!inserted.length) {
      throw new Error('Error al crear el grupo de trabajo');
    }

    return {
      message: 'Grupo de trabajo creado correctamente',
      grupo: inserted[0],
    };
  } catch (error) {
    console.error('Error creating grupo de trabajo');
    throw new Error('Error al crear el grupo de trabajo');
  }
};
