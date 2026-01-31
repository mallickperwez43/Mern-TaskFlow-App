import express from 'express';
import { signup, login, logout, refresh, getProfile, updateProfile, forgotPassword, resetPassword } from '../controllers/userController.js'
import { userMiddleware } from '../middleware/authMiddleware.js';
import { globalLimiter, authLimiter } from '../middleware/rateLimiter.js';

const userRouter = express.Router();

userRouter.use(globalLimiter);

userRouter.post('/signup', authLimiter, signup);
userRouter.post('/login', authLimiter, login);
userRouter.post('/forgot-password', authLimiter, forgotPassword);
userRouter.post('/reset-password/:token', authLimiter, resetPassword);

userRouter.post('/refresh', refresh);

userRouter.use(userMiddleware);

userRouter.post('/logout', logout);
userRouter.get('/profile', getProfile);
userRouter.put('/profile', updateProfile);

export default userRouter;