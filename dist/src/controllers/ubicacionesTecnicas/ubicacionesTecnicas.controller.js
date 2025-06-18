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
exports.getUbicacionTecnicaByIdHandler = exports.getUbicacionesTecnicasHandler = exports.deleteUbicacionTecnicaHandler = exports.updateUbicacionTecnicaHandler = exports.createUbicacionTecnicaHandler = void 0;
const ubicacionesTecnicas_service_1 = require("./ubicacionesTecnicas.service");
const createUbicacionTecnicaHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ubicacion = yield (0, ubicacionesTecnicas_service_1.createUbicacionTecnica)(req.body);
        res.status(201).json({
            data: ubicacion,
        });
        return;
    }
    catch (error) {
        console.error('Error in createUbicacionTecnicaHandler:', error);
        res.status(500).json({
            error: 'Error al crear la ubicación técnica',
        });
        return;
    }
});
exports.createUbicacionTecnicaHandler = createUbicacionTecnicaHandler;
const updateUbicacionTecnicaHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUbicacion = Number(req.params.id);
        const ubicacion = yield (0, ubicacionesTecnicas_service_1.updateUbicacionTecnica)(idUbicacion, req.body);
        res.status(200).json({ data: ubicacion });
        return;
    }
    catch (error) {
        console.error('Error in updateUbicacionTecnicaHandler:', error);
        res.status(500).json({ error: 'Error al actualizar la ubicación técnica' });
        return;
    }
});
exports.updateUbicacionTecnicaHandler = updateUbicacionTecnicaHandler;
const deleteUbicacionTecnicaHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUbicacion = Number(req.params.id);
        const ubicacion = yield (0, ubicacionesTecnicas_service_1.deleteUbicacionTecnica)(idUbicacion);
        res.status(200).json({ data: ubicacion });
        return;
    }
    catch (error) {
        console.error('Error in deleteUbicacionTecnicaHandler:', error);
        res.status(500).json({ error: 'Error al eliminar la ubicación técnica' });
        return;
    }
});
exports.deleteUbicacionTecnicaHandler = deleteUbicacionTecnicaHandler;
const getUbicacionesTecnicasHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ubicaciones = yield (0, ubicacionesTecnicas_service_1.getUbicacionesTecnicas)();
        res.status(200).json({ data: ubicaciones });
        return;
    }
    catch (error) {
        console.error('Error in getUbicacionesTecnicasHandler:', error);
        res
            .status(500)
            .json({ error: 'Error al obtener las ubicaciones técnicas' });
        return;
    }
});
exports.getUbicacionesTecnicasHandler = getUbicacionesTecnicasHandler;
const getUbicacionTecnicaByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUbicacion = Number(req.params.id);
        const ubicacion = yield (0, ubicacionesTecnicas_service_1.getUbicacionTecnicaById)(idUbicacion);
        res.status(200).json({ data: ubicacion });
        return;
    }
    catch (error) {
        console.error('Error in getUbicacionTecnicaByIdHandler:', error);
        res.status(404).json({ error: 'Ubicación técnica no encontrada' });
        return;
    }
});
exports.getUbicacionTecnicaByIdHandler = getUbicacionTecnicaByIdHandler;
