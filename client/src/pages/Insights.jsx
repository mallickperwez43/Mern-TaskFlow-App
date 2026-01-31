import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Sector } from 'recharts';
import { Trophy, Zap } from 'lucide-react';
import BentoCard from '@/components/BentoCard';

const Insights = () => {
    const { data: todos = [] } = useQuery({
        queryKey: ['todos'],
        queryFn: async () => {
            const res = await api.get('/todo/all-todos');
            return res.data.todos || [];
        },
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'done': return "var(--primary)";
            case 'in-progress': return "oklch(from var(--primary) l c h / 0.5)";
            case 'todo': return "oklch(from var(--primary) l c h / 0.2)";
            default: return "var(--muted)";
        }
    };

    const chartData = useMemo(() => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return {
                date: d.toLocaleDateString('en-US', { weekday: 'long' }),
                shortDate: d.toLocaleDateString('en-US', { weekday: 'short' }),
                fullDate: d.toDateString(),
                count: 0
            };
        }).reverse();

        todos.forEach(todo => {
            const completionDate = todo.completedAt || todo.updatedAt;
            if (todo.status === 'done' && completionDate) {
                const day = new Date(completionDate).toDateString();
                const dayEntry = last7Days.find(d => d.fullDate === day);
                if (dayEntry) dayEntry.count++;
            }
        });
        return last7Days;
    }, [todos]);

    const pieData = useMemo(() => {
        const counts = { 'todo': 0, 'in-progress': 0, 'done': 0 };
        todos.forEach(todo => {
            if (counts.hasOwnProperty(todo.status)) {
                counts[todo.status]++;
            }
        });
        return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
    }, [todos]);

    // Derived Logic for Efficiency Peak
    const peakInfo = useMemo(() => {
        const maxCount = Math.max(...chartData.map(d => d.count));

        // Handle Empty State
        if (maxCount === 0) return null;

        const peakDays = chartData
            .filter(d => d.count === maxCount)
            .map(d => d.date);

        const formattedDays = new Intl.ListFormat('en-US', {
            style: 'short',
            type: 'conjunction'
        }).format(peakDays);

        return { formattedDays, maxCount };
    }, [chartData]);

    const primaryColor = "var(--primary)";
    const mutedColor = "var(--muted-foreground)";
    const borderColor = "var(--border)";

    return (
        <div className='max-w-6xl mx-auto p-4 md:p-10 space-y-10'>
            <svg style={{ height: 0, width: 0, position: 'absolute' }}>
                <defs>
                    <filter id='glow' x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result='blur' />
                        <feComposite in='SourceGraphic' in2='blur' operator="over" />
                    </filter>
                </defs>
            </svg>

            <header>
                <h1 className="text-3xl font-black tracking-tight text-foreground">
                    Performance <span className="text-primary">Insights</span>
                </h1>
            </header>

            {/* AREA CHART */}
            <BentoCard className="p-8 h-125 w-full">
                <h2 className="text-xl font-black italic uppercase mb-8">Productivity Flow</h2>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="8 8" vertical={false} stroke={borderColor} strokeOpacity={0.5} />
                            <XAxis
                                dataKey="shortDate"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: mutedColor, fontSize: 12, fontWeight: 700 }}
                                dy={15}
                            />
                            <YAxis hide />
                            <Tooltip
                                content={({ active, payload }) => (
                                    active && payload && (
                                        <div className="bg-card border border-border p-3 rounded-xl shadow-2xl backdrop-blur-md">
                                            <p className="text-xs font-black text-primary uppercase">{payload[0].value} Tasks Done</p>
                                        </div>
                                    )
                                )}
                            />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke={primaryColor}
                                strokeWidth={4}
                                fill="url(#colorPrimary)"
                                filter="url(#glow)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </BentoCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PIE CHART */}
                <BentoCard className="p-8 h-100 flex flex-col items-center">
                    <h2 className="w-full text-xl font-black italic uppercase mb-4 text-left">Real Distribution</h2>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                    shape={(props) => {
                                        const { name, ...rest } = props;
                                        return (
                                            <Sector
                                                {...rest}
                                                fill={getStatusColor(name)}
                                                filter={name === 'done' ? "url(#glow)" : ""}
                                            />
                                        );
                                    }}
                                />
                                <Tooltip
                                    content={({ active, payload }) => (
                                        active && payload && (
                                            <div className="bg-card border border-border p-3 rounded-xl shadow-2xl">
                                                <p className="text-xs font-black text-primary uppercase">
                                                    {payload[0].name}: {payload[0].value}
                                                </p>
                                            </div>
                                        )
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex gap-4 mt-2">
                        {['done', 'in-progress', 'todo'].map((label) => (
                            <div key={label} className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full" style={{ background: getStatusColor(label) }} />
                                <span className="text-[10px] font-black text-muted-foreground uppercase">{label}</span>
                            </div>
                        ))}
                    </div>
                </BentoCard>

                {/* EFFICIENCY PEAK */}
                <BentoCard className="p-8 h-100 flex flex-col justify-center items-center text-center border-2 border-primary/20 relative overflow-hidden group">
                    {peakInfo ? (
                        <>
                            <Trophy className="text-primary mb-4 relative z-10" size={48} filter="url(#glow)" />
                            <h2 className="text-2xl font-black italic uppercase relative z-10">Efficiency Peak</h2>
                            <p className="text-muted-foreground text-sm font-medium relative z-10">
                                You were most active on <br />
                                <span className="text-primary text-2xl font-black uppercase tracking-tighter">
                                    {peakInfo.formattedDays}
                                </span>
                            </p>
                            <span className="absolute -bottom-3 -right-2.5 text-8xl font-black opacity-5 italic select-none">PEAK</span>
                        </>
                    ) : (
                        <>
                            <Zap className="text-muted-foreground/30 mb-4 relative z-10" size={48} />
                            <h2 className="text-xl font-black italic uppercase relative z-10 text-muted-foreground">No Data Yet</h2>
                            <p className="text-muted-foreground/60 text-xs font-medium relative z-10 max-w-50">
                                Complete tasks to see your peak productivity days here.
                            </p>
                        </>
                    )}
                </BentoCard>
            </div>
        </div>
    );
};

export default Insights;