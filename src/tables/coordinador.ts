import { serial, pgTable, varchar } from "drizzle-orm/pg-core";
import bcrypt from "bcrypt";

export const coordinador = pgTable("Coordinador", {
    id: serial("id").primaryKey(),
    nombre: varchar("nombre", { length: 50 }),
    correo: varchar("correo", { length: 40 }),
    contrasena: varchar("contrasena", { length: 100 }),
});

// Utilidad para hashear la contraseña antes de guardar en la base de datos
export async function hashContrasena(plainPassword: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
}
