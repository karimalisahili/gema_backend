

import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { tecnico } from "./tecnico";
export const grupoDeTrabajo = pgTable("GrupoDeTrabajo",{
    id: serial("id").primaryKey(),
    codigo: varchar("codigo", {length: 10}),
    nombre: varchar("nombre", {length: 40}),
    supervisorId: integer("coodinadorId")
        .references(() => tecnico.id, { onDelete: "set null"})
})