import { db } from './db';
import { usuarios } from './tables/usuarios';
import dotenv from 'dotenv';
import { hashPassword, comparePassword } from './utils/password';

dotenv.config();

const initDB = async () => {
  console.log('Starting database initialization...');

  // Clean usuarios table
  await db.delete(usuarios);

  const plainPassword = '123456';
  const nombre = 'Coordinador Principal';
  const correo = 'coordinador@gema.com';
  const tipo = 'COORDINADOR';

  try {
    const contrasenaHash = await hashPassword(plainPassword);

    // Comprobar que comparePassword funciona correctamente
    const isMatch = await comparePassword(plainPassword, contrasenaHash);

    await db.transaction(async tx => {
      // Insertar usuario (sin contraseña)
      const inserted = await tx
        .insert(usuarios)
        .values({
          Nombre: nombre,
          Correo: correo,
          Tipo: tipo,
          Contraseña: contrasenaHash,
        })
        .returning({ Id: usuarios.Id });

      const usuarioId = inserted[0]?.Id;
      if (!usuarioId) throw new Error('No se pudo obtener el Id del usuario');
    });

    console.log('Usuario coordinador agregado correctamente.');
  } catch (error) {
    console.error('Error al agregar usuario:', error);
  }
};

initDB();
