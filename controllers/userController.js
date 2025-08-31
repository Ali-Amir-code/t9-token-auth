import User from '../models/User.js';

export const getDashboard = async (req, res) => {
  // req.user is available from the 'protect' middleware
  res.json({
    message: `Welcome to the dashboard, ${req.user.name}!`,
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
    },
  });
};

export const updateProfile = async (req, res) => {
    // Example of updating a profile
    const user = await User.findById(req.user.id);
    
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        
        const updatedUser = await user.save();
        
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
    } else {
        res.status(404).json({ msg: 'User not found' });
    }
};