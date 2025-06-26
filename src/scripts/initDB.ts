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

  // Clean ubicacionTecnica table
  await db.delete(ubicacionTecnica);

  // Clean incluyen table
  await db.delete(incluyen);

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

    // ...existing code...
    // Insertar M1 y M2
    const mayores: { id: number; abreviacion: string }[] = [];
    for (let i = 1; i <= 2; i++) {
      const mayor = await createUbicacionTecnica({
        descripcion: `Mayor ${i}`,
        abreviacion: `M${i}`,
      } as CreateUbicacionesTecnicasParams);
      mayores.push({ id: mayor.ubicacion.idUbicacion, abreviacion: `M${i}` });
    }

    // M1: P1 y P2 (cada uno con Sala 1 y Sala 2)
    const m1 = mayores[0];
    const p1_m1 = await createUbicacionTecnica({
      descripcion: 'P1',
      abreviacion: 'P1',
      padres: [{ idPadre: m1.id, esUbicacionFisica: true }],
    } as CreateUbicacionesTecnicasParams);
    const p2_m1 = await createUbicacionTecnica({
      descripcion: 'P2',
      abreviacion: 'P2',
      padres: [{ idPadre: m1.id, esUbicacionFisica: true }],
    } as CreateUbicacionesTecnicasParams);

    for (const padre of [p1_m1, p2_m1]) {
      for (let sala = 1; sala <= 2; sala++) {
        await createUbicacionTecnica({
          descripcion: `Sala ${sala}`,
          abreviacion: `S${sala}`,
          padres: [
            { idPadre: padre.ubicacion.idUbicacion, esUbicacionFisica: true },
          ],
        } as CreateUbicacionesTecnicasParams);
      }
    }

    // M2: P1, P2, P3 (sin hijos)
    const m2 = mayores[1];
    for (let p = 1; p <= 3; p++) {
      await createUbicacionTecnica({
        descripcion: `P${p}`,
        abreviacion: `P${p}`,
        padres: [{ idPadre: m2.id, esUbicacionFisica: true }],
      } as CreateUbicacionesTecnicasParams);
    }
    // ...existing code...
  } catch (error) {
    console.error('Error al crear trigger y función:', error);
    console.error('Error al agregar usuario:', error);
  }
};

initDB();
