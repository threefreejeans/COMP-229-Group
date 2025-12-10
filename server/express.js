import express from "express";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import surveyRoutes from "./routes/surveyRoutes.js";              // <-- add this
import surveyResponseRoutes from "./routes/surveyResponseRoutes.js"; // <-- and this

const app = express();

/* ===== Middleware ===== */
app.use(cors()); // allow frontend (adjust origin if you want to lock it down)
app.use(helmet());
app.use(compress());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===== Routes (versioned API) ===== */

// Users
// GET /api/users        -> getAllUsers
// GET /api/users/:id    -> getUserById
// POST /api/users       -> createUser
// ...
app.use("/api/users", userRoutes);

// Auth (example: /api/auth/login, /api/auth/register)
app.use("/api/auth", authRoutes);

// Survey definitions (if you have them)
app.use("/api/surveys", surveyRoutes);

// Survey responses (what your surveyForm.jsx will POST to,
// and what Home.jsx will display in the "Surveys" section)
app.use("/api/survey-responses", surveyResponseRoutes);

/* ===== Error handler ===== */
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.log(err);
  }
});

export default app;
