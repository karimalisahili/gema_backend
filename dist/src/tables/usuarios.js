"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarios = exports.tipoUsuarioEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.tipoUsuarioEnum = (0, pg_core_1.pgEnum)("Tipo", ["TECNICO", "COORDINADOR"]);
exports.usuarios = (0, pg_core_1.pgTable)("Usuarios", {
    Id: (0, pg_core_1.serial)("Id").primaryKey(),
    Nombre: (0, pg_core_1.varchar)("Nombre", { length: 100 }).notNull(),
    Correo: (0, pg_core_1.varchar)("Correo", { length: 150 }).unique().notNull(),
    Tipo: (0, exports.tipoUsuarioEnum)("Tipo").notNull(),
    Contraseña: (0, pg_core_1.text)('Contraseña'),
});
