import mongoose, { Schema } from "mongoose";

const salarySchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
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
  salaryType: {
    type: String,
    enum: ["monthly", "yearly"],
    default: "monthly"
  },
  currency: {
    type: String,
    default: "INR"
  },
  bankAccountNumber: String,
  bankName: String,
  ifscCode: String,
  effectiveFrom: {
    type: Date,
    required: true
  },
  effectiveTo: Date,
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true,
  versionKey: '__v'
});

// Indexes
salarySchema.index({ employeeId: 1, isActive: 1 });
salarySchema.index({ effectiveFrom: 1 });

// Calculate net salary before saving
salarySchema.pre('save', function() {
  this.netSalary = this.basicSalary + this.hra + this.allowances - this.deductions;
});

export const Salary = mongoose.models.Salary || mongoose.model("Salary", salarySchema);

