"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trabajaEnGrupo_controller_1 = require("./trabajaEnGrupo.controller");
const router = (0, express_1.Router)();
router.post('/', trabajaEnGrupo_controller_1.createTrabajaEnGrupoHandler);
router.delete('/:tecnicoId/:grupoDeTrabajoId', trabajaEnGrupo_controller_1.deleteTrabajaEnGrupoHandler);
exports.default = router;
