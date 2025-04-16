
const RealEstateUser = require('../schema/RealEstateUser');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwtUtils');
const { hashPassword, comparePassword } = require('../utils/bcryptUtlis');


// Signup
const signup = async (req, res) => {
  try {
    const {fullName, email, password, role, contactNumber } = req.body;

    // Use $or operator to check both conditions in a single query
    const existingUser = await RealEstateUser.findOne({
      $or: [{ email }, { contactNumber }],
    });

    if (existingUser) {
      const errorMessage = existingUser.email === email
        ? 'User already exists with this email'
        : 'Contact number already in use';
      return res.status(400).json({ message: errorMessage });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new RealEstateUser({ fullName,email, password: hashedPassword, role, contactNumber });
    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      _id: newUser._id,
      fullName:newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      contactNumber: newUser.contactNumber,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error signing up' });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Directly query by email and compare the password in the same query
    const user = await RealEstateUser.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Login successful',
      _id: user._id,
      email: user.email,
      role: user.role,
      contactNumber: user.contactNumber,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Logout
const logout = async (req, res) => {
    try {
      const userId = req.user?.userId;
      const refreshToken =
        req.body.refreshToken ||
        req.query.refreshToken ||
        req.headers['x-refresh-token'] ||
        req.cookies.refreshToken;
  
        const user = await RealEstateUser.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Optional refresh token match
      if (refreshToken && user.refreshToken !== refreshToken) {
        return res.status(403).json({ message: 'Refresh token mismatch' });
      }
  
      user.refreshToken = null;
      await user.save();
  
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
  
      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error logging out' });
    }
  };

// Refresh Token
const refreshAccessToken = async (req, res) => {
    try {
      const userId = req.user.userId;
      const refreshToken = req.refreshToken;
  
      const user = await RealEstateUser.findById(userId);
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }
  
      const newAccessToken = generateAccessToken(user._id, user.role);
  
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000,
      });
  
      res.status(200).json({
        message: 'Access token refreshed successfully',
        accessToken: newAccessToken,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error refreshing token' });
    }
  };
  



module.exports = {
  signup,
  login,
  logout,
  refreshAccessToken,
};
