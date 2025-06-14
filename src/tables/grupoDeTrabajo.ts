import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core';
import { usuarios } from './usuarios';
export const grupoDeTrabajo = pgTable('GrupoDeTrabajo', {
  id: serial('id').primaryKey(),
  codigo: varchar('codigo', { length: 10 }).notNull(),
  nombre: varchar('nombre', { length: 40 }).notNull(),
  supervisorId: integer('coodinadorId').references(() => usuarios.Id, {
    onDelete: 'set null',
  }),
});

