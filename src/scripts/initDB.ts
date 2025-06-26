import { db } from '../db';
import { usuarios } from '../tables/usuarios';
import { ubicacionTecnica } from '../tables/ubicacionTecnica';
import { incluyen } from '../tables/incluyen';
import dotenv from 'dotenv';
import { hashPassword, comparePassword } from '../utils/password';
import { createUbicacionTecnica } from '../controllers/ubicacionesTecnicas/ubicacionesTecnicas.service';
import { CreateUbicacionesTecnicasParams } from '../types/ubicacionesTecnicas';
dotenv.config();

const initDB = async () => {
  console.log('Starting database initialization...');

  // Clean usuarios table
  await db.delete(usuarios);

  const plainPassword = '123456';
  const nombre = 'Coordinador Principal';
  const correo = 'coordinador@ucab.edu.ve';
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
    console.error('Error al crear trigger y función:', error);
    console.error('Error al agregar usuario:', error);
  }
};

initDB();
