const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  logout,
  refreshAccessToken,
} = require('../controller/RealEstateuser');

const verifyRefreshToken = require('../middileware/refreshTokenVerify');
const accessTokenverify = require('../middileware/acessTokenVerify');
const { signupValidationRules, loginValidationRules, validate } = require('../utils/validationUser');

// 🔐 Public Routes
router.post('/signup', signupValidationRules(), validate, signup);  // Validation middleware added
router.post('/login', loginValidationRules(), validate, login);  // Validation middleware added

// 🔐 Protected Route (Logout) — requires access token
router.post('/logout', accessTokenverify, logout);

// 🔄 Refresh token route — uses refresh token middleware
router.post('/refresh-token', verifyRefreshToken, refreshAccessToken);

module.exports = router;
