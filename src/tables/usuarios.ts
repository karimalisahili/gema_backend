import { pgTable, varchar, serial, pgEnum, text } from "drizzle-orm/pg-core";

export const tipoUsuarioEnum = pgEnum("Tipo", ["TECNICO", "COORDINADOR"]);

export const usuarios = pgTable("Usuarios", {
  Id: serial("Id").primaryKey(),
  Nombre: varchar("Nombre", { length: 100 }).notNull(),
  Correo: varchar("Correo", { length: 150 }).unique().notNull(),
  Tipo: tipoUsuarioEnum("Tipo").notNull(),
  Contraseña: text('Contraseña'),
});
