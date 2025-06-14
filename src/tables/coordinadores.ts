import {
  pgTable,
  integer,
  varchar,
  serial,
  pgEnum,
  foreignKey,
  text,
} from 'drizzle-orm/pg-core';
import { usuarios } from './usuarios';

export const coordinadores = pgTable(
  'Coordinadores',
  {
    IdCoordinador: integer('IdCoordinador').references(() => usuarios.Id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }).primaryKey(),
    Contraseña: text('Contraseña').notNull(),

  },
);
