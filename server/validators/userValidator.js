import { z } from 'zod';

const signupSchema = z.object({
    firstName: z.string().min(3, "First name is required"),
    lastName: z.string().min(3, "Last name is required"),
    email: z.email("Invalid email format"),
    password: z.string().min(8, "Password must be 8+ characters"),
    username: z.string().min(3, "Username must be 3+ characters")
});

const loginSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(8, "Password must be 8+ characters"),
    rememberMe: z.boolean().optional()
});

const updateProfileSchema = z.object({
    firstName: z.string().min(3, "First name is required").optional(),
    lastName: z.string().min(3, "Last name is required").optional(),
    username: z.string().min(3, "Username must be 3+ characters").optional(),
    email: z.email().optional(),
    currentPassword: z.string().optional().or(z.literal('')),
    newPassword: z.string().min(8, " New Password must be 8+ characters").optional().or(z.literal('')),
}).refine((data) => {
    const isChangingPassword = data.newPassword && data.newPassword.trim() !== "";
    if (isChangingPassword && !data.currentPassword) {
        return false;
    }
    return true;
}, {
    message: "Current password is required to set a new password",
    path: ["currentPassword"]
});

const forgotPasswordSchema = z.object({
    email: z.email("Please provide a valid email"),
});

const resetPasswordSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export { signupSchema, loginSchema, updateProfileSchema, forgotPasswordSchema, resetPasswordSchema }