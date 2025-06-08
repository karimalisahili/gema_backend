import { serial, pgTable, varchar } from "drizzle-orm/pg-core";

export const tecnico = pgTable("Tecnico", {
    id: serial("id").primaryKey(),
    nombre: varchar("nombre", { length: 50 }),
    correo: varchar("correo", { length: 40 }),
});
