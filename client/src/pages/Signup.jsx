import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { Button } from '@/components/ui/button';
import BentoCard from '@/components/BentoCard';
import { Loader2, User, AtSign, Lock, Mail, Eye, EyeOff } from 'lucide-react';

const signupSchema = z.object({
    firstName: z.string().min(3, "First name is required"),
    lastName: z.string().min(3, "Last name is required"),
    username: z.string().min(3, "Username must be 3+ characters"),
    email: z.email("Invalid email format"),
    password: z.string().min(8, "Password must be 8+ characters")
});


const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(signupSchema)
    });

    const onSubmit = async (data) => {
        try {
            await api.post('/user/signup', data);
            navigate('/login');
        } catch (error) {
            console.error("Signup failed", error.response?.data?.message);
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center p-4'>
            <BentoCard className={'w-full max-w-md p-8'} delay={0.1}>
                <h2 className='text-3xl font-black mb-2 text-center'>Create Account</h2>
                <p className='text-muted-foreground mb-8 text-sm text-center'>Join TaskFlow today.</p>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-1 relative'>
                            <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                            <input
                                {...register("firstName")}
                                placeholder='First Name'
                                className='w-full pl-10 p-3 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary text-sm text-foreground'
                            />
                            {errors.firstName && <p className="text-[10px] text-destructive font-bold uppercase">{errors.firstName.message}</p>}
                        </div>

                        <div className="space-y-1 relative">
                            <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                            <input {...register("lastName")}
                                placeholder='Last Name'
                                className='w-full pl-10 p-3 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary text-sm text-foreground'
                            />
                            {errors.lastName && <p className="text-[10px] text-destructive font-bold uppercase">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    <div className='space-y-1 relative'>
                        <AtSign className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                        <input
                            {...register("username", { required: "Select a username for yourself" })}
                            placeholder='Username'
                            className='w-full pl-10 p-3 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary text-sm text-foreground'
                        />
                        {errors.username && <p className="text-[10px] text-destructive font-bold uppercase">{errors.username.message}</p>}
                    </div>

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

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className='w-full h-12 rounded-xl font-bold mt-2'
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Sign Up"}
                    </Button>
                </form>

                <p className="text-center mt-6 text-sm text-muted-foreground">
                    Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Login</Link>
                </p>
            </BentoCard>
        </div>
    )
}

export default Signup
