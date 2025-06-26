import { db } from '../db';
import { usuarios } from '../tables/usuarios';
import { ubicacionTecnica } from '../tables/ubicacionTecnica';
import { incluyen } from '../tables/incluyen';
import dotenv from 'dotenv';
import { hashPassword, comparePassword } from '../utils/password';

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

    // --- INSERCIÓN DE UBICACIONES TÉCNICAS EN JERARQUÍA ---
    // 2 niveles mayores
    const mayores = await db
      .insert(ubicacionTecnica)
      .values([
        { descripcion: 'Mayor 1', abreviacion: 'M1' },
        { descripcion: 'Mayor 2', abreviacion: 'M2' },
      ])
      .returning({ id: ubicacionTecnica.idUbicacion });

    // 2 menores para cada mayor
    const menores: { id: number; padre: number }[] = [];
    for (const mayor of mayores) {
      const hijos = await db
        .insert(ubicacionTecnica)
        .values([
          {
            descripcion: `Menor 1 de ${mayor.id}`,
            abreviacion: `m1${mayor.id}`,
          },
          {
            descripcion: `Menor 2 de ${mayor.id}`,
            abreviacion: `m2${mayor.id}`,
          },
        ])
        .returning({ id: ubicacionTecnica.idUbicacion });
      // Relacionar con Incluyen
      for (const hijo of hijos) {
        await db.insert(incluyen).values({
          idPadre: mayor.id,
          idHijo: hijo.id,
          esUbicacionFisica: true,
        });
        menores.push({ id: hijo.id, padre: mayor.id });
      }
    }

    // 2 niveles para cada menor (nietos)
    for (const menor of menores) {
      const nietos = await db
        .insert(ubicacionTecnica)
        .values([
          {
            descripcion: `Nieto 1 de ${menor.id}`,
            abreviacion: `n1${menor.id}`,
          },
          {
            descripcion: `Nieto 2 de ${menor.id}`,
            abreviacion: `n2${menor.id}`,
          },
        ])
        .returning({ id: ubicacionTecnica.idUbicacion });
      for (const nieto of nietos) {
        await db.insert(incluyen).values({
          idPadre: menor.id,
          idHijo: nieto.id,
          esUbicacionFisica: true,
        });
      }
    }
  } catch (error) {
    console.error('Error al crear trigger y función:', error);
    console.error('Error al agregar usuario:', error);
  }
};

initDB();
