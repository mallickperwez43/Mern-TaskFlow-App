import React from 'react'
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import BentoCard from '@/components/BentoCard';
import { RetroGrid } from '@/components/ui/retro-grid'
import { ArrowRight, CheckCircle2, Clock, Layout, ShieldCheck, Zap, Sparkles } from 'lucide-react'

const Landing = () => {
    const { isAuthenticated } = useAuthStore();

    return (
        <div className='flex flex-col items-center'>
            {/* Hero */}
            <section className='relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6 text-center w-full'>

                <RetroGrid className={"max-w-7xl"} />

                <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-primary/10 blur-[120px] -z-10 rounded-full' />
                <div className="relative z-10 flex flex-col items-center max-w-5xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 text-xs font-medium mb-6 animate-in fade-in slide-in-from-bottom-3 duration-1000">
                        <Sparkles size={12} className="text-primary" />
                        <span>New: Experience the Bento Interface</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter mb-6 bg-linear-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
                        Organize your chaos into <span className="text-primary">Clarity.</span>
                    </h1>

                    <p className='text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed'>
                        TaskFlow is a modern, high-performance todo app built for speed.
                        Manage projects, track time, and hit your goals with a premium Bento-style dashboard.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {isAuthenticated ? (
                            /* If logged in, show Dashboard link */
                            <Link to="/dashboard" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto rounded-2xl h-12 px-8 text-md font-bold shadow-xl shadow-primary/20 gap-2">
                                    Go to Dashboard <Layout size={18} />
                                </Button>
                            </Link>
                        ) : (
                            /* If NOT logged in, show Signup/Login */
                            <>
                                <Link to="/signup" className="w-full sm:w-auto">
                                    <Button size="lg" className="w-full sm:w-auto rounded-2xl h-12 px-8 text-md font-bold shadow-xl shadow-primary/20 gap-2">
                                        Start Building <ArrowRight size={18} />
                                    </Button>
                                </Link>
                                <Link to="/login" className="w-full sm:w-auto">
                                    <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-2xl h-12 px-8 text-md font-medium">
                                        Live Demo
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Bento Grid */}
            <section className='w-full max-w-7xl px-4 py-12'>
                <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px]'>

                    {/* Dashboard Preview */}
                    <BentoCard
                        className="md:col-span-2 md:row-span-2 bg-linear-to-br from-card to-secondary/20 border-primary/10 p-0 overflow-hidden"
                        delay={0.1}
                    >
                        <div className='flex flex-col sm:flex-row h-full w-full'>

                            {/* The Dashboard Mockup */}
                            <div className="flex-1 flex flex-col min-h-0">
                                {/* Header */}
                                <div className="p-3 sm:p-4 border-b border-border/50 bg-background/50 flex items-center justify-between">
                                    <div className="flex gap-1 sm:gap-1.5">
                                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-destructive/20" />
                                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500/20" />
                                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary/20" />
                                    </div>
                                    <div className="h-3 sm:h-4 w-16 sm:w-24 bg-muted rounded-full" />
                                </div>

                                <div className="flex flex-1 min-h-0 relative">
                                    {/* Sidebar */}
                                    <div className="hidden sm:flex w-12 md:w-16 border-r border-border/50 p-2 flex-col gap-3 items-center pt-4 bg-muted/10">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-primary/10" />
                                        ))}
                                    </div>

                                    {/* Task List */}
                                    <div className="flex-1 p-4 sm:p-6 flex flex-col gap-3">
                                        <div className="space-y-1.5 mb-2">
                                            <h3 className="text-base sm:text-lg font-bold">Project Delta</h3>
                                            <div className="h-1.5 w-full bg-muted rounded-full">
                                                <div className="h-full w-2/3 bg-primary rounded-full" />
                                            </div>
                                        </div>
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-background border border-border/50 animate-pulse">
                                                <div className="w-4 h-4 rounded border border-primary/50" />
                                                <div className="h-2 flex-1 bg-muted rounded-full" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/*  The Label */}
                            <div className="relative sm:absolute sm:bottom-4 sm:left-4 sm:right-4 p-4 bg-background/90 backdrop-blur-md border-t sm:border border-border shadow-2xl z-10 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <Layout size={18} className="text-primary shrink-0" />
                                    <div className="min-w-0">
                                        <h4 className="text-xs sm:text-sm font-bold truncate">Bento Architecture</h4>
                                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Adapts to any screen.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Performance Box  */}
                    <BentoCard className="flex flex-col justify-center gap-2" delay={0.2}>
                        <Zap className="text-yellow-500" size={24} />
                        <h4 className="font-bold text-2xl">Instant Sync</h4>
                        <p className="text-sm text-muted-foreground">React 19 + Vite 7 ensures sub-millisecond updates.</p>
                    </BentoCard>

                    {/* Time Tracking */}
                    <BentoCard className="flex flex-col justify-center gap-2" delay={0.3} >
                        <Clock className="text-blue-500" size={24} />
                        <h4 className="font-bold text-2xl">Timeline</h4>
                        <p className="text-sm text-muted-foreground">Visualize your tasks across the day automatically.</p>
                    </BentoCard>

                    {/* Security Feature  */}
                    <BentoCard className="md:col-span-2 flex items-center gap-6" delay={0.4}>
                        <div className="p-4 bg-primary/10 rounded-2xl">
                            <ShieldCheck className="text-primary" size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Enterprise Security</h4>
                            <p className="text-sm text-muted-foreground">JWT via HttpOnly cookies. Your data never leaves your sight.</p>
                        </div>
                    </BentoCard>

                    {/* Stats */}
                    <BentoCard className="lg:col-span-1 flex flex-col items-center justify-center text-center gap-1" delay={0.5}>
                        <span className="text-4xl font-black text-primary">99%</span>
                        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Completion Rate</span>
                    </BentoCard>

                    {/* Checkbox Ainmation  */}
                    <BentoCard className="lg:col-span-1 bg-primary text-primary-foreground border-none" delay={0.6}>
                        <div className="flex flex-col justify-between h-full">
                            <CheckCircle2 size={24} />
                            <p className="font-bold text-lg leading-tight">Satisfyingly simple task management.</p>
                        </div>
                    </BentoCard>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative w-full py-24 px-6 mt-12 overflow-hidden border-t border-border/40">
                {/* Subtle background glow for the CTA area */}
                <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-64 bg-primary/5 blur-[100px] -z-10 rounded-full max-w-7xl' />

                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                        Ready to transform your <span className="italic text-primary">productivity?</span>
                    </h2>
                    <p className="text-muted-foreground mb-10 text-lg max-w-xl mx-auto">
                        Join thousands of users organizing their daily chaos into
                        streamlined workflows with TaskFlow.
                    </p>
                    <Link to="/signup">
                        <Button size="xl" className="rounded-2xl h-14 px-10 text-lg font-bold shadow-2xl shadow-primary/20 gap-2 group">
                            Get Started for Free
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Main Footer */}
            <footer className="w-full border-t border-border/40 bg-background/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        {/* Brand Column */}
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                                    <span className="font-black text-primary-foreground text-sm">TF</span>
                                </div>
                                <span className="text-xl font-bold tracking-tight">TaskFlow</span>
                            </div>
                            <p className="text-muted-foreground max-w-xs leading-relaxed">
                                The modern standard for high-performance task management.
                                Built with the Bento architecture for the next generation of creators.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-bold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="hover:text-primary transition-colors cursor-pointer">Features</li>
                                <li className="hover:text-primary transition-colors cursor-pointer">Bento Grid</li>
                                <li className="hover:text-primary transition-colors cursor-pointer">Security</li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="hover:text-primary transition-colors cursor-pointer">About Us</li>
                                <li className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</li>
                                <li className="hover:text-primary transition-colors cursor-pointer">Terms of Service</li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} TaskFlow Ltd. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground italic">
                                <span>Designed for productivity</span>
                                <Zap size={14} className="text-yellow-500 fill-yellow-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div >
    )
}

export default Landing