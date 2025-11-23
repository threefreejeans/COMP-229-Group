import { SurveyResponse } from "../models/User.js";

// @desc    Get all survey responses
// @route   GET /api/responses
// @access  Private/Admin
export const getAllResponses = async (req, res) => {
  try {
    const responses = await SurveyResponse.find()
      .populate("userId", "username email")
      .populate("surveyId", "title");
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get responses by survey ID
// @route   GET /api/responses/survey/:surveyId
// @access  Private/Admin
export const getResponsesBySurvey = async (req, res) => {
  try {
    const responses = await SurveyResponse.find({ surveyId: req.params.surveyId })
      .populate("userId", "username email");
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's own responses
// @route   GET /api/responses/my-responses
// @access  Private
export const getMyResponses = async (req, res) => {
  try {
    const responses = await SurveyResponse.find({ userId: req.user._id })
      .populate("surveyId", "title description");
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit a survey response (user answers about shoe brands)
// @route   POST /api/responses
// @access  Private
export const submitResponse = async (req, res) => {
  try {
    const { surveyId, brandsBought, brandFrequencies, ageRange, country } = req.body;

    // Validate required fields
    if (!brandsBought || !brandFrequencies || !ageRange || !country) {
      return res.status(400).json({ 
        message: "Please provide all required fields: brandsBought, brandFrequencies, ageRange, country" 
      });
    }

    // Check if user already submitted response for this survey
    const existingResponse = await SurveyResponse.findOne({
      userId: req.user._id,
      surveyId: surveyId,
    });

    if (existingResponse) {
      return res.status(400).json({ 
        message: "You have already submitted a response for this survey" 
      });
    }

    // Create new response
    const response = await SurveyResponse.create({
      userId: req.user._id,
      surveyId,
      brandsBought,
      brandFrequencies,
      ageRange,
      country,
    });

    const populatedResponse = await SurveyResponse.findById(response._id)
      .populate("userId", "username email")
      .populate("surveyId", "title");

    res.status(201).json(populatedResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a survey response
// @route   PUT /api/responses/:id
// @access  Private
export const updateResponse = async (req, res) => {
  try {
    const response = await SurveyResponse.findById(req.params.id);

    if (!response) {
      return res.status(404).json({ message: "Response not found" });
    }

    // Check if user owns this response
    if (response.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this response" });
    }

    const { brandsBought, brandFrequencies, ageRange, country } = req.body;

    response.brandsBought = brandsBought || response.brandsBought;
    response.brandFrequencies = brandFrequencies || response.brandFrequencies;
    response.ageRange = ageRange || response.ageRange;
    response.country = country || response.country;

    const updatedResponse = await response.save();
    res.json(updatedResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a survey response
// @route   DELETE /api/responses/:id
// @access  Private
export const deleteResponse = async (req, res) => {
  try {
    const response = await SurveyResponse.findById(req.params.id);

    if (!response) {
      return res.status(404).json({ message: "Response not found" });
    }

    // Check if user owns this response or is admin
    if (response.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this response" });
    }

    await response.deleteOne();
    res.json({ message: "Response deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
