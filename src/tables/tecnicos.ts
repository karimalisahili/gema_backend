import {
  pgTable,
  integer,
  varchar,
  serial,
  pgEnum,
  foreignKey,
} from "drizzle-orm/pg-core";
import { usuarios } from "./usuarios";

export const tecnicos = pgTable(
  "Tecnicos",
  {
    IdTecnico: integer("IdTecnico").primaryKey(),
    Contraseña: varchar("Contraseña", { length: 255 }),
  },
  (tecnicos) => ({
    fk_usuario: foreignKey({
      columns: [tecnicos.IdTecnico],
      foreignColumns: [usuarios.Id],
      name: "tecnicos_id_fkey",
    }),
  })
);
