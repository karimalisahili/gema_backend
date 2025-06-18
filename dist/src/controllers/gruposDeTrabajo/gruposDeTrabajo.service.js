"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGrupoDeTrabajo = exports.updateGrupoDeTrabajo = exports.getGrupoDeTrabajoById = exports.getGruposDeTrabajo = exports.createGrupoDeTrabajo = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../db");
const grupoDeTrabajo_1 = require("../../tables/grupoDeTrabajo");
const createGrupoDeTrabajo = (params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inserted = yield db_1.db
            .insert(grupoDeTrabajo_1.grupoDeTrabajo)
            .values({
            codigo: params.codigo,
            nombre: params.nombre,
            supervisorId: params.supervisorId,
        })
            .returning();
        if (!inserted.length) {
            throw new Error('Error al crear el grupo de trabajo');
        }
        return {
            message: 'Grupo de trabajo creado correctamente',
            grupo: inserted[0],
        };
    }
    catch (error) {
        console.error('Error creating grupo de trabajo');
        throw new Error('Error al crear el grupo de trabajo');
    }
});
exports.createGrupoDeTrabajo = createGrupoDeTrabajo;
/**
 * Obtener todos los grupos de trabajo.
 * @author AndresChacon00
 */
const getGruposDeTrabajo = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const grupos = yield db_1.db.select().from(grupoDeTrabajo_1.grupoDeTrabajo);
        return grupos;
    }
    catch (error) {
        console.error('Error al obtener los grupos de trabajo', error);
        throw new Error('No se pudieron obtener los grupos de trabajo');
    }
});
exports.getGruposDeTrabajo = getGruposDeTrabajo;
/**
 * Obtener un grupo de trabajo por su Id
 * @param id - El id del grupo de trabajo
 * @author AndresChacon00
 */
const getGrupoDeTrabajoById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.db
            .select()
            .from(grupoDeTrabajo_1.grupoDeTrabajo)
            .where((0, drizzle_orm_1.eq)(grupoDeTrabajo_1.grupoDeTrabajo.id, id))
            .limit(1);
        return result;
    }
    catch (error) {
        console.error(`Error al obtener el grupo de trabajo con ID ${id}:`, error);
        throw new Error('No se pudo obtener el grupo de trabajo.');
    }
});
exports.getGrupoDeTrabajoById = getGrupoDeTrabajoById;
/**
 * Actualizar un grupo de trabajo existente.
 * @param id - El id del grupo de trabajo a actualizar
 * @params params - Los datos para actualizar el grupo de trabajo
 * @author AndresChacon00
 */
const updateGrupoDeTrabajo = (id, params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield db_1.db
            .update(grupoDeTrabajo_1.grupoDeTrabajo)
            .set({
            codigo: params.codigo,
            nombre: params.nombre,
            supervisorId: params.supervisorId,
        })
            .where((0, drizzle_orm_1.eq)(grupoDeTrabajo_1.grupoDeTrabajo.id, id))
            .returning();
        if (!updated.length) {
            throw new Error('Error al actualizar grupo de trabajo');
        }
        return {
            message: 'Grupo de trabajo actualizado correctamente',
            grupo: updated[0],
        };
    }
    catch (error) {
        console.error(`Error al actualizar un grupo de trabajo con ID ${id} :`, error);
        throw new Error('Error al actualizar el grupo de trabajo');
    }
});
exports.updateGrupoDeTrabajo = updateGrupoDeTrabajo;
/**
 * Eliminar un grupo de trabajo por su id
 * @param id - El id del grupo de trabajo a eliminar
 * @author AndresChacon00
 */
const deleteGrupoDeTrabajo = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield db_1.db
            .delete(grupoDeTrabajo_1.grupoDeTrabajo)
            .where((0, drizzle_orm_1.eq)(grupoDeTrabajo_1.grupoDeTrabajo.id, id))
            .returning();
        if (!deleted.length) {
            throw new Error('No se encontró al grupo');
        }
        return {
            message: 'Grupo de trabajo eliminado correctamente',
            grupo: deleted[0],
        };
    }
    catch (error) {
        console.error(`Error eliminando grupo de trabajo con ID ${id}: `, error);
        throw new Error('Error al eliminar el grupo de trabajo');
    }
});
exports.deleteGrupoDeTrabajo = deleteGrupoDeTrabajo;
