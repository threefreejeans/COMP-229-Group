const mongoose = require("mongoose");

const User = mongoose.model("User", new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user","admin"], default: "user" }
}, { timestamps: true }));

const Survey = mongoose.model("Survey", new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  questions: [
    {
      questionId: String,
      text: String,
      type: { type: String, enum: ["text", "checkbox", "radio", "number"] },
      options: [String]
    }
  ]
}, { timestamps: true }));

const SurveyResponse = mongoose.model("SurveyResponse", new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  surveyId: { type: mongoose.Schema.Types.ObjectId, ref: "Survey" },
  brandsBought: { type: [String], required: true },
  brandFrequencies: { type: Map, of: Number, required: true },
  ageRange: { type: String, enum: ["18-24","25-34","35-44","45-54","55+"], required: true },
  country: { type: String, required: true }
}, { timestamps: true }));

module.exports = { User, Survey, SurveyResponse };
