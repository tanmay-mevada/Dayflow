import mongoose, { Schema } from "mongoose";

const leaveBalanceSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    index: true
  },
  paidLeave: {
    type: Number,
    default: 20
  },
  paidLeaveUsed: {
    type: Number,
    default: 0
  },
  sickLeave: {
    type: Number,
    default: 10
  },
  sickLeaveUsed: {
    type: Number,
    default: 0
  },
  unpaidLeave: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: '__v'
});

// Update lastUpdated before saving
leaveBalanceSchema.pre('save', function() {
  this.lastUpdated = new Date();
});

export const LeaveBalance = mongoose.models.LeaveBalance || mongoose.model("LeaveBalance", leaveBalanceSchema);

