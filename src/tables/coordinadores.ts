import {
  pgTable,
  integer,
  varchar,
  serial,
  pgEnum,
  foreignKey,
} from "drizzle-orm/pg-core";
import { usuarios } from "./usuarios";

export const coordinadores = pgTable(
  "Coordinadores",
  {
    IdCoordinador: integer("IdCoordinador").primaryKey(),
    Contraseña: varchar("Contraseña", { length: 255 }),
  },
  (coordinadores) => ({
    fk_usuario: foreignKey({
      columns: [coordinadores.IdCoordinador],
      foreignColumns: [usuarios.Id],
      name: "coordinadores_id_fkey",
    }),
  })
);
