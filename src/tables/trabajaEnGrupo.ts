import { pgTable, integer, primaryKey } from 'drizzle-orm/pg-core';
import { usuarios } from './usuarios';
import { grupoDeTrabajo } from './grupoDeTrabajo';

export const trabajaEnGrupo = pgTable(
  'TrabajaEnGrupo',
  {
    tecnicoId: integer('tecnicoId')
      .references(() => usuarios.Id, { onDelete: 'cascade' })
      .notNull(),
    grupoDeTrabajoId: integer('grupoDeTrabajoId')
      .references(() => grupoDeTrabajo.id, { onDelete: 'cascade' })
      .notNull(),
  },
  table => {
    return {
      pk: primaryKey({ columns: [table.tecnicoId, table.grupoDeTrabajoId] }),
    };
  }
);
