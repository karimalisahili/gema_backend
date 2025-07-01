import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean as pgBoolean,
} from 'drizzle-orm/pg-core';

export const ubicacionTecnica = pgTable('UbicacionTecnica', {
  idUbicacion: serial('id').primaryKey(),
  descripcion: varchar('descripcion', { length: 100 }),
  abreviacion: varchar('abreviacion', { length: 5 }),
  codigo_Identificacion: varchar('codigo_identificacion', {
    length: 50,
  }).unique(),
  nivel: integer('nivel'),
  estaHabilitado: pgBoolean('esta_habilitado').default(true),
  // padreId removed, now handled by Incluyen table
});
