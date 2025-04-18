const express = require('express');
const router = express.Router();
const propertyController = require('../controller/Property');
const { requiredLatLng, requiredCreateFields } = require('../utils/propertyUtils');
const upload = require('../middileware/propertyUplod');
const accessTokenverify = require('../middileware/acessTokenVerify');
const allowedRoles = require('../middileware/roleAuthorization');


router.post(
  '/add',
  upload.array('images', 10),accessTokenverify,  allowedRoles('seller', 'agent', 'admin'),
  requiredCreateFields,
  propertyController.createProperty
);
router.get('/getAll',accessTokenverify, propertyController.getAllProperties);
router.get('/nearby', requiredLatLng, propertyController.getNearbyProperties);
router.get('/getby/:id', propertyController.getPropertyById);
router.put('/update/:id', propertyController.updateProperty);
router.delete('/delete/:id', propertyController.deleteProperty);
router.get('/properties/seller/:sellerId',accessTokenverify,allowedRoles('seller'),propertyController.getPropertiesBySeller);
module.exports = router;
