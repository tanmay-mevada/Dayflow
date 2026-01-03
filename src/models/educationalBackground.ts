import mongoose, { Schema } from "mongoose";

const educationalBackgroundSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  degree: {
    type: String,
    required: true
  },
  fieldOfStudy: String,
  institution: {
    type: String,
    required: true
  },
  startDate: Date,
  endDate: Date,
  grade: String,
  certificateUrl: String,
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  versionKey: '__v'
});

// Indexes
educationalBackgroundSchema.index({ employeeId: 1 });

export const EducationalBackground = mongoose.models.EducationalBackground || mongoose.model("EducationalBackground", educationalBackgroundSchema);

