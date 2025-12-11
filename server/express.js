import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import surveyRoutes from "./routes/surveyRoutes.js";
import surveyResponseRoutes from "./routes/surveyResponseRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(
  cors({
    origin: "*", // ok for now
  })
);

// 👇 IMPORTANT: prefix with /api/...
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api/responses", surveyResponseRoutes);

// Health-check
app.get("/", (req, res) => {
  res.json({
    message: "Survey API is running!",
    endpoints: {
      auth: "/api/auth (register, login, profile)",
      users: "/api/users (user CRUD)",
      surveys: "/api/surveys (survey CRUD)",
      responses: "/api/responses (submit & view responses)",
    },
  });
});

export default app;
