"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trabajaEnGrupo = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const usuarios_1 = require("./usuarios");
const grupoDeTrabajo_1 = require("./grupoDeTrabajo");
exports.trabajaEnGrupo = (0, pg_core_1.pgTable)('TrabajaEnGrupo', {
    tecnicoId: (0, pg_core_1.integer)('tecnicoId')
        .references(() => usuarios_1.usuarios.Id, { onDelete: 'cascade' })
        .notNull(),
    grupoDeTrabajoId: (0, pg_core_1.integer)('grupoDeTrabajoId')
        .references(() => grupoDeTrabajo_1.grupoDeTrabajo.id, { onDelete: 'cascade' })
        .notNull(),
}, table => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.tecnicoId, table.grupoDeTrabajoId] }),
    };
});
