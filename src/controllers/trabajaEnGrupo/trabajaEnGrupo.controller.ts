import { Request, Response } from 'express';
import { createTrabajaEnGrupo } from './trabajaEnGrupo.service';
import { trabajaEnGrupo } from '../../tables/trabajaEnGrupo';

export const createTrabajaEnGrupoHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const trabajaEnGrupo = await createTrabajaEnGrupo(req.body);
    res.status(201).json({
      data: trabajaEnGrupo,
    });

    return;
  } catch (error) {
    console.error('Error in trabajaEnGrupoHandler: ', error);
    res.status(500).json({
      error: 'Error al añadir trabajador a grupo de trabajo',
    });
    return;
  }
};
