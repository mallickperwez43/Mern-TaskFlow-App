import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/api/axios';
import BentoCard from '@/components/BentoCard';
import { Button } from '@/components/ui/button';
import { User, Mail, AtSign, Loader2, CheckCircle2, Lock, AlertCircle } from 'lucide-react';

const Profile = () => {
    const { user, updateUser } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const labelClassName = "text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1";
    const iconClassName = "absolute left-3 top-3 h-4 w-4 text-muted-foreground";
    const inputClassName = "w-full pl-10 p-2.5 rounded-xl bg-secondary/30 border border-border outline-none focus:border-primary transition-all text-sm";

    const { register, handleSubmit, reset, formState: { isDirty } } = useForm({
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            username: user?.username || '',
            email: user?.email || '',
        }
    });

    const onSubmit = async (data) => {
        setLoading(true);
        setStatus({ type: '', message: '' });
        try {
            const response = await api.put('/user/profile', data);

            updateUser(response.data.user);

            reset({ ...response.data.user, currentPassword: '', newPassword: '' });

            setStatus({ type: 'success', message: 'Profile updated successfully!' });

            setTimeout(() => setStatus({ type: '', message: '' }), 3000);
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Failed to update profile"
            setStatus({ type: 'error', message: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='max-w-2xl mx-auto p-6 space-y-8 animate-in fade-in duration-500'>
            <div className='space-y-2 text-center'>
                <h1 className='text-3xl font-black tracking-tight'>Account Settings</h1>
                <p className="text-muted-foreground text-sm font-medium">Manage your personal information and profile appearance.</p>
            </div>

            <BentoCard className={"p-8 border-border/50 shadow-xl"}>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='space-y-2'>
                            <label className={`${labelClassName}`}>First Name</label>
                            <div className='relative'>
                                <User className={`${iconClassName}`} />
                                <input {...register("firstName")} className={`${inputClassName}`} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className={`${labelClassName}`}>Last Name</label>
                            <div className="relative">
                                <User className={`${iconClassName}`} />
                                <input {...register("lastName")} className={`${inputClassName}`} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`${labelClassName}`}>Username</label>
                        <div className="relative">
                            <AtSign className={`${iconClassName}`} />
                            <input {...register("username")} className={`${inputClassName}`} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`${labelClassName}`}>Email Address</label>
                        <div className="relative">
                            <Mail className={`${iconClassName}`} />
                            <input {...register("email")} readOnly tabIndex="-1" className={`${inputClassName}`} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`${labelClassName}`}>Current Password</label>
                        <div className="relative">
                            <Lock className={`${iconClassName}`} />
                            <input
                                type="password"
                                {...register("currentPassword")}
                                placeholder="Required to change password"
                                className={`${inputClassName}`}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={`${labelClassName}`}>New Password</label>
                        <div className="relative">
                            <Lock className={`${iconClassName}`} />
                            <input
                                type="password"
                                {...register("newPassword")}
                                placeholder="Leave blank to keep current"
                                className={`${inputClassName}`}
                            />
                        </div>
                    </div>


                    {status.message && (
                        <div className={`p-3 rounded-xl flex items-center gap-3 text-xs font-bold uppercase tracking-tight animate-in slide-in-from-top-2 duration-300 ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'
                            }`}>
                            {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                            {status.message}
                        </div>
                    )}

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={loading || !isDirty}
                            className="w-full h-11 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : "Update Profile"}
                        </Button>
                    </div>
                </form>
            </BentoCard>
        </div>
    )
}

export default Profile
