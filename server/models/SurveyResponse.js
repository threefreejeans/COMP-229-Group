import mongoose from "mongoose";

const surveyResponseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Survey",
    },
    brandsBought: { type: [String], required: true },
    brandFrequencies: { type: Map, of: Number, required: true },
    ageRange: {
      type: String,
      enum: ["18-24", "25-34", "35-44", "45-54", "55+"],
      required: true,
    },
    country: { type: String, required: true },
  },
  { timestamps: true }
);

const SurveyResponse =
  mongoose.models.SurveyResponse ||
  mongoose.model("SurveyResponse", surveyResponseSchema);

export default SurveyResponse;
