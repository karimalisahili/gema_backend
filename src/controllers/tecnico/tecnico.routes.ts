import { Router } from "express";
import { createTecnicoHandler } from "./tecnico.controller";

const router = Router();

router.post("/", createTecnicoHandler);

export default router;
