import express from "express";
import menuRoutes from "./menuRoutes.js";
import orderRoutes from "./orderRoutes.js";
import tableRoutes from "./tableRoutes.js";
import chefRoutes from "./chefRoutes.js";

const router = express.Router();

router.use("/menu", menuRoutes);
router.use("/orders", orderRoutes);
router.use("/tables", tableRoutes);
router.use("/chefs", chefRoutes);

export default router;
