import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import api from '@/api/axios';
import BentoCard from '@/components/BentoCard';
import { Button } from '@/components/ui/button';
import { Mail, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        setStatus({ type: '', message: '' });
        try {
            const response = await api.post('/user/forgot-password', data);
            setStatus({ type: 'success', message: response.data.message });
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Something went wrong'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='max-w-md mx-auto p-6 pt-20 space-y-8'>
            <div className='space-y-2 text-center'>
                <h1 className='text-3xl font-black tracking-tight'>Forgot Password?</h1>
                <p className="text-muted-foreground text-sm">Enter your email and we'll send you a reset link.</p>
            </div>

            <BentoCard className={'p-8 shadow-xl border-border/50'}>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='space-y-2'>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <input
                                {...register("email", { required: "Email is required" })}
                                placeholder="name@example.com"
                                className="w-full pl-10 p-2.5 rounded-xl bg-secondary/30 border border-border outline-none focus:border-primary transition-all text-sm"
                            />
                        </div>
                        {errors.email && <p className="text-destructive text-xs ml-1">{errors.email.message}</p>}
                    </div>

                    {status.message && (
                        <div className={`p-3 rounded-xl flex items-center gap-3 text-xs font-bold uppercase ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'
                            }`}>
                            {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                            {status.message}
                        </div>
                    )}

                    <Button type='submit' disabled={loading} className={"w-full h-11 rounded-xl font-bold shadow-lg shadow-primary/20"}>
                        {loading ? <Loader2 className="animate-spin" size={18} /> : "Send Reset Link"}
                    </Button>

                    <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft size={14} /> Back to Login
                    </Link>
                </form>
            </BentoCard>
        </div>
    )
}

export default ForgotPassword
