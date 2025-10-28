import express from "express";
import {
  listMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItem,
} from "../controllers/menuController.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

router.get("/", listMenuItems);
router.get("/:id", getMenuItem);
router.post(
  "/",
  validateRequest({
    name: "required",
    price: (v) => typeof v === "number" && v > 0,
    category: "optional",
    stock: (v) => v === undefined || Number.isInteger(v),
  }),
  createMenuItem
);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router;
