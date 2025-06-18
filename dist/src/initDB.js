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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const usuarios_1 = require("./tables/usuarios");
const dotenv_1 = __importDefault(require("dotenv"));
const password_1 = require("./utils/password");
dotenv_1.default.config();
const initDB = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Starting database initialization...');
    // Clean usuarios table
    yield db_1.db.delete(usuarios_1.usuarios);
    const plainPassword = '123456';
    const nombre = 'Coordinador Principal';
    const correo = 'coordinador@gema.com';
    const tipo = 'COORDINADOR';
    try {
        const contrasenaHash = yield (0, password_1.hashPassword)(plainPassword);
        // Comprobar que comparePassword funciona correctamente
        const isMatch = yield (0, password_1.comparePassword)(plainPassword, contrasenaHash);
        yield db_1.db.transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // Insertar usuario (sin contraseña)
            const inserted = yield tx
                .insert(usuarios_1.usuarios)
                .values({
                Nombre: nombre,
                Correo: correo,
                Tipo: tipo,
                Contraseña: contrasenaHash,
            })
                .returning({ Id: usuarios_1.usuarios.Id });
            const usuarioId = (_a = inserted[0]) === null || _a === void 0 ? void 0 : _a.Id;
            if (!usuarioId)
                throw new Error('No se pudo obtener el Id del usuario');
        }));
        console.log('Usuario coordinador agregado correctamente.');
    }
    catch (error) {
        console.error('Error al agregar usuario:', error);
    }
});
initDB();
