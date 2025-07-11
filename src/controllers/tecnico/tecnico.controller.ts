import { Request, Response, NextFunction } from 'express';
import { createTecnico, getAllTecnicos } from './tecnico.service';

export const createTecnicoHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await createTecnico(req.body);
    res.status(201).json({
      data: user,
    });
    return;
  } catch (error) {
    console.error('Error in createTecnicoHandler:', error);
    res.status(500).json({
      error: 'Error al crear el tecnico',
    });
    return; // Ensure all code paths return a value
  }
};

export const getAllTecnicosHandler = async (req: Request, res: Response) => {
  try {
    const usuarios = await getAllTecnicos();
    res.status(201).json({
      data: usuarios,
    });
    return;
  } catch (error) {
    console.error('Error en getAllTecnicosHandler', error);
    return;
  }
};
