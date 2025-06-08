import { db } from "../../db";
import { usuarios } from "../../tables/usuarios";
import { tecnicos } from "../../tables/tecnicos";
import { CreateTecnicoParams} from "../../types/types";

export const createTecnico = async ({
  Nombre,
  Correo,
}: CreateTecnicoParams) => {
  try {
    // Validate input
    if (!Nombre || !Correo) {
      throw new Error("Nombre y Correo son campos obligatorios");
    }

    // Insert into usuarios table
    const insertedUser = await db
      .insert(usuarios)
      .values({
        Nombre,
        Correo,
        Tipo: "TECNICO", // Correct: Tipo is the key, "TECNICO" is the value
      })
      .returning({ Id: usuarios.Id });

    if (insertedUser.length === 0) {
      throw new Error("Error al crear el usuario");
    }

    // Insert into tecnicos table
    const insertedTecnico = await db.insert(tecnicos).values({
      IdTecnico: insertedUser[0].Id,
    });

    return {
      message: "Usuario creado correctamente",
      userId: insertedUser[0].Id,
    };
  } catch (error) {
    console.error("Error creating tecnico:", error);
    throw new Error("Error al crear el tecnico");
  }
};
