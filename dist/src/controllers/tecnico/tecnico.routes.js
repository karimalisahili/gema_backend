"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tecnico_controller_1 = require("./tecnico.controller");
const router = (0, express_1.Router)();
router.post("/", tecnico_controller_1.createTecnicoHandler);
exports.default = router;
