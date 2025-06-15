import { eq } from 'drizzle-orm';
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

/**
 * Obtener todos los grupos de trabajo.
 * @author AndresChacon00
 */
export const getGruposDeTrabajo = async () => {
  try {
    const grupos = await db.select().from(grupoDeTrabajo);
    return grupos;
  } catch (error) {
    console.error('Error al obtener los grupos de trabajo', error);
    throw new Error('No se pudieron obtener los grupos de trabajo');
  }
};

/**
 * Obtener un grupo de trabajo por su Id
 * @param id - El id del grupo de trabajo
 * @author AndresChacon00
 */
export const getGrupoDeTrabajoById = async (id: number) => {
  try {
    const result = await db
      .select()
      .from(grupoDeTrabajo)
      .where(eq(grupoDeTrabajo.id, id))
      .limit(1);
    return result;
  } catch (error) {
    console.error(`Error al obtener el grupo de trabajo con ID ${id}:`, error);
    throw new Error('No se pudo obtener el grupo de trabajo.');
  }
};
