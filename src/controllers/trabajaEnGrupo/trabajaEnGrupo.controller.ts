import { Request, Response } from 'express';
import {
  createTrabajaEnGrupo,
  deleteTrabajaEnGrupo,
} from './trabajaEnGrupo.service';
import { trabajaEnGrupo } from '../../tables/trabajaEnGrupo';
import { error } from 'console';

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

export const deleteTrabajaEnGrupoHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const tecnicoId = parseInt(req.params.tecnicoId, 10);
    const grupoDeTrabajoId = parseInt(req.params.grupoDeTrabajoId, 10);

    if (isNaN(tecnicoId) || isNaN(grupoDeTrabajoId)) {
      res.status(400).json({
        error: 'Los IDs de técnico y grupo deben ser números válidos',
      });
    }

    const result = await deleteTrabajaEnGrupo(tecnicoId, grupoDeTrabajoId);

    if (result === null) {
      res
        .status(404)
        .json({ error: 'Asignación de trabajador a un grupo no encontrado' });
      return;
    }

    res.status(200).json({
      message: result.message,
      data: result.trabajaEnGrupo,
    });
  } catch (error) {
    console.error('Error in deleteTrabajaEnGrupoHandler: ', error);
    res.status(500).json({
      error: 'Error al eliminar trabajador de grupo de trabajo',
    });
    return;
  }
};
