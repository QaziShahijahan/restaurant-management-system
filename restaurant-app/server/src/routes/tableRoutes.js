import express from "express";
import { listTables, createTable, updateTable, deleteTable } from "../controllers/tableController.js";

const router = express.Router();

router.get("/", listTables);
router.post("/", createTable);
router.put("/:id", updateTable);
router.delete("/:id", deleteTable);

export default router;
