import { db } from './db';
import { usuarios } from './tables/usuarios';
import { coordinadores } from './tables/coordinadores';
import dotenv from 'dotenv';
import { hashPassword, comparePassword } from './utils/password';
import { tecnicos } from './tables/tecnicos';

dotenv.config();

const initDB = async () => {
  console.log('Starting database initialization...');

  // Clean usuarios table
  await db.delete(coordinadores);
  await db.delete(tecnicos);
  await db.delete(usuarios);

  const plainPassword = process.env.SEED_PASSWORD || '123456';
  const nombre = 'Coordinador Principal';
  const correo = 'coordinador@gema.com';
  const tipo = 'COORDINADOR';

  try {
    const contrasenaHash = await hashPassword(plainPassword);

    // Comprobar que comparePassword funciona correctamente
    const isMatch = await comparePassword(plainPassword, contrasenaHash);
    console.log(
      '¿comparePassword retorna verdadero con la misma clave?:',
      isMatch
    );

    await db.transaction(async tx => {
      // Insertar usuario (sin contraseña)
      const inserted = await tx
        .insert(usuarios)
        .values({
          Nombre: nombre,
          Correo: correo,
          Tipo: tipo,
        })
        .returning({ Id: usuarios.Id });

      const usuarioId = inserted[0]?.Id;
      if (!usuarioId) throw new Error('No se pudo obtener el Id del usuario');

      // Insertar coordinador con contraseña y FK al usuario
      await tx.insert(coordinadores).values({
        IdCoordinador: usuarioId,
        Contraseña: contrasenaHash,
      });
    });

    console.log('Usuario coordinador agregado correctamente.');
  } catch (error) {
    console.error('Error al agregar usuario coordinador:', error);
  }
};

initDB();
