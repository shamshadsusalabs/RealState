const Property = require('../schema/Property');
const mongoose = require('mongoose');
// ✅ Create New Property
exports.createProperty = async (req, res) => {
  try {
    const imagePaths = req.files?.map(file => file.path) || [];
    const newProperty = new Property({
      ...req.body,
      images: imagePaths,
    });
    await newProperty.save();

    res.status(201).json({ success: true, property: newProperty });
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};


// 📍 Get Nearby Properties (within 30km)
exports.getNearbyProperties = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
  }

  try {
    const properties = await Property.find({
      geo: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: 30000, // 30km
        },
      },
    });

    res.json({ success: true, properties });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 📄 Get All Properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};

// 🔍 Get Property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};

// ✏️ Update Property
exports.updateProperty = async (req, res) => {
  try {
    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, property: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ❌ Delete Property
exports.deleteProperty = async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};


exports.getPropertiesBySeller = async (req, res) => {
  try {
      const { sellerId } = req.params; // Assuming sellerId is passed as a URL parameter
      
      // Find all properties where sellerId matches
      const properties = await Property.find({ sellerId });
      
      if (properties.length === 0) {
          return res.status(404).json({
              success: false,
              message: 'No properties found for this seller',
              data: []
          });
      }
      
      res.status(200).json({
          success: true,
          message: 'Properties fetched successfully',
          data: properties
      });
  } catch (error) {
      console.error('Error fetching properties by seller:', error);
      res.status(500).json({
          success: false,
          message: 'Server error while fetching properties',
          error: error.message
      });
  }
};
