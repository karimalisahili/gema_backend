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
exports.deleteTrabajaEnGrupo = exports.createTrabajaEnGrupo = void 0;
const db_1 = require("../../db");
const trabajaEnGrupo_1 = require("../../tables/trabajaEnGrupo");
const drizzle_orm_1 = require("drizzle-orm");
const createTrabajaEnGrupo = (params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inserted = yield db_1.db
            .insert(trabajaEnGrupo_1.trabajaEnGrupo)
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
    }
    catch (error) {
        console.error('Error adding worker to group');
        throw new Error('Error al añadir trabajador al grupo de trabajo');
    }
});
exports.createTrabajaEnGrupo = createTrabajaEnGrupo;
const deleteTrabajaEnGrupo = (tecnicoId, grupoDeTrabajoId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield db_1.db
            .delete(trabajaEnGrupo_1.trabajaEnGrupo)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(trabajaEnGrupo_1.trabajaEnGrupo.tecnicoId, tecnicoId), (0, drizzle_orm_1.eq)(trabajaEnGrupo_1.trabajaEnGrupo.grupoDeTrabajoId, grupoDeTrabajoId)))
            .returning();
        if (!deleted.length) {
            throw new Error('Error al eliminar la relacion trabajaEnGrupo');
        }
        return {
            message: 'Trabajador eliminado del grupo de trabajo',
            trabajaEnGrupo: deleted[0],
        };
    }
    catch (error) {
        console.error(`Error eliminando asignación para tecnicoId ${tecnicoId} y grupoDeTrabajoId ${grupoDeTrabajoId}:`, error);
        throw new Error('Error al eliminar la asignación del trabajador al grupo de trabajo');
    }
});
exports.deleteTrabajaEnGrupo = deleteTrabajaEnGrupo;
