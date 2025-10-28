import express from "express";
import cors from "cors";
import morgan from "morgan";

import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan ? morgan("dev") : (req, res, next) => next());

// API routes
app.use("/api", routes);

// Health check
app.get("/", (req, res) => res.json({ ok: true }));

// Error handler
app.use(errorHandler);

export default app;
