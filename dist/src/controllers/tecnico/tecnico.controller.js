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
exports.createTecnicoHandler = void 0;
const tecnico_service_1 = require("./tecnico.service");
const createTecnicoHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, tecnico_service_1.createTecnico)(req.body);
        res.status(201).json({
            data: user,
        });
        return;
    }
    catch (error) {
        console.error("Error in createTecnicoHandler:", error);
        res.status(500).json({
            error: "Error al crear el tecnico",
        });
        return; // Ensure all code paths return a value
    }
});
exports.createTecnicoHandler = createTecnicoHandler;
