import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core';

// Forward declaration for self-reference
export type UbicacionTecnicaTable = ReturnType<typeof defineUbicacionTecnica>;

function defineUbicacionTecnica() {
  return pgTable('UbicacionTecnica', {
    idUbicacion: serial('id').primaryKey(),
    descripcion: varchar('descripcion', { length: 50 }),
    abreviacion: varchar('abreviacion', { length: 5 }),
    codigo_Identificacion: varchar('codigo_identificacion', {
      length: 50,
    }).unique(),
    nivel: integer('nivel'),
    padreId: integer('padreId'), // FK added below
  });
}

export const ubicacionTecnica = defineUbicacionTecnica();

// Add FK constraint with cascade using a separate statement
declare module 'drizzle-orm/pg-core' {
  interface TableRelations {
    ubicacionTecnica: {
      padreId: {
        references: 'ubicacionTecnica.idUbicacion';
        onDelete: 'cascade';
        onUpdate: 'cascade';
      };
    };
  }
}
