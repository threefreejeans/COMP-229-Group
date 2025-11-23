import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import surveyRoutes from "./routes/surveyRoutes.js";
import surveyResponseRoutes from "./routes/surveyResponseRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // parses JSON body
app.use(express.urlencoded({ extended: true })); // parses URL-encoded bodies

// Routes
app.use("/api/auth", authRoutes);              // Authentication (register, login, profile)
app.use("/api/users", userRoutes);             // User CRUD operations
app.use("/api/surveys", surveyRoutes);         // Survey CRUD operations
app.use("/api/responses", surveyResponseRoutes); // Survey response operations

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ 
    message: "Survey API is running!",
    endpoints: {
      auth: "/api/auth (register, login, profile)",
      users: "/api/users (user CRUD)",
      surveys: "/api/surveys (survey CRUD)",
      responses: "/api/responses (submit & view responses)"
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
