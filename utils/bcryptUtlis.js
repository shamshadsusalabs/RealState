// utils/bcryptUtils.js
const bcrypt = require('bcryptjs');

// Hash password
const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(plainPassword, saltRounds);
  return hashed;
};

// Compare password
const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
