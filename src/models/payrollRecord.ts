import mongoose, { Schema } from "mongoose";

const payrollRecordSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  basicSalary: {
    type: Number,
    required: true
  },
  hra: {
    type: Number,
    default: 0
  },
  allowances: {
    type: Number,
    default: 0
  },
  deductions: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "processed", "paid"],
    default: "pending",
    index: true
  },
  processedAt: Date,
  payslipUrl: String
}, {
  timestamps: true,
  versionKey: '__v'
});

// Compound index for unique monthly records per employee
payrollRecordSchema.index({ employeeId: 1, year: 1, month: 1 }, { unique: true });
payrollRecordSchema.index({ status: 1 });

// Calculate net salary before saving
payrollRecordSchema.pre('save', function() {
  this.netSalary = this.basicSalary + this.hra + this.allowances - this.deductions;
});

export const PayrollRecord = mongoose.models.PayrollRecord || mongoose.model("PayrollRecord", payrollRecordSchema);

