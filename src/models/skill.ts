import mongoose, { Schema } from "mongoose";

const skillSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  skillName: {
    type: String,
    required: true
  },
  proficiency: {
    type: String,
    enum: ["beginner", "intermediate", "advanced", "expert"]
  },
  category: String
}, {
  timestamps: true,
  versionKey: '__v'
});

// Indexes
skillSchema.index({ employeeId: 1 });
skillSchema.index({ skillName: 1 });

export const Skill = mongoose.models.Skill || mongoose.model("Skill", skillSchema);

