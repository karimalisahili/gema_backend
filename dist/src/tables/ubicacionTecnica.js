"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ubicacionTecnica = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.ubicacionTecnica = (0, pg_core_1.pgTable)('UbicacionTecnica', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    descripcion: (0, pg_core_1.varchar)('descripcion', { length: 50 }),
    abreviacion: (0, pg_core_1.varchar)('abreviacion', { length: 5 }),
    codigoIdentificacion: (0, pg_core_1.varchar)('codigo_identificacion', { length: 100 }),
    nivel: (0, pg_core_1.integer)('nivel'),
    siguienteId: (0, pg_core_1.integer)('siguiente_id'),
}, table => {
    return {
        incluyeReference: (0, pg_core_1.foreignKey)({
            columns: [table.siguienteId],
            foreignColumns: [table.id],
            name: 'ubicaciontecnica_siguiente_id_fkey',
        }),
    };
});
