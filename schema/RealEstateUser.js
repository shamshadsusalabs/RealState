const mongoose = require('mongoose');

const RealEstateUserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'agent', 'admin'],
      default: 'buyer',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      default: null,  // Initially null, will be populated later
    },
  },
  {
    timestamps: true,
  }
);



// Pre-save hook to set isVerified to true if the user is a buyer
RealEstateUserSchema.pre('save', function(next) {
  if (this.role === 'buyer') {
    this.isVerified = true;
  }
  next();
});

module.exports = mongoose.model('RealEstateUser', RealEstateUserSchema);
