import express from "express";
import {
  getAllSurveys,
  getSurveyById,
  createSurvey,
  updateSurvey,
  deleteSurvey,
} from "../controllers/surveyController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (anyone can view surveys)
router.get("/", getAllSurveys);
router.get("/:id", getSurveyById);

// Protected routes (only admins can create/update/delete surveys)
router.post("/", protect, admin, createSurvey);
router.put("/:id", protect, admin, updateSurvey);
router.delete("/:id", protect, admin, deleteSurvey);

export default router;
