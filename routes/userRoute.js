// routes/userRoutes.js
import { Router } from 'express';
const router = Router();
import { getDashboard, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/dashboard', protect, getDashboard);
router.put('/profile', protect, updateProfile);

export default router;