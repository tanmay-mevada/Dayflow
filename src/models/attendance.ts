import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ["present", "absent", "half_day", "leave"],
    required: true
  },
  totalHours: {
    type: Number,
    default: 0
  },
  location: String,
  notes: String,
  editedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true,
  versionKey: '__v'
});

// Compound index for fast lookups by employee and date
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });

// Calculate total hours before saving
attendanceSchema.pre('save', function() {
  if (this.checkInTime && this.checkOutTime) {
    const diff = this.checkOutTime.getTime() - this.checkInTime.getTime();
    this.totalHours = Math.round((diff / (1000 * 60 * 60)) * 100) / 100; // Round to 2 decimal places
  }
});

export const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);

