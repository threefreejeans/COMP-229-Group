import mongoose from "mongoose";

const surveySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Shoe Brand Preference Survey",
    },
    description: {
      type: String,
      default:
        "We are a study group conducting a survey on popular shoe brands.",
    },
    // Brands shown as options in SurveyForm
    brandOptions: {
      type: [String], // e.g. ["Nike", "Adidas", "Puma", "New Balance"]
      default: ["Brand 1", "Brand 2", "Brand 3", "Brand 4"],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length > 0;
        },
        message: "At least one brand option is required.",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// IMPORTANT: reuse existing model if present (prevents OverwriteModelError)
const Survey =
  mongoose.models.Survey || mongoose.model("Survey", surveySchema);

export default Survey;
