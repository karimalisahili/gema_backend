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
exports.loginHandler = void 0;
const auth_service_1 = require("./auth.service");
const loginHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, auth_service_1.login)(req.body);
        res.status(201).json({
            data: user,
        });
        return;
    }
    catch (error) {
        if (error instanceof auth_service_1.AuthError) {
            res.status(401).json({
                error: 'Correo o contraseña incorrectos',
            });
            return;
        }
        console.error('Error in loginHandler:', error);
        res.status(500).json({
            error: 'Error al autenticar coordinador',
        });
    }
});
exports.loginHandler = loginHandler;
