import {
  pgTable,
  integer,
  varchar,
  serial,
  pgEnum,
  foreignKey,
} from 'drizzle-orm/pg-core';
import { usuarios } from './usuarios';

export const tecnicos = pgTable(
  'Tecnicos',
  {
    IdTecnico: integer('IdTecnico').references(() => usuarios.Id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }).primaryKey(),
  },
);
