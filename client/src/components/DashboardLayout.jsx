import React, { useState, useMemo } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';
import {
    Home, LayoutPanelLeft, TrendingUp, Calendar, Settings,
    LogOut, ChevronLeft, ChevronRight, User
} from 'lucide-react';
import { useTheme } from "@/components/ThemeProvider";
import ModeToggle from '@/components/ModeToggle';

const DashboardLayout = () => {
    const [isSidebarFolded, setIsSidebarFolded] = useState(false);
    const { logout } = useAuthStore();
    const { theme, setTheme } = useTheme();

    // Fetch todos here just to calculate the sidebar streak/stats
    const { data: todos = [] } = useQuery({
        queryKey: ['todos'],
        queryFn: async () => {
            const res = await api.get('/todo/all-todos');
            return res.data.todos || [];
        },
    });

    const streak = useMemo(() => {
        const completedDates = [...new Set(todos
            .filter(t => t.status === 'done')
            .map(t => new Date(t.completedAt || t.updatedAt).toDateString())
        )];
        return completedDates.length;
    }, [todos]);

    const navItems = [
        { icon: <Home size={18} />, label: 'Home', path: '/' },
        { icon: <LayoutPanelLeft size={18} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <TrendingUp size={18} />, label: 'Insights', path: '/insights' },
        { icon: <Calendar size={18} />, label: 'Schedule', path: '/schedule' },
        { icon: <Settings size={18} />, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* SHARED SIDEBAR */}
            <aside className={`${isSidebarFolded ? 'w-20' : 'w-64'} border-r border-border bg-card hidden lg:flex flex-col p-4 gap-8 transition-all duration-300 ease-in-out relative`}>
                <button
                    onClick={() => setIsSidebarFolded(!isSidebarFolded)}
                    className="absolute -right-3 top-10 h-6 w-6 bg-primary rounded-full flex items-center justify-center text-white border-2 border-background z-50 hover:scale-110 transition-transform"
                >
                    {isSidebarFolded ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                <div className={`flex items-center gap-3 px-2 ${isSidebarFolded ? 'justify-center' : ''}`}>
                    <div className="h-9 min-w-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-xl, hover:rotate-6">TF</div>
                    {!isSidebarFolded && (
                        <span className="font-black tracking-tighter text-2xl">
                            Task<span className="text-primary">Flow</span>
                        </span>
                    )}
                </div>

                <nav className="flex-1 space-y-1">
                    {navItems.map((item, idx) => (
                        <NavLink
                            key={idx}
                            to={item.path}
                            className={({ isActive }) => `
                                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all 
                                ${isActive ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}
                                ${isSidebarFolded ? 'justify-center' : ''}
                            `}
                        >
                            {item.icon}
                            {!isSidebarFolded && <span className="text-sm font-medium">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-border space-y-4">
                    {/* Streak Info */}
                    <div className={`flex items-center gap-3 ${isSidebarFolded ? 'justify-center' : 'bg-orange-500/10 p-4 rounded-2xl'}`}>
                        <TrendingUp size={20} className="text-orange-500" />
                        {!isSidebarFolded && (
                            <div>
                                <p className="text-[10px] font-black uppercase text-orange-600 leading-none mb-1">Streak</p>
                                <p className="text-lg font-black text-orange-700">{streak} Days</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <div onClick={() => setTheme(theme === "light" ? "dark" : "light")} className={`flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary cursor-pointer ${isSidebarFolded ? 'justify-center' : ''}`}>
                            <ModeToggle />
                            {!isSidebarFolded && <span className="text-sm font-medium">Appearance</span>}
                        </div>

                        <NavLink to="/profile"
                            className={({ isActive }) => `
                                                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all 
                                                        ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}
                                                        ${isSidebarFolded ? 'justify-center' : ''}
                                                    `}
                        >
                            <User size={18} />
                            {!isSidebarFolded && <span className="text-sm font-medium">Profile Settings</span>}
                        </NavLink>
                        <button onClick={logout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-all ${isSidebarFolded ? 'justify-center' : ''}`}>
                            <LogOut size={18} />
                            {!isSidebarFolded && <span className="text-sm font-medium">Logout</span>}
                        </button>
                    </div>

                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 overflow-y-auto scrollbar-hide pb-20 lg:pb-0">
                <Outlet />
            </main>

            {/* MOBILE BOTTOM NAVIGATION */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around px-2 z-50">
                {navItems.map((item, idx) => (
                    <NavLink
                        key={idx}
                        to={item.path}
                        className={({ isActive }) => `
                flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all
                ${isActive ? 'text-primary' : 'text-muted-foreground'}
            `}
                    >
                        {item.icon}
                        <span className="text-[10px] font-bold uppercase">{item.label}</span>
                    </NavLink>
                ))}
                {/* Profile Link for Mobile */}
                <NavLink
                    to="/profile"
                    className={({ isActive }) => `
            flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all
            ${isActive ? 'text-primary' : 'text-muted-foreground'}
        `}
                >
                    <User size={18} />
                    <span className="text-[10px] font-bold uppercase">Profile</span>
                </NavLink>
            </nav>
        </div>
    );
};

export default DashboardLayout;