import mongoose, { Schema } from "mongoose";

const performanceReviewSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  reviewPeriod: {
    type: String,
    required: true
  },
  reviewDate: {
    type: Date,
    required: true,
    index: true
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  strengths: String,
  areasForImprovement: String,
  goals: String,
  comments: String
}, {
  timestamps: true,
  versionKey: '__v'
});

// Indexes
performanceReviewSchema.index({ employeeId: 1 });
performanceReviewSchema.index({ reviewDate: 1 });

export const PerformanceReview = mongoose.models.PerformanceReview || mongoose.model("PerformanceReview", performanceReviewSchema);

