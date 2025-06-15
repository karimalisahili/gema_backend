import { Request, Response } from 'express';
import {
  createGrupoDeTrabajo,
  getGrupoDeTrabajoById,
  getGruposDeTrabajo,
} from './gruposDeTrabajo.service';
import { json } from 'stream/consumers';
import {
  updateGrupoDeTrabajo,
  deleteGrupoDeTrabajo,
} from './gruposDeTrabajo.service';
import { error } from 'console';
import { db } from '../../db';

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

export const getGruposDeTrabajoHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const grupos = await getGruposDeTrabajo();
    res.status(200).json({
      data: grupos,
    });
  } catch (error) {
    console.error('Error in getGruposDeTrabajoHandler: ', error);
    res.status(500).json({
      error: 'Error al obtener los grupos de trabajo',
    });
    return;
  }
};

export const getGruposDeTrabajoByIdHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'El ID debe ser un número válido.' });
      return;
    }

    const grupo = await getGrupoDeTrabajoById(id);

    if (grupo == null) {
      res.status(404).json({ message: 'Grupo de trabajo no encontrado.' });
      return;
    }
    res.status(200).json(grupo);
  } catch (error) {
    console.error('Error in getGruposDeTrabajoByIdHandler: ', error);
    res.status(500).json({
      error: 'Error al obtener los grupos de trabajo por id',
    });
    return;
  }
};

export const updateGrupoDeTrabajoHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'El id debe ser un número válido' });
      return;
    }

    const { codigo, nombre, idSupervisor } = req.body;
    if (!codigo && !nombre && !idSupervisor === undefined) {
      res.status(400).json({
        error:
          'Se requiere al menos un campo (codigo, nombre, idSupervisor) para actualizar',
      });
      return;
    }

    const result = await updateGrupoDeTrabajo(id, req.body);

    if (result === null) {
      res.status(400).json({
        error: 'Grupo de trabajo no encontrado',
      });
      return;
    }

    res.status(200).json({
      message: result.message,
      data: result.grupo,
    });
  } catch (error) {
    console.error('Error in updateGrupoDeTrabajoHandler: ', error);
    res.status(500).json({ error: 'Error al actualizar el grupo' });
  }
};

export const deleteGrupoDeTrabajoHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'El id debe ser un número válido' });
      return;
    }

    const result = await deleteGrupoDeTrabajo(id);

    if (result === null) {
      res.status(404).json({ error: 'Grupo de trabajo no encontrado' });
      return;
    }

    res.status(200).json({
      message: result.message,
      data: result.grupo,
    });
  } catch (error) {
    console.error('Error in deleteGrupoDeTrabajoHandler: ', error);
    res.status(500).json({ error: 'Error al eliminar grupo de trabajo' });
  }
};
