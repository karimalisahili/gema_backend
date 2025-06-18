import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core';

export const ubicacionTecnica = pgTable('UbicacionTecnica', {
  idUbicacion: serial('id').primaryKey(),
  descripcion: varchar('descripcion', { length: 50 }),
  abreviacion: varchar('abreviacion', { length: 5 }),
  codigo_Identificacion: varchar('codigo_identificacion', {
    length: 50,
  }).unique(),
  nivel: integer('nivel'),
  // padreId removed, now handled by Incluyen table
});
