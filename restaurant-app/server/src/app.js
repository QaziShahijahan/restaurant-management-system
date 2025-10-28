// import express from "express";
// import cors from "cors";
// import morgan from "morgan";

// import routes from "./routes/index.js";
// import { errorHandler } from "./middlewares/errorHandler.js";

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());
// app.use(morgan ? morgan("dev") : (req, res, next) => next());

// // API routes
// app.use("/api", routes);

// // Health check
// app.get("/", (req, res) => res.json({ ok: true }));

// // Error handler
// app.use(errorHandler);

// export default app;





// backend/src/app.js  (or backend/app.js — use the same path you already use)
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// ---------- Config / Diagnostics ----------
const NODE_ENV = process.env.NODE_ENV || "development";
const ALLOWED_ORIGINS_RAW =
  process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGINS_COMBINED || "";
// Allow comma-separated values in ALLOWED_ORIGINS env var (or single value)
const ALLOWED_ORIGINS = ALLOWED_ORIGINS_RAW
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Log useful info on startup (server logs will show this)
console.info("NODE_ENV:", NODE_ENV);
console.info("Allowed origins from env:", ALLOWED_ORIGINS);

// ---------- Middlewares ----------
app.use(express.json());

// HTTP request logger
// If morgan is available it returns middleware; otherwise fallback to noop
try {
  app.use(morgan("dev"));
} catch (err) {
  console.warn("morgan not available, continuing without request logging.");
}

// CORS configuration
// - If ALLOWED_ORIGINS is empty -> allow all origins (useful during dev; tighten in prod)
// - If it's defined -> allow only the listed origins (exact match)
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (e.g., curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    // if no allowed origins configured, allow all (useful for rapid debug)
    if (ALLOWED_ORIGINS.length === 0) {
      return callback(null, true);
    }

    // exact-match check
    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    const msg = `CORS policy: Origin ${origin} is not allowed.`;
    console.warn(msg);
    return callback(new Error(msg), false);
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Serve uploads (if you store images locally during dev)
// Ensure uploads directory is in .gitignore so files aren't committed
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

// ---------- API routes ----------
app.use("/api", routes);

// Basic health-check
app.get("/", (req, res) => res.json({ ok: true }));

// Error handler (must be after routes)
app.use(errorHandler);

export default app;
