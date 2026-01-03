import mongoose, { Schema } from "mongoose";

const leaveSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  leaveType: {
    type: String,
    enum: ["paid_leave", "sick_leave", "unpaid_leave"],
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    index: true
  },
  endDate: {
    type: Date,
    required: true,
    index: true
  },
  totalDays: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    index: true
  },
  attachment: String,
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  approvedAt: Date,
  rejectionReason: String
}, {
  timestamps: true,
  versionKey: '__v'
});

// Indexes
leaveSchema.index({ employeeId: 1 });
leaveSchema.index({ status: 1 });
leaveSchema.index({ startDate: 1, endDate: 1 });

// Calculate total days before saving
leaveSchema.pre('save', function() {
  if (this.startDate && this.endDate) {
    const diff = this.endDate.getTime() - this.startDate.getTime();
    this.totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
  }
});

export const Leave = mongoose.models.Leave || mongoose.model("Leave", leaveSchema);

