import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { User, Bell, Shield, Moon, LogOut, Save, Camera, Globe, Loader2, Sun } from 'lucide-react';
import BentoCard from '@/components/BentoCard';
import { Button } from '@/components/ui/button';
import { useTheme } from "@/components/ThemeProvider";

const Settings = () => {
    const queryClient = useQueryClient();
    const { theme, setTheme } = useTheme();

    // 1. Local State for Mongoose User Fields
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: ''
    });

    // 2. Fetch User from MongoDB
    const { data: userData, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const res = await api.get('/user/profile');
            return res.data;
        }
    });

    // Sync form with database data
    useEffect(() => {
        if (userData) {
            setFormData({
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                username: userData.username || '',
                email: userData.email || ''
            });
        }
    }, [userData]);

    // 3. Update Profile Mutation
    const updateMutation = useMutation({
        mutationFn: (newData) => api.put(`/user/update`, newData),
        onSuccess: () => {
            queryClient.invalidateQueries(['user']);
            toast.success("Profile updated successfully");
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (isLoading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="animate-spin text-primary" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-10 space-y-8 text-foreground">
            <header>
                <h1 className="text-3xl font-black tracking-tight">System <span className="text-primary">Settings</span></h1>
                <p className="text-muted-foreground font-medium text-sm">Manage your @{formData.username} account info.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">

                {/* 1. Profile Section - Maps to your Mongoose Schema */}
                <BentoCard className="md:col-span-4 p-8 space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-dashed border-primary/30 relative">
                            <User size={32} className="text-primary" />
                            <button className="absolute -bottom-2 -right-2 p-2 bg-background border rounded-xl shadow-sm text-primary">
                                <Camera size={14} />
                            </button>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Personal Information</h3>
                            <p className="text-sm text-muted-foreground">Manage your name and contact details.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">First Name</label>
                            <input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                type="text"
                                className="w-full p-3 rounded-xl bg-secondary/50 border border-border/50 focus:ring-2 ring-primary/20 outline-none transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Last Name</label>
                            <input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                type="text"
                                className="w-full p-3 rounded-xl bg-secondary/50 border border-border/50 focus:ring-2 ring-primary/20 outline-none transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email (Unique)</label>
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                type="email"
                                className="w-full p-3 rounded-xl bg-secondary/50 border border-border/50 focus:ring-2 ring-primary/20 outline-none transition-all text-sm"
                            />
                        </div>
                    </div>
                </BentoCard>

                {/* 2. Appearance Section - Uses your useTheme Hook */}
                <BentoCard className="md:col-span-2 p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        {theme === 'dark' ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-primary" />}
                        <h3 className="font-bold text-sm">Appearance</h3>
                    </div>

                    <label className="flex items-center justify-between cursor-pointer group p-3 hover:bg-secondary/50 rounded-xl transition-all border border-transparent hover:border-border/50">
                        <span className="text-sm font-medium">Dark Mode</span>
                        <input
                            type="checkbox"
                            className="w-10 h-5 appearance-none bg-muted rounded-full relative cursor-pointer transition-all checked:bg-primary before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 before:transition-all checked:before:left-5.5"
                            checked={theme === 'dark'}
                            onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        />
                    </label>
                    <p className="text-[10px] text-muted-foreground leading-tight px-1">
                        Switching to dark mode reduces eye strain in low-light environments.
                    </p>
                </BentoCard>

                {/* 3. Language & Region */}
                <BentoCard className="md:col-span-6 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-secondary rounded-2xl text-primary">
                            <Globe size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Language & Region</p>
                            <p className="text-xs text-muted-foreground">Select your preferred display language.</p>
                        </div>
                    </div>
                    <select className="bg-secondary/50 border-none rounded-xl p-3 text-sm font-medium outline-none min-w-50 cursor-pointer">
                        <option>English (US)</option>
                        <option>Spanish</option>
                    </select>
                </BentoCard>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border/50">
                <button className="flex items-center gap-2 text-red-500 font-bold text-sm hover:bg-red-50 p-3 rounded-xl transition-all">
                    <LogOut size={18} /> Log Out
                </button>
                <div className="flex gap-3">
                    <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setFormData({ ...userData })}>Discard</Button>
                    <Button
                        onClick={() => updateMutation.mutate(formData)}
                        disabled={updateMutation.isPending}
                        className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20 gap-2"
                    >
                        {updateMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Settings;