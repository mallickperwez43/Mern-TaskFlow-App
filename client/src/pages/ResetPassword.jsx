import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import BentoCard from '@/components/BentoCard';
import { Button } from '@/components/ui/button';
import { Lock, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const password = watch('password');

    const strength = useMemo(() => {
        let score = 0;
        if (!password)
            return 0;

        if (password.length > 7) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    }, [password]);

    const strengthConfig = [
        { label: "Very Weak", color: "bg-destructive" },
        { label: "Weak", color: "bg-orange-500" },
        { label: "Medium", color: "bg-yellow-500" },
        { label: "Strong", color: "bg-emerald-400" },
        { label: "Very Strong", color: "bg-emerald-600" },
    ];

    const labelClass = "text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1";
    const lockClass = "absolute left-3 top-3 h-4 w-4 text-muted-foreground";
    const inputClass = "w-full pl-10 p-2.5 rounded-xl bg-secondary/30 border border-border outline-none focus:border-primary transition-all text-sm";
    const eyeClass = "absolute right-3 top-2.5 h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors";

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await api.post(`/user/reset-password/${token}`, { password: data.password, confirmPassword: data.password });
            setStatus({ type: 'success', message: 'Password reset successful! Redirecting...' });
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || "Token invalid or expired" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='max-w-md mx-auto p-6 pt-20 space-y-8'>
            <div className='space-y-2 text-center'>
                <h1 className='text-3xl font-black tracking-tight'>Reset Password</h1>
                <p className="text-muted-foreground text-sm">Choose a strong new password for your account.</p>
            </div>

            <BentoCard className={'p-8 shadow-xl border-border/50'}>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                    <div className='space-y-2'>
                        <label className={labelClass}>New Password</label>
                        <div className='relative'>
                            <Lock className={lockClass} />
                            <input
                                type={showPass ? "text" : "password"}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 8, message: "Minimum 8 characters" }
                                })}
                                className={inputClass}
                            />
                            <div onClick={() => setShowPass(!showPass)}>
                                {showPass ? <EyeOff className={eyeClass} /> : <Eye className={eyeClass} />}
                            </div>
                        </div>

                        {password && (
                            <div className="space-y-1 mt-2">
                                <div className="flex gap-1 h-1">
                                    {[...Array(4)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-full flex-1 rounded-full transition-all duration-500 ${i < strength ? strengthConfig[strength].color : 'bg-secondary'}`}
                                        />
                                    ))}
                                </div>
                                <p className={`text-[9px] font-bold uppercase text-right ${strengthConfig[strength].color.replace('bg-', 'text-')}`}>
                                    {strengthConfig[strength].label}
                                </p>
                            </div>
                        )}

                        {errors.password && <p className="text-destructive text-xs ml-1">{errors.password.message}</p>}
                    </div>

                    <div className='space-y-2'>
                        <label className={labelClass}>Confirm Password</label>
                        <div className='relative'>
                            <Lock className={lockClass} />
                            <input
                                type={showConfirm ? "text" : "password"}
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: value => value === password || "Passwords do not match"
                                })}
                                className={inputClass}
                            />
                            <div onClick={() => setShowConfirm(!showConfirm)}>
                                {showConfirm ? <EyeOff className={eyeClass} /> : <Eye className={eyeClass} />}
                            </div>
                        </div>
                        {errors.confirmPassword && <p className="text-destructive text-xs ml-1">{errors.confirmPassword.message}</p>}
                    </div>

                    {status.message && (
                        <div className={`p-3 rounded-xl flex items-center gap-3 text-xs font-bold uppercase ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'
                            }`}>
                            {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                            {status.message}
                        </div>
                    )}

                    <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl font-bold shadow-lg shadow-primary/20">
                        {loading ? <Loader2 className="animate-spin" size={18} /> : "Update Password"}
                    </Button>
                </form>
            </BentoCard>
        </div>
    )
}

export default ResetPassword
