"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incluyen = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const ubicacionTecnica_1 = require("./ubicacionTecnica");
exports.incluyen = (0, pg_core_1.pgTable)('Incluyen', {
    idPadre: (0, pg_core_1.integer)('idPadre')
        .references(() => ubicacionTecnica_1.ubicacionTecnica.idUbicacion, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    })
        .notNull(),
    idHijo: (0, pg_core_1.integer)('idHijo')
        .references(() => ubicacionTecnica_1.ubicacionTecnica.idUbicacion, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
    })
        .notNull(),
    esUbicacionFisica: (0, pg_core_1.boolean)('esUbicacionFisica').notNull().default(true),
}, table => ({
    pk: [table.idPadre, table.idHijo],
}));
