const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
      index: true, // 🔍 Price range filters
    },
    type: {
      type: String,
      enum: ['apartment', 'house', 'commercial', 'land'],
      required: [true, 'Property type is required'],
      index: true,
    },

    location: {
      address: { type: String, required: true },
      city: { type: String, required: true, index: true },
      state: { type: String, required: true, index: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },

    geo: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
      
        validate: {
          validator: (v) => v.length === 2,
          message: 'Coordinates must be [longitude, latitude]',
        },
      },
    },

    features: {
      bedrooms: { type: Number, required: true, index: true },
      bathrooms: { type: Number, required: true },
      area: { type: Number, required: true },
      parking: { type: Boolean, default: false },
      furnished: { type: Boolean, default: false },
    },

    images: [{ type: String }],

    owner: {
      name: { type: String, required: true },
      contact: { type: String, required: true },
      email: { type: String, required: true },
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RealEstateUser',
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ['available', 'sold', 'rented'],
      default: 'available',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔍 Geospatial index for location
propertySchema.index({ geo: '2dsphere' });

// 🧠 Auto-set geo field before saving
propertySchema.pre('save', function (next) {
  if (
    this.location &&
    typeof this.location.longitude === 'number' &&
    typeof this.location.latitude === 'number'
  ) {
    this.geo = {
      type: 'Point',
      coordinates: [this.location.longitude, this.location.latitude],
    };
  }
  next();
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
