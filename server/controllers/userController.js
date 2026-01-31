import UserModel from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { signupSchema, loginSchema, updateProfileSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/userValidator.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const generateTokens = async (user) => {
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: '30d' });

    return { accessToken, refreshToken };
}


const signup = async (req, res) => {
    try {
        // check validation using zod
        const validatedData = signupSchema.safeParse(req.body);
        if (!validatedData.success) {
            return res.status(400).json({
                message: "Incorrect format",
                errors: validatedData.error.issues
            });
        }

        const { firstName, lastName, email, password, username } = validatedData.data;

        // check if user already exists
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // save user to db
        const user = await UserModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            username: username
        });

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(400).json({
            message: "User creation failed"
        });
    }
};

const login = async (req, res) => {
    try {
        // check validation using zod
        const validatedData = loginSchema.safeParse(req.body);
        if (!validatedData.success) {
            return res.status(400).json({
                message: "Incorrect format",
                errors: validatedData.error.issues
            });
        }

        const { email, password, rememberMe } = validatedData.data;

        // check for user
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const passwordMatched = await bcrypt.compare(password, user.password);

        if (passwordMatched) {
            const { accessToken, refreshToken } = await generateTokens(user);

            // save refreshToken to DB
            user.refreshToken = refreshToken;
            await user.save();

            // setting accessToken for 15 mins
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                path: '/',
                maxAge: 15 * 60 * 1000 // 15 mins
            });

            // setting refreshToken for 30 days if remember / 7 days
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                path: '/api/v1/user/refresh',
                maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000
            });

            res.status(200).json({
                message: "Signed in successfully",
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    email: user.email
                }
            });
        }
        else {
            res.status(401).json({
                message: "Invalid email or password"
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token missing" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const user = await UserModel.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            path: '/',
            maxAge: 15 * 60 * 1000
        });

        res.status(200).json({ message: "Token refreshed" });
    } catch (error) {
        res.status(403).json({ message: "Session expired" });
    }
}

const logout = async (req, res) => {
    await UserModel.findByIdAndUpdate(req.userId, { refreshToken: null });

    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/api/v1/user/refresh' });

    res.status(200).json({ message: "Logged out successfully" });
};

const getProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).select('-password -refreshToken');
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

const updateProfile = async (req, res) => {
    try {
        // validate the data
        const validatedData = updateProfileSchema.safeParse(req.body);
        if (!validatedData.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validatedData.error.issues
            });
        }

        const { firstName, lastName, username, currentPassword, newPassword } = validatedData.data;
        const user = await UserModel.findById(req.userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        // password change
        const hasNewPassword = newPassword && newPassword.trim() !== "";

        if (hasNewPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: "Current password is required" });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: "Current password incorrect" });
            }

            user.password = await bcrypt.hash(newPassword, 12);
        }

        // update name and username
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.username = username || user.username;

        await user.save();

        const updatedUser = user.toObject();
        delete updatedUser.password;
        delete updatedUser.refreshToken;

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Server error during update" });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const validatedData = forgotPasswordSchema.safeParse(req.body);
        if (!validatedData.success) {
            return res.status(400).json({
                message: "Invalid email format",
                errors: validatedData.error.issues
            });
        }

        const { email } = validatedData.data;
        const user = await UserModel.findOne({ email });

        // if (!user) {
        //     return res.status(404).json({ message: "User with this email does not exist." });
        // }

        if (user) {
            const resetToken = crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
            await user.save();

            const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;


            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                throw new Error("Missing EMAIL_USER or EMAIL_PASS in environment variables");
            }

            const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    .container { font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; }
                    .logo { font-size: 24px; font-weight: 900; letter-spacing: -1px; margin-bottom: 30px; text-align: center; }
                    .card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                    .button { display: inline-block; background-color: #000000; color: #ffffff !important; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; margin-top: 25px; transition: background 0.2s; }
                    .footer { margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center; line-height: 1.5; }
                    .divider { height: 1px; background: #e5e7eb; margin: 25px 0; }
                </style>
            </head>
            <body style="background-color: #f9fafb; margin: 0;">
                <div class="container">
                    <div class="logo">
                        Task<span style="color: #3b82f6;">Flow</span>       
                    </div>
                    <div class="card">
                        <h2 style="margin-top: 0; font-size: 20px;">Password Reset Request</h2>
                        <p style="font-size: 15px; line-height: 1.6; color: #374151;">
                            We received a request to reset the password for your account. No changes have been made yet.
                        </p>
                        <p style="font-size: 15px; line-height: 1.6; color: #374151;">
                            Click the button below to choose a new password. <strong>This link will expire in 15 minutes.</strong>
                        </p>
                        
                        <div style="text-align: center;">
                            <a href="${resetUrl}" class="button">Reset My Password</a>
                        </div>

                        <div class="divider"></div>
                        
                        <p style="font-size: 13px; color: #6b7280;">
                            If you did not request a password reset, please ignore this email or contact support if you have concerns.
                        </p>
                    </div>
                    <div class="footer">
                        &copy; 2026 TaskFlow Inc. <br>
                        Designed for productivity.
                    </div>
                </div>
            </body>
            </html>
            `;

            await transporter.sendMail({
                from: `"TaskFlow Support" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: 'Action Required: Reset Your Password',
                html: emailHtml,
            });
        }

        return res.status(200).json({ message: "If an account exists with that email, a reset link has been sent." });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Error sending email." });
    }
};

const resetPassword = async (req, res) => {
    try {
        const validatedData = resetPasswordSchema.safeParse(req.body);
        if (!validatedData.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validatedData.error.issues
            });
        }

        const { token } = req.params;
        const { password } = validatedData.data;

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await UserModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token." });
        }

        user.password = await bcrypt.hash(password, 12);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successful!" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
}

export {
    signup,
    login,
    logout,
    refresh,
    getProfile,
    updateProfile,
    forgotPassword,
    resetPassword
};