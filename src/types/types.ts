export type UsuarioTipo = 'TECNICO' | 'COORDINADOR'; // Add other allowed values if needed

export type CreateTecnicoParams = {
  Nombre: string;
  Correo: string;
  Tipo: UsuarioTipo;
};

export type CreateCoordinadorParams = {
  Nombre: string;
  Correo: string;
  Tipo: UsuarioTipo;
  Contraseña: string;
};

export type authParams = {
  Correo: string;
  Contraseña: string;
};
