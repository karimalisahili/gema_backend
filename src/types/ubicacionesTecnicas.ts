export type CreateUbicacionesTecnicasParams = {
  descripcion: string;
  abreviacion: string;
  padres?: Array<{ idPadre: number; esUbicacionFisica?: boolean }>;
};

export type UpdateUbicacionesTecnicasParams =
  Partial<CreateUbicacionesTecnicasParams>;
