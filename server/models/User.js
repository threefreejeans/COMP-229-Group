import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" }
}, { timestamps: true });

const surveySchema = new mongoose.Schema({
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
}, { timestamps: true });

const surveyResponseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  surveyId: { type: mongoose.Schema.Types.ObjectId, ref: "Survey" },
  brandsBought: { type: [String], required: true },
  brandFrequencies: { type: Map, of: Number, required: true },
  ageRange: { type: String, enum: ["18-24", "25-34", "35-44", "45-54", "55+"], required: true },
  country: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
const Survey = mongoose.model("Survey", surveySchema);
const SurveyResponse = mongoose.model("SurveyResponse", surveyResponseSchema);

export { User, Survey, SurveyResponse };
export default User;
