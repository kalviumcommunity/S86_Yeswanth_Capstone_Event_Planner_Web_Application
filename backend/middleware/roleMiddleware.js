const User = require('../models/User');

module.exports = (roles = []) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }
      next();
    } catch (err) {
      res.status(500).json({ message: 'Authorization error', error: err.message });
    }
  };
};
