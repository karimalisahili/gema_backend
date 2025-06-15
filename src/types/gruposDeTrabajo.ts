import { integer } from 'drizzle-orm/pg-core';

export type createGrupoDeTrabajoParams = {
  codigo: string;
  nombre: string;
  idSupervisor: number;
};
