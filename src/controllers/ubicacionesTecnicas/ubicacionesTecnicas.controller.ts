import { Request, Response } from 'express';
import {
  createUbicacionTecnica,
  updateUbicacionTecnica,
  deleteUbicacionTecnica,
  getUbicacionesTecnicas,
  getUbicacionTecnicaById,
} from './ubicacionesTecnicas.service';

export const createUbicacionTecnicaHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ubicacion = await createUbicacionTecnica(req.body);
    res.status(201).json({
      data: ubicacion,
    });
    return;
  } catch (error) {
    console.error('Error in createUbicacionTecnicaHandler:', error);
    res.status(500).json({
      error: 'Error al crear la ubicación técnica',
    });
    return;
  }
};

export const updateUbicacionTecnicaHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const idUbicacion = Number(req.params.id);
    const ubicacion = await updateUbicacionTecnica(idUbicacion, req.body);
    res.status(200).json({ data: ubicacion });
    return;
  } catch (error) {
    console.error('Error in updateUbicacionTecnicaHandler:', error);
    res.status(500).json({ error: 'Error al actualizar la ubicación técnica' });
    return;
  }
};

export const deleteUbicacionTecnicaHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const idUbicacion = Number(req.params.id);
    const ubicacion = await deleteUbicacionTecnica(idUbicacion);
    res.status(200).json({ data: ubicacion });
    return;
  } catch (error) {
    console.error('Error in deleteUbicacionTecnicaHandler:', error);
    res.status(500).json({ error: 'Error al eliminar la ubicación técnica' });
    return;
  }
};

export const getUbicacionesTecnicasHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ubicaciones = await getUbicacionesTecnicas();
    res.status(200).json({ data: ubicaciones });
    return;
  } catch (error) {
    console.error('Error in getUbicacionesTecnicasHandler:', error);
    res
      .status(500)
      .json({ error: 'Error al obtener las ubicaciones técnicas' });
    return;
  }
};

export const getUbicacionTecnicaByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const idUbicacion = Number(req.params.id);
    const ubicacion = await getUbicacionTecnicaById(idUbicacion);
    res.status(200).json({ data: ubicacion });
    return;
  } catch (error) {
    console.error('Error in getUbicacionTecnicaByIdHandler:', error);
    res.status(404).json({ error: 'Ubicación técnica no encontrada' });
    return;
  }
};
