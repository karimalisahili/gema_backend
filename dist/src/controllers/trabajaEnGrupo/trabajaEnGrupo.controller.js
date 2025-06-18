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
exports.deleteTrabajaEnGrupoHandler = exports.createTrabajaEnGrupoHandler = void 0;
const trabajaEnGrupo_service_1 = require("./trabajaEnGrupo.service");
const createTrabajaEnGrupoHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trabajaEnGrupo = yield (0, trabajaEnGrupo_service_1.createTrabajaEnGrupo)(req.body);
        res.status(201).json({
            data: trabajaEnGrupo,
        });
        return;
    }
    catch (error) {
        console.error('Error in trabajaEnGrupoHandler: ', error);
        res.status(500).json({
            error: 'Error al añadir trabajador a grupo de trabajo',
        });
        return;
    }
});
exports.createTrabajaEnGrupoHandler = createTrabajaEnGrupoHandler;
const deleteTrabajaEnGrupoHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tecnicoId = parseInt(req.params.tecnicoId, 10);
        const grupoDeTrabajoId = parseInt(req.params.grupoDeTrabajoId, 10);
        if (isNaN(tecnicoId) || isNaN(grupoDeTrabajoId)) {
            res.status(400).json({
                error: 'Los IDs de técnico y grupo deben ser números válidos',
            });
        }
        const result = yield (0, trabajaEnGrupo_service_1.deleteTrabajaEnGrupo)(tecnicoId, grupoDeTrabajoId);
        if (result === null) {
            res
                .status(404)
                .json({ error: 'Asignación de trabajador a un grupo no encontrado' });
            return;
        }
        res.status(200).json({
            message: result.message,
            data: result.trabajaEnGrupo,
        });
    }
    catch (error) {
        console.error('Error in deleteTrabajaEnGrupoHandler: ', error);
        res.status(500).json({
            error: 'Error al eliminar trabajador de grupo de trabajo',
        });
        return;
    }
});
exports.deleteTrabajaEnGrupoHandler = deleteTrabajaEnGrupoHandler;
