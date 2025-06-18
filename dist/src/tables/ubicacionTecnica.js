"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ubicacionTecnica = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.ubicacionTecnica = (0, pg_core_1.pgTable)('UbicacionTecnica', {
    idUbicacion: (0, pg_core_1.serial)('id').primaryKey(),
    descripcion: (0, pg_core_1.varchar)('descripcion', { length: 50 }),
    abreviacion: (0, pg_core_1.varchar)('abreviacion', { length: 5 }),
    codigo_Identificacion: (0, pg_core_1.varchar)('codigo_identificacion', {
        length: 50,
    }).unique(),
    nivel: (0, pg_core_1.integer)('nivel'),
    // padreId removed, now handled by Incluyen table
});
