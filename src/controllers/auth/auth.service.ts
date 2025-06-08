import { db } from '../../db';
import { usuarios } from '../../tables/usuarios';
import { authParams } from '../../types/types';
import { comparePassword, hashPassword } from '../../utils/password';
import { eq } from 'drizzle-orm';
import { coordinadores } from '../../tables/coordinadores';
import jwt from 'jsonwebtoken';

export const login = async ({ Correo, Contraseña }: authParams) => {
  try {
    // Validate input
    if (!Correo || !Contraseña) {
      throw new Error('Correo y Contraseña son campos obligatorios');
    }

    // Buscar usuario y coordinador relacionados
    const result = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.Correo, Correo))
      .rightJoin(coordinadores, eq(coordinadores.IdCoordinador, usuarios.Id));

    if (result.length === 0) {
      throw new Error('El usuario no existe');
    }

    const { Usuarios, Coordinadores } = result[0];

    if (!Coordinadores?.Contraseña) {
      throw new Error('El usuario no tiene contraseña asignada');
    }

    const isPasswordValid = await comparePassword(
      Contraseña,
      Coordinadores.Contraseña
    );

    console.log('Contraseña válida:', isPasswordValid);

    if (!isPasswordValid) {
      throw new Error('Contraseña incorrecta');
    }

    // Fusionar los campos de usuario y coordinador en un solo objeto
    const coordinadorCompleto = {
      ...Usuarios,
      ...Coordinadores,
    };

    // Genera el token
    const token = jwt.sign(
      { userId: Coordinadores.IdCoordinador, tipo: Usuarios?.Tipo },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
    return { token, coordinador: coordinadorCompleto };
  } catch (error) {
    console.error('Error autenticando coordinador:', error);
    throw new Error('Error al autenticar coordinador');
  }
};
