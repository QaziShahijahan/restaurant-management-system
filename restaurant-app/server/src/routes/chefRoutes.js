import express from "express";
import { listChefs, createChef } from "../controllers/chefController.js";

const router = express.Router();

router.get("/", listChefs);
router.post("/", createChef);

export default router;
