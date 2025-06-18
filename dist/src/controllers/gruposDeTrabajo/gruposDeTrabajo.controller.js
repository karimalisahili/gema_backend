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
exports.deleteGrupoDeTrabajoHandler = exports.updateGrupoDeTrabajoHandler = exports.getGruposDeTrabajoByIdHandler = exports.getGruposDeTrabajoHandler = exports.createGrupoDeTrabajoHandler = void 0;
const gruposDeTrabajo_service_1 = require("./gruposDeTrabajo.service");
const gruposDeTrabajo_service_2 = require("./gruposDeTrabajo.service");
const createGrupoDeTrabajoHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const grupoDeTrabajo = yield (0, gruposDeTrabajo_service_1.createGrupoDeTrabajo)(req.body);
        res.status(201).json({
            data: grupoDeTrabajo,
        });
        return;
    }
    catch (error) {
        console.error('Error in createGrupoDeTrabajoHandler: ', error);
        res.status(500).json({
            error: 'Error al crear el grupo de trabajo',
        });
        return;
    }
});
exports.createGrupoDeTrabajoHandler = createGrupoDeTrabajoHandler;
const getGruposDeTrabajoHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const grupos = yield (0, gruposDeTrabajo_service_1.getGruposDeTrabajo)();
        res.status(200).json({
            data: grupos,
        });
    }
    catch (error) {
        console.error('Error in getGruposDeTrabajoHandler: ', error);
        res.status(500).json({
            error: 'Error al obtener los grupos de trabajo',
        });
        return;
    }
});
exports.getGruposDeTrabajoHandler = getGruposDeTrabajoHandler;
const getGruposDeTrabajoByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ message: 'El ID debe ser un número válido.' });
            return;
        }
        const grupo = yield (0, gruposDeTrabajo_service_1.getGrupoDeTrabajoById)(id);
        if (grupo == null) {
            res.status(404).json({ message: 'Grupo de trabajo no encontrado.' });
            return;
        }
        res.status(200).json(grupo);
    }
    catch (error) {
        console.error('Error in getGruposDeTrabajoByIdHandler: ', error);
        res.status(500).json({
            error: 'Error al obtener los grupos de trabajo por id',
        });
        return;
    }
});
exports.getGruposDeTrabajoByIdHandler = getGruposDeTrabajoByIdHandler;
const updateGrupoDeTrabajoHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: 'El id debe ser un número válido' });
            return;
        }
        const { codigo, nombre, idSupervisor } = req.body;
        if (!codigo && !nombre && !idSupervisor === undefined) {
            res.status(400).json({
                error: 'Se requiere al menos un campo (codigo, nombre, idSupervisor) para actualizar',
            });
            return;
        }
        const result = yield (0, gruposDeTrabajo_service_2.updateGrupoDeTrabajo)(id, req.body);
        if (result === null) {
            res.status(400).json({
                error: 'Grupo de trabajo no encontrado',
            });
            return;
        }
        res.status(200).json({
            message: result.message,
            data: result.grupo,
        });
    }
    catch (error) {
        console.error('Error in updateGrupoDeTrabajoHandler: ', error);
        res.status(500).json({ error: 'Error al actualizar el grupo' });
    }
});
exports.updateGrupoDeTrabajoHandler = updateGrupoDeTrabajoHandler;
const deleteGrupoDeTrabajoHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: 'El id debe ser un número válido' });
            return;
        }
        const result = yield (0, gruposDeTrabajo_service_2.deleteGrupoDeTrabajo)(id);
        if (result === null) {
            res.status(404).json({ error: 'Grupo de trabajo no encontrado' });
            return;
        }
        res.status(200).json({
            message: result.message,
            data: result.grupo,
        });
    }
    catch (error) {
        console.error('Error in deleteGrupoDeTrabajoHandler: ', error);
        res.status(500).json({ error: 'Error al eliminar grupo de trabajo' });
    }
});
exports.deleteGrupoDeTrabajoHandler = deleteGrupoDeTrabajoHandler;
