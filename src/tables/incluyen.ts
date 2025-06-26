import { pgTable, integer, boolean } from 'drizzle-orm/pg-core';
import { ubicacionTecnica } from './ubicacionTecnica';

export const incluyen = pgTable(
  'Incluyen',
  {
    idPadre: integer('idPadre')
      .references(() => ubicacionTecnica.idUbicacion, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    idHijo: integer('idHijo')
      .references(() => ubicacionTecnica.idUbicacion, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    esUbicacionFisica: boolean('esUbicacionFisica').notNull().default(true),
    hola: boolean('holas').notNull().default(false), // Campo adicional para pruebas
  },
  table => ({
    pk: [table.idPadre, table.idHijo],
  })
);
