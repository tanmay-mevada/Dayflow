import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  email: { 
    type: String, 
    unique: true,
    required: true 
  },
  password: { 
    type: String,
    default: "" 
  },
  role: { 
    type: String, 
    enum: ["admin", "student"], 
    default: "student" 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  otp: String,
  otpExpires: Date,
  resetToken: String,
  resetTokenExpiry: Date,
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
  timestamps: true, // This will automatically handle createdAt and updatedAt
  versionKey: '__v'  // This keeps the __v field
});

// Update the updatedAt field before saving
userSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);