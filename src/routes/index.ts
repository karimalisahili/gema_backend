import { Router } from "express";
import userRoutes from "../controllers/user/user.routes";

const router = Router();

router.use("/users", userRoutes);
// router.use("/other", otherRoutes);

export default router;
