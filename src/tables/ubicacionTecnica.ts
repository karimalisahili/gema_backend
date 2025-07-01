import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';

export const ubicacionTecnica = pgTable('UbicacionTecnica', {
  idUbicacion: serial('id').primaryKey(),
  descripcion: varchar('descripcion', { length: 100 }).notNull(),
  abreviacion: varchar('abreviacion', { length: 5 }).notNull(),
  codigo_Identificacion: varchar('codigo_identificacion', {
    length: 50,
  })
    .unique()
    .notNull(),
  nivel: integer('nivel').notNull(),
  estaHabilitado: boolean('esta_habilitado').default(true).notNull(),
  // padreId removed, now handled by Incluyen table
});
