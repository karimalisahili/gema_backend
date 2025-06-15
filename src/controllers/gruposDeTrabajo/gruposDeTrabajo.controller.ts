import { Request, Response } from 'express';
import { createGrupoDeTrabajo } from './gruposDeTrabajo.service';

export const createGrupoDeTrabajoHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const grupoDeTrabajo = await createGrupoDeTrabajo(req.body);
    res.status(201).json({
      data: grupoDeTrabajo,
    });

    return;
  } catch (error) {
    console.error('Error in createGrupoDeTrabajoHandler: ', error);
    res.status(500).json({
      error: 'Error al crear el grupo de trabajo',
    });
    return;
  }
};
