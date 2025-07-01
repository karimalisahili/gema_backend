import { db } from '../../db';
import { ubicacionTecnica } from '../../tables/ubicacionTecnica';
import { incluyen } from '../../tables/incluyen';
import {
  CreateUbicacionesTecnicasParams,
  UpdateUbicacionesTecnicasParams,
  UbicacionNode,
} from '../../types/ubicacionesTecnicas';
import { eq, and, inArray } from 'drizzle-orm';

/**
 * Crea una nueva ubicación técnica.
 * @param params Objeto con los datos de la ubicación técnica a crear
 *   - descripcion: string (requerido)
 *   - abreviacion: string (requerido)
 *   - padres: Array<{ idPadre: number; esUbicacionFisica?: boolean }> (opcional)
 *     - idPadre: ID del padre
 *     - esUbicacionFisica: true si este padre es la ubicación física principal
 * @returns Objeto con mensaje y la ubicación creada
 * Endpoint: POST /ubicaciones-tecnicas
 * Ejemplo de body para padres:
 *   padres: [
 *     { idPadre: 1, esUbicacionFisica: true },
 *     { idPadre: 2 }
 *   ]
 * Si hay varios padres, solo uno debe tener esUbicacionFisica: true (el resto se asume false).
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
 * @param idUbicacion ID de la ubicación técnica a actualizar
 * @param params Objeto con los datos a actualizar
 *   - descripcion: string (opcional)
 *   - abreviacion: string (opcional)
 *   - padres: Array<{ idPadre: number; esUbicacionFisica?: boolean }> (opcional)
 * @returns Objeto con mensaje y la ubicación actualizada
 * Endpoint: PUT /ubicaciones-tecnicas/:id
 * Ejemplo de body para padres igual que en creación.
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
 * @param idUbicacion ID de la ubicación técnica a eliminar
 * @returns Objeto con mensaje y la ubicación eliminada
 * Endpoint: DELETE /ubicaciones-tecnicas/:id
 * Descripción: Elimina la ubicación técnica y, en cascada, todos los hijos cuya relación apunte a este padre.
 */
