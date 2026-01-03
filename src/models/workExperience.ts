import mongoose, { Schema } from "mongoose";

const workExperienceSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  companyName: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  isCurrentJob: {
    type: Boolean,
    default: false
  },
  description: String,
  location: String,
  achievements: String
}, {
  timestamps: true,
  versionKey: '__v'
});

// Indexes
workExperienceSchema.index({ employeeId: 1 });

export const WorkExperience = mongoose.models.WorkExperience || mongoose.model("WorkExperience", workExperienceSchema);

