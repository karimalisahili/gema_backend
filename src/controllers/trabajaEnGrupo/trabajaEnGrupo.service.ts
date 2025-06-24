import { db } from '../../db';
import { trabajaEnGrupo } from '../../tables/trabajaEnGrupo';
import { createTrabajaEnGrupoParams } from '../../types/trabajaEnGrupo';
import { grupoDeTrabajo } from '../../tables/grupoDeTrabajo';
import { and, eq } from 'drizzle-orm';
import { usuarios } from '../../tables/usuarios';

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

export const getAllWorkersInGroup = async (grupoDeTrabajoId: number) => {
  try {
    // Importa la tabla usuarios arriba: import { usuarios } from '../../tables/usuarios';
    const usuariosResult = (
      await db
        .select({ usuario: usuarios })
        .from(trabajaEnGrupo)
        .leftJoin(usuarios, eq(trabajaEnGrupo.tecnicoId, usuarios.Id))
        .where(eq(trabajaEnGrupo.grupoDeTrabajoId, grupoDeTrabajoId))
    )
      .map(row => row.usuario)
      .filter(Boolean);

    return usuariosResult;
  } catch (error) {}
};

export const getAllWorkersInAllGroups = async () => {
  try {
    const result = await db
      .select({
        grupoDeTrabajoId: trabajaEnGrupo.grupoDeTrabajoId,
        tecnicoId: trabajaEnGrupo.tecnicoId,
        usuario: usuarios,
      })
      .from(trabajaEnGrupo)
      .leftJoin(usuarios, eq(trabajaEnGrupo.tecnicoId, usuarios.Id));

    // Agrupar usuarios por grupoDeTrabajoId
    const gruposMap: Record<
      number,
      { grupoDeTrabajoId: number; usuarios: any[] }
    > = {};

    result.forEach((item: any) => {
      const grupoId = item.grupoDeTrabajoId;
      if (!gruposMap[grupoId]) {
        gruposMap[grupoId] = {
          grupoDeTrabajoId: grupoId,
          usuarios: [],
        };
      }
      if (item.usuario) {
        gruposMap[grupoId].usuarios.push(item.usuario);
      }
    });

    return Object.values(gruposMap);
  } catch (error) {
    console.error(
      'Error al obtener todos los trabajadores en todos los grupos:',
      error
    );
    throw new Error(
      'No se pudo obtener la información de los trabajadores en los grupos' +
        error
    );
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
