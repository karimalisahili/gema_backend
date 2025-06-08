export type UsuarioTipo = "TECNICO" | "COORDINADOR"; // Add other allowed values if needed

export type CreateTecnicoParams = {
  Nombre: string;
  Correo: string;
  Tipo: UsuarioTipo;
};
