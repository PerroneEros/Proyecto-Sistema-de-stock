import { Router } from "express";
import productRoutes from "./productRoutes";
import orderRoutes from "./orderRoutes";
import reportRoutes from "./reportRoutes";

const router = Router();
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/reports", reportRoutes);

export default router;
