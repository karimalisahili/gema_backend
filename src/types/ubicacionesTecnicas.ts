export type CreateUbicacionesTecnicasParams = {
  descripcion: string;
  abreviacion: string;
  padres?: Array<{ idPadre: number; esUbicacionFisica?: boolean }>;

  estaHabilitado?: boolean; // Opcional, por defecto true
};

export type UpdateUbicacionesTecnicasParams =
  Partial<CreateUbicacionesTecnicasParams>;

export type UbicacionNode = {
  idUbicacion: number;
  descripcion: string | null;
  abreviacion: string | null;
  codigo_Identificacion: string | null;
  nivel: number | null;
  estaHabilitado: boolean | null;
  children?: UbicacionNode[];
  esUbicacionFisica?: boolean; // Opcional, indica si la relación con el hijo es física
};
