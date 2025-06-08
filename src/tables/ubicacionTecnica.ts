import {
  pgTable,
  serial,
  varchar,
  integer,
  foreignKey,
} from 'drizzle-orm/pg-core';

export const ubicacionTecnica = pgTable(
  'UbicacionTecnica',
  {
    id: serial('id').primaryKey(),
    descripcion: varchar('descripcion', { length: 50 }),
    abreviacion: varchar('abreviacion', { length: 5 }),
    codigoIdentificacion: varchar('codigo_identificacion', { length: 100 }),
    nivel: integer('nivel'),
    siguienteId: integer('siguiente_id'),
  },
  table => {
    return {
      incluyeReference: foreignKey({
        columns: [table.siguienteId],
        foreignColumns: [table.id],
        name: 'ubicaciontecnica_siguiente_id_fkey',
      }),
    };
  }
);
