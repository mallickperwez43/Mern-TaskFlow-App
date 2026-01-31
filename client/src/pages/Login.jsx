import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import BentoCard from '@/components/BentoCard';
import { Loader2, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(8, "Password must be 8+ characters"),
    rememberMe: z.boolean().optional()
});

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState("");
    const setAuth = useAuthStore(state => state.setAuth);
    const [searchParams] = useSearchParams();
    const isExpired = searchParams.get('message') === 'session_expired';
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    useEffect(() => {
        if (isExpired) {
            const timer = setTimeout(() => {
                navigate('/login', { replace: true });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isExpired, navigate]);

    const onSubmit = async (data) => {
        try {
            setApiError("");
            const response = await api.post('/user/login', data);
            // Since JWT is in a cookie, we just update the local auth state
            setAuth(response.data.user);
            navigate('/dashboard');
        } catch (error) {
            const message = error.response?.data?.message || "An unexpected error occurred";
            setApiError(message);
            console.error("Login failed", message);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center p-4'>
            <BentoCard className={'w-full max-w-md p-8'} delay={0.1}>
                <h2 className='text-3xl font-black mb-2 text-center'>Welcome Back</h2>
                <p className='text-muted-foreground mb-8 text-sm text-center'>Enter your credentials to continue.</p>

                {isExpired && (
                    <div className='mb-6 flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-xl animate-in fade-in zoom-in duration-300'>
                        <AlertCircle size={18} className='shrink-0' />
                        <p className="text-xs font-bold uppercase tracking-tight">Your session expired. Please log in again.</p>
                    </div>
                )
                }

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div className='space-y-1 relative'>
                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type='email'
                            {...register("email", { required: "Email is required" })}
                            autoComplete="email"
                            placeholder='Email Address'
                            className='w-full pl-10 p-3 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary text-sm text-foreground'
                        />
                        {errors.email && <p className="text-[10px] text-destructive font-bold uppercase">{errors.email.message}</p>}
                    </div>

                    <div className='space-y-1 relative'>
                        <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("password", { required: "Password is required" })}
                            autoComplete="new-password"
                            placeholder='Password'
                            className='w-full pl-10 p-3 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary text-sm text-foreground'
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute right-3 top-3.5 text-muted-foreground hover:text-primary transition-colors'
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        {errors.password && <p className="text-[10px] text-destructive font-bold uppercase">{errors.password.message}</p>}
                    </div>

                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                {...register("rememberMe")}
                                className="rounded border-border bg-secondary/50 text-primary focus:ring-primary"
                            />
                            <span className="text-xs text-muted-foreground font-medium">Remember me</span>
                        </div>

                        <Link
                            to="/forgot-password"
                            className="text-xs text-primary font-bold hover:underline transition-all"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {apiError && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-bold uppercase p-3 rounded-xl animate-in fade-in slide-in-from-top-1">
                            {apiError}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className='w-full h-12 rounded-xl font-bold mt-2'
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Login"}
                    </Button>
                </form>

                <p className="text-center mt-8 text-sm text-muted-foreground font-medium">
                    New here? <Link to="/signup" className="text-primary font-bold hover:underline">Create Account</Link>
                </p>
            </BentoCard >
        </div >
    )
}

export default Login
