import { pgTable, integer, varchar, serial, pgEnum } from "drizzle-orm/pg-core";

export const tipoUsuarioEnum = pgEnum("Tipo", ["TECNICO", "COORDINADOR"]);

export const usuarios = pgTable("Usuarios", {
  Id: serial("Id").primaryKey(),
  Nombre: varchar("Nombre", { length: 100 }),
  Correo: varchar("Correo", { length: 150 }).unique(),
  Tipo: tipoUsuarioEnum("Tipo"),
});
