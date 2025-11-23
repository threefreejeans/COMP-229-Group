import { Survey } from "../models/User.js";

// @desc    Get all surveys
// @route   GET /api/surveys
// @access  Public
export const getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single survey by ID
// @route   GET /api/surveys/:id
// @access  Public
export const getSurveyById = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    
    if (survey) {
      res.json(survey);
    } else {
      res.status(404).json({ message: "Survey not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new survey
// @route   POST /api/surveys
// @access  Private/Admin
export const createSurvey = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    // Validate input
    if (!title) {
      return res.status(400).json({ message: "Survey title is required" });
    }

    const survey = await Survey.create({
      title,
      description,
      questions,
    });

    res.status(201).json(survey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update survey
// @route   PUT /api/surveys/:id
// @access  Private/Admin
export const updateSurvey = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    const survey = await Survey.findById(req.params.id);

    if (survey) {
      survey.title = title || survey.title;
      survey.description = description || survey.description;
      survey.questions = questions || survey.questions;

      const updatedSurvey = await survey.save();
      res.json(updatedSurvey);
    } else {
      res.status(404).json({ message: "Survey not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete survey
// @route   DELETE /api/surveys/:id
// @access  Private/Admin
export const deleteSurvey = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);

    if (survey) {
      await survey.deleteOne();
      res.json({ message: "Survey deleted successfully" });
    } else {
      res.status(404).json({ message: "Survey not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
