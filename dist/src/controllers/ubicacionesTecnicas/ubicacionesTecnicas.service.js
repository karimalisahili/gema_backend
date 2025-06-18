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
exports.getUbicacionTecnicaById = exports.getUbicacionesTecnicas = exports.deleteUbicacionTecnica = exports.updateUbicacionTecnica = exports.createUbicacionTecnica = void 0;
const db_1 = require("../../db");
const ubicacionTecnica_1 = require("../../tables/ubicacionTecnica");
const incluyen_1 = require("../../tables/incluyen");
const drizzle_orm_1 = require("drizzle-orm");
const createUbicacionTecnica = (params) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
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
            const padres = yield db_1.db
                .select()
                .from(ubicacionTecnica_1.ubicacionTecnica)
                .where((0, drizzle_orm_1.inArray)(ubicacionTecnica_1.ubicacionTecnica.idUbicacion, padresIds));
            const padreParaCodigo = padres.find(p => p.idUbicacion === padreIdParaCodigo);
            if (!padreParaCodigo) {
                throw new Error('El padre para el código no existe');
            }
            nivel = ((_a = padreParaCodigo.nivel) !== null && _a !== void 0 ? _a : 0) + 1;
            codigo_Identificacion = `${padreParaCodigo.codigo_Identificacion}-${params.abreviacion}`;
        }
        const inserted = yield db_1.db
            .insert(ubicacionTecnica_1.ubicacionTecnica)
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
                yield db_1.db.insert(incluyen_1.incluyen).values({
                    idPadre: padre.idPadre,
                    idHijo,
                    esUbicacionFisica: (_b = padre.esUbicacionFisica) !== null && _b !== void 0 ? _b : false,
                });
            }
        }
        return {
            message: 'Ubicación técnica creada correctamente',
            ubicacion: inserted[0],
        };
    }
    catch (error) {
        console.error('Error creating ubicacion tecnica:', error);
        throw new Error('Error al crear la ubicación técnica');
    }
});
exports.createUbicacionTecnica = createUbicacionTecnica;
const updateUbicacionTecnica = (idUbicacion, params) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const updateData = {};
        if (params.descripcion !== undefined)
            updateData.descripcion = params.descripcion;
        if (params.abreviacion !== undefined)
            updateData.abreviacion = params.abreviacion;
        // Only recalculate nivel and codigo_Identificacion if padres is present in the request
        if (params.padres && params.padres.length > 0) {
            const padresIds = params.padres.map(p => p.idPadre);
            const padres = yield db_1.db
                .select()
                .from(ubicacionTecnica_1.ubicacionTecnica)
                .where((0, drizzle_orm_1.inArray)(ubicacionTecnica_1.ubicacionTecnica.idUbicacion, padresIds));
            const padreFisico = params.padres.find(p => p.esUbicacionFisica);
            const padreIdParaCodigo = padreFisico
                ? padreFisico.idPadre
                : params.padres[0].idPadre;
            const padreParaCodigo = padres.find(p => p.idUbicacion === padreIdParaCodigo);
            let nivel;
            let codigo_Identificacion;
            if (padreParaCodigo) {
                nivel = ((_a = padreParaCodigo.nivel) !== null && _a !== void 0 ? _a : 0) + 1;
                codigo_Identificacion = `${(_b = padreParaCodigo.codigo_Identificacion) !== null && _b !== void 0 ? _b : ''}-${(_c = params.abreviacion) !== null && _c !== void 0 ? _c : ''}`;
            }
            else {
                nivel = 1;
                codigo_Identificacion = (_d = params.abreviacion) !== null && _d !== void 0 ? _d : '';
            }
            updateData.nivel = nivel;
            updateData.codigo_Identificacion = codigo_Identificacion;
        }
        const updated = yield db_1.db
            .update(ubicacionTecnica_1.ubicacionTecnica)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(ubicacionTecnica_1.ubicacionTecnica.idUbicacion, idUbicacion))
            .returning();
        if (!updated.length) {
            throw new Error('Ubicación técnica no encontrada o sin cambios');
        }
        if (params.padres) {
            yield db_1.db.delete(incluyen_1.incluyen).where((0, drizzle_orm_1.eq)(incluyen_1.incluyen.idHijo, idUbicacion));
            for (const padre of params.padres) {
                yield db_1.db.insert(incluyen_1.incluyen).values({
                    idPadre: padre.idPadre,
                    idHijo: idUbicacion,
                    esUbicacionFisica: (_e = padre.esUbicacionFisica) !== null && _e !== void 0 ? _e : false,
                });
            }
        }
        return {
            message: 'Ubicación técnica actualizada correctamente',
            ubicacion: updated[0],
        };
    }
    catch (error) {
        console.error('Error updating ubicacion tecnica:', error);
        throw new Error('Error al actualizar la ubicación técnica');
    }
});
exports.updateUbicacionTecnica = updateUbicacionTecnica;
const deleteUbicacionTecnica = (idUbicacion) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.db.delete(incluyen_1.incluyen).where((0, drizzle_orm_1.eq)(incluyen_1.incluyen.idHijo, idUbicacion));
        const deleted = yield db_1.db
            .delete(ubicacionTecnica_1.ubicacionTecnica)
            .where((0, drizzle_orm_1.eq)(ubicacionTecnica_1.ubicacionTecnica.idUbicacion, idUbicacion))
            .returning();
        if (!deleted.length) {
            throw new Error('Ubicación técnica no encontrada');
        }
        return {
            message: 'Ubicación técnica eliminada correctamente',
            ubicacion: deleted[0],
        };
    }
    catch (error) {
        console.error('Error deleting ubicacion tecnica:', error);
        throw new Error('Error al eliminar la ubicación técnica');
    }
});
exports.deleteUbicacionTecnica = deleteUbicacionTecnica;
const getUbicacionesTecnicas = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ubicaciones = yield db_1.db.select().from(ubicacionTecnica_1.ubicacionTecnica);
        return ubicaciones;
    }
    catch (error) {
        console.error('Error fetching ubicaciones tecnicas:', error);
        throw new Error('Error al obtener las ubicaciones técnicas');
    }
});
exports.getUbicacionesTecnicas = getUbicacionesTecnicas;
const getUbicacionTecnicaById = (idUbicacion) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ubicacion = yield db_1.db
            .select()
            .from(ubicacionTecnica_1.ubicacionTecnica)
            .where((0, drizzle_orm_1.eq)(ubicacionTecnica_1.ubicacionTecnica.idUbicacion, idUbicacion));
        if (!ubicacion.length) {
            throw new Error('Ubicación técnica no encontrada');
        }
        return ubicacion[0];
    }
    catch (error) {
        console.error('Error fetching ubicacion tecnica by id:', error);
        throw new Error('Error al obtener la ubicación técnica');
    }
});
exports.getUbicacionTecnicaById = getUbicacionTecnicaById;
