import { Request, Response, NextFunction } from 'express';
import { login, AuthError } from './auth.service';

export const loginHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await login(req.body);
    res.status(201).json({
      data: user,
    });
    return;
  } catch (error: any) {
    if (error instanceof AuthError) {
      res.status(401).json({
        error: 'Correo o contraseña incorrectos',
      });
      return;
    }
    console.error('Error in loginHandler:', error);
    res.status(500).json({
      error: 'Error al autenticar coordinador',
    });
  }
};
