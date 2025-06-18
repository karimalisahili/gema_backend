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
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Hashea una contraseña usando bcrypt.
 * @param plainPassword Contraseña en texto plano.
 * @returns Contraseña hasheada.
 */
const hashPassword = (plainPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.hash(plainPassword, 10);
});
exports.hashPassword = hashPassword;
/**
 * Compara una contraseña en texto plano con un hash.
 * @param plainPassword Contraseña en texto plano.
 * @param hash Hash de la contraseña.
 * @returns true si coinciden, false si no.
 */
const comparePassword = (plainPassword, hash) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.compare(plainPassword, hash);
});
exports.comparePassword = comparePassword;
