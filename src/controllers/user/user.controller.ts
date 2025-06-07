import { Request, Response } from "express";

export const getUsers = async (req: Request, res: Response) => {
  res.json({ message: "Get all users" });
};

export const getUserById = async (req: Request, res: Response) => {
  res.json({ message: `Get user ${req.params.id}` });
};

export const createUser = async (req: Request, res: Response) => {
  res.json({ message: "Create user" });
};

export const updateUser = async (req: Request, res: Response) => {
  res.json({ message: `Update user ${req.params.id}` });
};

export const deleteUser = async (req: Request, res: Response) => {
  res.json({ message: `Delete user ${req.params.id}` });
};
