import { db } from '../../db';
import { usuarios } from '../../tables/usuarios';
import { CreateTecnicoParams } from '../../types/types';

export const createTecnico = async ({
  Nombre,
  Correo,
}: CreateTecnicoParams) => {
  try {
    // Validate input
    if (!Nombre || !Correo) {
      throw new Error('Nombre y Correo son campos obligatorios');
    }

    // Insert into usuarios table
    const insertedUser = await db
      .insert(usuarios)
      .values({
        Nombre,
        Correo,
        Tipo: 'TECNICO',
      })
      .returning({ Id: usuarios.Id });

    if (insertedUser.length === 0) {
      throw new Error('Error al crear el usuario');
    }

    return {
      message: 'Usuario creado correctamente',
      userId: insertedUser[0].Id,
    };
  } catch (error) {
    console.error('Error creating tecnico:', error);
    throw new Error('Error al crear el tecnico');
  }
};
