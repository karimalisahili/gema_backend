import { Router } from "express";
import userRoutes from "../controllers/user/user.routes";

const router = Router();

router.use("/users", userRoutes);

export default router;
