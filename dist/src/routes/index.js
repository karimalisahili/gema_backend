"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tecnico_routes_1 = __importDefault(require("../controllers/tecnico/tecnico.routes"));
const gruposDeTrabajo_routes_1 = __importDefault(require("../controllers/gruposDeTrabajo/gruposDeTrabajo.routes"));
const auth_routes_1 = __importDefault(require("../controllers/auth/auth.routes"));
const ubicacionesTecnicas_routes_1 = __importDefault(require("../controllers/ubicacionesTecnicas/ubicacionesTecnicas.routes"));
const auth_middleware_1 = require("../middleware/auth.middleware"); // Importa el middleware
const trabajaEnGrupo_routes_1 = __importDefault(require("../controllers/trabajaEnGrupo/trabajaEnGrupo.routes"));
const router = (0, express_1.Router)();
// Protege la ruta de tecnicos
router.use('/tecnicos', auth_middleware_1.authenticate, tecnico_routes_1.default);
router.use('/grupos', auth_middleware_1.authenticate, gruposDeTrabajo_routes_1.default);
router.use('/trabajaEnGrupo', auth_middleware_1.authenticate, trabajaEnGrupo_routes_1.default);
router.use('/login', auth_routes_1.default);
router.use('/ubicaciones-tecnicas', auth_middleware_1.authenticate, ubicacionesTecnicas_routes_1.default);
exports.default = router;
