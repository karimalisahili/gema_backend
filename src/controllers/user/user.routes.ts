import { Router } from "express";
import { createTecnicoHandler } from "./user.controller";

const router = Router();

router.post("/", createTecnicoHandler);

export default router;
