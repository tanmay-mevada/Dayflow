import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  // Authentication & Basic Info
  email: { 
    type: String, 
    unique: true,
    required: true
  },
  password: { 
    type: String,
    default: "" 
  },
  loginId: {
    type: String,
    unique: true,
    sparse: true // Allows null values but enforces uniqueness when present
  },
  companyName: {
    type: String,
    required: true
  },
  role: { 
    type: String, 
    enum: ["admin", "hr_officer", "employee"], 
    default: "employee" 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  isPasswordChanged: {
    type: Boolean,
    default: false
  },
  otp: String,
  otpExpires: Date,
  resetToken: String,
  resetTokenExpiry: Date,

  // Personal Information
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  employeeId: {
    type: String,
    unique: true,
    required: true
  },
  profilePicture: String,
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ["male", "female", "other"]
  },
  maritalStatus: {
    type: String,
    enum: ["single", "married", "divorced", "widowed"]
  },
  nationality: String,
  phoneNumber: String,
  address: String,

  // Job Information
  designation: String,
  department: String,
  dateOfJoining: Date,
  employmentStatus: {
    type: String,
    enum: ["active", "inactive", "terminated"],
    default: "active"
  },
  managerId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  // Status & Tracking
  status: {
    type: String,
    enum: ["working", "on_leave", "absent"],
    default: "absent"
  },
  lastSeen: { 
    type: Date, 
    default: Date.now 
  },
  pageVisits: [
    {
      path: {
        type: String,
        required: true
      },
      visitedAt: { 
        type: Date, 
        default: Date.now 
      },
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: '__v'
});

// Indexes (email, employeeId, and loginId already have indexes from unique:true)
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ department: 1 });

// Update the updatedAt field before saving
userSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);