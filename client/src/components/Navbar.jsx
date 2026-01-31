import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { LayoutDashboard, LogOut, ChevronDown, Sparkles, User, Home } from 'lucide-react';
import api from '../api/axios.js'
import ModeToggle from './ModeToggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useTheme } from "@/components/ThemeProvider";

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuthStore();
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    const handleLogout = async () => {

        try {
            await api.post("/user/logout");
        } catch (error) {
            console.error("Logout background cleanup failed:", error);
        } finally {
            logout();
            navigate("/")
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-2 sm:p-4">
            <nav className="w-full max-w-7xl h-14 px-3 sm:px-4 flex items-center justify-between rounded-2xl border border-border/40 bg-background/70 backdrop-blur-xl shadow-2xl shadow-primary/5">

                {/* Left Side: Brand with a Glow */}
                <div className="flex items-center gap-4">

                    <div className="flex items-center gap-2.5 group transition-all shrink-0">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/40 transition-all" />
                            <div className="relative w-full h-full bg-linear-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-primary-foreground shadow-md hover:rotate-6">
                                <span className="font-black text-sm">TF</span>
                            </div>
                        </div>
                        {/* Hide text to save space on mobile screens */}
                        <span className="text-lg font-bold tracking-tight hidden sm:block bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Task<span className="text-primary">Flow</span>
                        </span>
                    </div>

                    <Link to="/">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 px-2 md:px-3 rounded-xl gap-2 font-medium hover:bg-secondary/50 flex"
                        >
                            <Home size={16} />
                            <span className="hidden md:inline">Home</span>
                        </Button>
                    </Link>
                </div>

                {/* Right Side: Grouped Actions for toggle, login, signup */}
                <div className="flex items-center gap-2">

                    {/* The Toggle integrated into the action group */}
                    <div
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        className="pr-1 sm:pr-2 border-r border-border/50 mr-1"
                    >
                        <ModeToggle />
                    </div>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-1.5 sm:gap-3">
                            <Link to="/dashboard">
                                <Button variant="secondary" size="sm" className="h-9 rounded-xl px-2 sm:px-3 gap-2 font-medium">
                                    <LayoutDashboard size={16} />
                                    <span className='hidden md:inline'>Dashboard</span>
                                </Button>
                            </Link>

                            {/* User Profile */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex items-center gap-2 pl-1 pr-1 sm:pr-2 py-1 rounded-xl bg-secondary/30 border border-border/20 hover:border-primary/30 transition-all cursor-pointer group outline-none">
                                        <Avatar className="h-7 w-7 ring-2 ring-background">
                                            <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                                                {user?.firstName?.[0]?.toUpperCase() || <User size={12} />}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="hidden sm:flex flex-col">
                                            <span className="text-[11px] font-bold leading-none truncate max-w-15">
                                                {user?.firstName}
                                            </span>
                                            {/* <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">Pro</span> */}
                                        </div>
                                        <ChevronDown size={12} className="hidden xs:block text-muted-foreground group-hover:translate-y-0.5 transition-transform" />
                                    </div>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-bold leading-none">{user?.firstName} {user?.lastName}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                        <Link to="/profile" className="flex items-center gap-2 w-full">
                                            <User size={16} />
                                            <span>Profile Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer md:hidden">
                                        <Link to="/dashboard" className="flex items-center gap-2 w-full">
                                            <LayoutDashboard size={16} />
                                            <span>Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-2"
                                    >
                                        <LogOut size={16} />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5">
                            <Link to="/login">
                                <Button variant="ghost" className="h-9 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-medium">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="h-9 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all gap-2">
                                    <Sparkles size={14} className='hidden sm:block' />
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </header >
    )
}

export default Navbar