import mongoose, { Schema } from "mongoose";

const documentSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  documentType: {
    type: String,
    enum: ["resume", "offer_letter", "aadhar", "pan", "nda", "certificate", "other"],
    required: true,
    index: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileSize: Number,
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true,
  versionKey: '__v'
});

// Indexes
documentSchema.index({ employeeId: 1 });
documentSchema.index({ documentType: 1 });

export const Document = mongoose.models.Document || mongoose.model("Document", documentSchema);

