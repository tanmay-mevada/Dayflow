import mongoose, { Schema } from "mongoose";

const emergencyContactSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  relationship: {
    type: String,
    enum: ["spouse", "parent", "sibling", "friend", "other"],
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: String,
  address: String,
  isPrimary: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  versionKey: '__v'
});

// Indexes
emergencyContactSchema.index({ employeeId: 1 });

export const EmergencyContact = mongoose.models.EmergencyContact || mongoose.model("EmergencyContact", emergencyContactSchema);

