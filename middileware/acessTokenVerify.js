const jwt = require('jsonwebtoken');
const User = require('../schema/RealEstateUser'); // Only if you want to match from DB

const accessTokenverify = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.body.accessToken ||
      req.query.accessToken ||
      req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token not provided' });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Optional: Verify user exists in DB (can help if you revoked access)
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    // Optional: You can also verify if user's role matches expected role
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error('Access token verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid or expired access token' });
  }
};

module.exports = accessTokenverify;
