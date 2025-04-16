const { body, validationResult } = require('express-validator');

// Signup Validation Schema
const signupValidationRules = () => {
  return [
    body('fullName')
    .notEmpty().withMessage('FullName is required.'),
    body('email')
      .isEmail().withMessage('Please provide a valid email address.')
      .notEmpty().withMessage('Email is required.'),
    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
      .notEmpty().withMessage('Password is required.'),
    body('contactNumber')
      .matches(/^[0-9]{10}$/).withMessage('Contact number must be a 10-digit number.')
      .notEmpty().withMessage('Contact number is required.'),
    body('role')
      .isIn(['buyer', 'seller', 'agent', 'admin']).withMessage('Role must be one of the following: buyer, seller, agent, admin.')
      .optional({ checkFalsy: true }).default('buyer'),
  ];
};

// Login Validation Schema
const loginValidationRules = () => {
  return [
    body('email')
      .isEmail().withMessage('Please provide a valid email address.')
      .notEmpty().withMessage('Email is required.'),
    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
      .notEmpty().withMessage('Password is required.'),
  ];
};

// Custom middleware to handle validation result
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  signupValidationRules,
  loginValidationRules,
  validate,
};
