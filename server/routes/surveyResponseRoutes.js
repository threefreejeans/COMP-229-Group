import express from "express";
import {
  getAllResponses,
  getResponsesBySurvey,
  getMyResponses,
  submitResponse,
  updateResponse,
  deleteResponse,
} from "../controllers/surveyResponseController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only - view all responses
router.get("/", protect, admin, getAllResponses);

// Admin only - view responses for a specific survey
router.get("/survey/:surveyId", protect, admin, getResponsesBySurvey);

// User routes - manage their own responses
router.get("/my-responses", protect, getMyResponses);
router.post("/", protect, submitResponse);
router.put("/:id", protect, updateResponse);
router.delete("/:id", protect, deleteResponse);

export default router;