export const deleteUbicacionTecnica = async (idUbicacion: number) => {
  try {
    // Buscar todos los hijos donde este es padre (sin importar esUbicacionFisica)
    const hijos = await db
      .select({ idHijo: incluyen.idHijo })
      .from(incluyen)
      .where(eq(incluyen.idPadre, idUbicacion));

    // Deshabilitar recursivamente los hijos
    for (const hijo of hijos) {
      await deleteUbicacionTecnica(hijo.idHijo);
    }

    // Eliminar relaciones en Incluyen donde este es hijo
    await db.delete(incluyen).where(eq(incluyen.idHijo, idUbicacion));
    // Eliminar relaciones en Incluyen donde este es padre
    await db.delete(incluyen).where(eq(incluyen.idPadre, idUbicacion));

    // En vez de eliminar, deshabilitar la ubicación técnica
    const updated = await db
      .update(ubicacionTecnica)
      .set({ estaHabilitado: false })
      .where(eq(ubicacionTecnica.idUbicacion, idUbicacion))
      .returning();
    if (!updated.length) {
      throw new Error('Ubicación técnica no encontrada');
    }
    return {
      message: 'Ubicación técnica deshabilitada correctamente',
      ubicacion: updated[0],
    };
  } catch (error) {
    console.error('Error disabling ubicacion tecnica:', error);
    throw new Error(
      `Error al deshabilitar la ubicación técnica: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};

/**
 * Obtiene todas las ubicaciones técnicas.
 * @returns Array de todas las ubicaciones técnicas
 * Endpoint: GET /ubicaciones-tecnicas
 */
export const getUbicacionesTecnicas = async () => {
  try {
    // 1. Obtener todas las ubicaciones habilitadas
    const ubicaciones = await db
      .select()
      .from(ubicacionTecnica)
      .where(eq(ubicacionTecnica.estaHabilitado, true));

    // 2. Obtener todas las relaciones padre-hijo
    const relaciones = await db.select().from(incluyen);

    // 3. Crear un mapa de ubicaciones por id
    const ubicacionMap = new Map<number, UbicacionNode>();
    for (const u of ubicaciones) {
      ubicacionMap.set(u.idUbicacion, { ...u, children: [] });
    }

    // 4. Construir el árbol
    const hijosSet = new Set<number>();
    for (const rel of relaciones) {
      const padre = ubicacionMap.get(rel.idPadre);
      const hijo = ubicacionMap.get(rel.idHijo);
      if (padre && hijo) {
        padre.children!.push(hijo);
        hijosSet.add(hijo.idUbicacion);
      }
    }

    // 5. Los nodos raíz son los que no son hijos de nadie
    const roots = Array.from(ubicacionMap.values()).filter(
      node => !hijosSet.has(node.idUbicacion)
    );

    return roots;
  } catch (error) {
    console.error('Error fetching ubicaciones tecnicas:', error);
    throw new Error(
      `Error al obtener las ubicaciones técnicas: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};

/**
 * Obtiene una ubicación técnica por su ID.
 * @param idUbicacion ID de la ubicación técnica
 * @returns La ubicación técnica correspondiente
 * Endpoint: GET /ubicaciones-tecnicas/:id
 */
export const getUbicacionTecnicaById = async (idUbicacion: number) => {
  try {
    const ubicacion = await db
      .select()
      .from(ubicacionTecnica)
      .where(
        and(
          eq(ubicacionTecnica.idUbicacion, idUbicacion),
          eq(ubicacionTecnica.estaHabilitado, true)
        )
      );
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

/**
 * Obtiene todas las ubicaciones técnicas de un nivel específico.
 * @param nivel El nivel jerárquico a filtrar
 * @returns Array de ubicaciones técnicas en ese nivel
 * Endpoint: GET /ubicaciones-tecnicas/nivel/:nivel
 */
export const getUbicacionesPorNivel = async (nivel: number) => {
  try {
    const ubicaciones = await db
      .select()
      .from(ubicacionTecnica)
      .where(eq(ubicacionTecnica.estaHabilitado, true));
    return ubicaciones.filter(u => u.nivel === nivel);
  } catch (error) {
    console.error('Error fetching ubicaciones por nivel:', error);
    throw new Error(
      `Error al obtener las ubicaciones por nivel: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};

/**
 * Obtiene todas las ubicaciones dependientes (descendientes) de una ubicación dada.
 * @param idUbicacion ID de la ubicación raíz
 * @param nivel (opcional) nivel jerárquico a filtrar (query param opcional)
 * @returns Array de ubicaciones dependientes (descendientes). Si se indica nivel, solo retorna las de ese nivel.
 * Endpoint: GET /ubicaciones-tecnicas/ramas/:id?nivel=4
 * Nota: El parámetro nivel es opcional y solo filtra si se provee.
 */
export const getUbicacionesDependientes = async (
  idUbicacion: number,
  nivel?: number,
  visitados: Set<number> = new Set()
): Promise<any[]> => {
  try {
    let dependientes: any[] = [];
    const hijos = await db
      .select({ idHijo: incluyen.idHijo })
      .from(incluyen)
      .where(eq(incluyen.idPadre, idUbicacion));
    for (const hijo of hijos) {
      if (visitados.has(hijo.idHijo)) continue; // Evita ciclos y duplicados
      visitados.add(hijo.idHijo);
      const ubicacionArr = await db
        .select()
        .from(ubicacionTecnica)
        .where(
          and(
            eq(ubicacionTecnica.idUbicacion, hijo.idHijo),
            eq(ubicacionTecnica.estaHabilitado, true)
          )
        );
      if (ubicacionArr.length) {
        const ubicacion = ubicacionArr[0];
        if (nivel === undefined || ubicacion.nivel === nivel) {
          dependientes.push(ubicacion);
        }
        // Siempre sigue recorriendo para encontrar descendientes que sí cumplan el nivel
        const subdependientes = await getUbicacionesDependientes(
          hijo.idHijo,
          nivel,
          visitados
        );
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

/**
 * Obtiene la(s) cadena(s) jerárquica(s) de padres hasta el hijo dado, en estructura padre-hijo.
 * @param idHijo ID de la ubicación técnica hija
 * @returns Array de árboles desde la(s) raíz(ces) hasta el hijo, estructura padre→hijo
 * Ejemplo de retorno:
 * [
 *   { ...padre1, child: { ...padre2, child: { ...hijo } } },
 *   { ...padreX, child: { ...hijo } }
 * ]
 */
export const getPadresByIdHijo = async (
  idHijo: number
): Promise<UbicacionNode[]> => {
  try {
    // Buscar todos los padres directos de este hijo, incluyendo esUbicacionFisica
    const padresRel = await db
      .select({
        idPadre: incluyen.idPadre,
        esUbicacionFisica: incluyen.esUbicacionFisica,
      })
      .from(incluyen)
      .where(eq(incluyen.idHijo, idHijo));

    if (!padresRel.length) {
      return [];
    }

    const padres: UbicacionNode[] = [];
    for (const rel of padresRel) {
      const padreArr = await db
        .select()
        .from(ubicacionTecnica)
        .where(eq(ubicacionTecnica.idUbicacion, rel.idPadre));
      if (padreArr.length) {
        const padre = padreArr[0];
        padres.push({
          idUbicacion: padre.idUbicacion,
          descripcion: padre.descripcion,
          abreviacion: padre.abreviacion,
          codigo_Identificacion: padre.codigo_Identificacion,
          estaHabilitado: padre.estaHabilitado,
          nivel: padre.nivel,
          esUbicacionFisica: rel.esUbicacionFisica,
        });
      }
    }
    return padres;
  } catch (error) {
    console.error('Error fetching padres by idHijo:', error);
    throw new Error(
      `Error al obtener los padres directos: ${
        error instanceof Error ? error.message : error
      }`
    );
  }
};
