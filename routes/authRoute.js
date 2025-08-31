// routes/authRoutes.js
import { Router } from 'express';
const router = Router();
import { check } from 'express-validator';
import { registerUser, loginUser, refreshToken, logoutUser } from '../controllers/authController.js';

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  ],
  registerUser
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  loginUser
);

router.post('/refresh-token', refreshToken);

router.post('/logout', logoutUser);

export default router;