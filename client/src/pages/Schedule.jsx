import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { Plus, HelpCircle, Trash2, Search, Edit2 } from 'lucide-react';
import BentoCard from '@/components/BentoCard';
import { format, isToday, isTomorrow, parseISO, isValid } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useModalStore } from '@/store/useModalStore';
import TodoModal from '@/components/TodoModal';

const Schedule = () => {
    const queryClient = useQueryClient();
    const { isTodoModalOpen, openTodoModal, closeTodoModal } = useModalStore();
    const [editingTask, setEditingTask] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // 1. Fetch Todos
    const { data: todos = [] } = useQuery({
        queryKey: ['todos'],
        queryFn: async () => {
            const res = await api.get('/todo/all-todos');
            return res.data.todos || [];
        },
    });

    // 2. Mutations
    const createMutation = useMutation({
        mutationFn: (newTodo) => api.post('/todo/create-todo', newTodo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            closeTodoModal();
        },
    });

    const updateTaskMutation = useMutation({
        mutationFn: (updatedTodo) => api.put(`/todo/update-todo/${updatedTodo.id}`, updatedTodo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            handleCloseModal();
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, updates }) => api.put(`/todo/update-todo/${id}`, updates),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/todo/delete-todo/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    });

    // 3. Handlers
    const handleEdit = (task) => {
        setEditingTask(task);
        openTodoModal();
    };

    const handleCloseModal = () => {
        setEditingTask(null);
        closeTodoModal();
    };

    // 4. Data Transformation
    const groupedTasks = useMemo(() => {
        const groups = { unscheduled: [] };
        const filteredTodos = todos.filter(t =>
            t.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filteredTodos.forEach(task => {
            if (!task.deadline) {
                groups.unscheduled.push(task);
                return;
            }
            const dateObj = parseISO(task.deadline);
            if (!isValid(dateObj)) {
                groups.unscheduled.push(task);
                return;
            }
            const dateKey = format(dateObj, 'yyyy-MM-dd');
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(task);
        });
        return groups;
    }, [todos, searchTerm]);

    const sortedDates = Object.keys(groupedTasks)
        .filter(key => key !== 'unscheduled')
        .sort();

    const dotColors = {
        high: "bg-red-500",
        medium: "bg-amber-500",
        low: "bg-emerald-500",
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-10 space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Your <span className="text-primary">Schedule</span></h1>
                    <p className="text-muted-foreground font-medium text-sm">Manage your time and priorities.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 h-11 rounded-xl bg-secondary/50 border-none focus:ring-2 ring-primary/20 outline-none text-sm w-40 md:w-60 transition-all"
                        />
                    </div>
                    <Button onClick={() => { setEditingTask(null); openTodoModal(); }} className="rounded-xl shadow-lg gap-2 h-11 px-6 font-bold">
                        <Plus size={18} /> Add
                    </Button>
                </div>
            </header>

            <div className="space-y-10">
                {/* Scheduled Dates */}
                {sortedDates.map((date) => (
                    <div key={date} className="relative pl-8 border-l-2 border-primary/30">
                        <div className="absolute -left-2.25 top-1 h-4 w-4 rounded-full bg-background border-2 border-primary" />
                        <h2 className="text-lg font-bold mb-4">
                            {isToday(parseISO(date)) ? "Today" : isTomorrow(parseISO(date)) ? "Tomorrow" : format(parseISO(date), 'eeee, MMM do')}
                        </h2>
                        <div className="grid gap-3">
                            {groupedTasks[date].map(task => (
                                <ScheduleItem
                                    key={task._id}
                                    task={task}
                                    dotColors={dotColors}
                                    onToggle={(t) => updateStatusMutation.mutate({ id: t._id, updates: { status: t.status === 'done' ? 'todo' : 'done' } })}
                                    onDelete={(e, id) => { e.stopPropagation(); deleteMutation.mutate(id); }}
                                    onEdit={() => handleEdit(task)}
                                />
                            ))}
                        </div>
                    </div>
                ))}

                {/* Unscheduled Section */}
                {groupedTasks.unscheduled.length > 0 && (
                    <div className="relative pl-8 border-l-2 border-dashed border-muted-foreground/30">
                        <div className="absolute -left-2.25 top-1 h-4 w-4 rounded-full bg-background border-2 border-muted-foreground/30" />
                        <h2 className="text-lg font-bold mb-4 text-muted-foreground flex items-center gap-2">
                            <HelpCircle size={18} /> Unscheduled
                        </h2>
                        <div className="grid gap-3">
                            {groupedTasks.unscheduled.map(task => (
                                <ScheduleItem
                                    key={task._id}
                                    task={task}
                                    dotColors={dotColors}
                                    onToggle={(t) => updateStatusMutation.mutate({ id: t._id, updates: { status: t.status === 'done' ? 'todo' : 'done' } })}
                                    onDelete={(e, id) => { e.stopPropagation(); deleteMutation.mutate(id); }}
                                    onEdit={() => handleEdit(task)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                <BentoCard className="p-6 bg-secondary/30 border-none">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Priority Distribution</h3>
                    <div className="flex justify-between items-end gap-2 h-24">
                        {['high', 'medium', 'low'].map((prio) => {
                            const count = todos.filter(t => t.priority === prio && t.status !== 'done').length;
                            return (
                                <div key={prio} className="flex flex-col items-center gap-2 flex-1">
                                    <div
                                        className={`w-full rounded-t-lg transition-all duration-500 ${dotColors[prio]}`}
                                        style={{ height: `${Math.min(count * 15 + 5, 80)}px`, opacity: count > 0 ? 1 : 0.3 }}
                                    />
                                    <span className="text-[10px] font-bold uppercase">{prio}</span>
                                    <span className="text-md font-black">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </BentoCard>

                <BentoCard className="p-6 bg-primary text-primary-foreground border-none flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-1">Total Progress</h3>
                        <p className="text-2xl font-black">
                            {todos.filter(t => t.status === 'done').length} / {todos.length}
                        </p>
                        <p className="text-xs opacity-80">Tasks completed</p>
                    </div>
                    <div className="mt-4">
                        <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white transition-all duration-700"
                                style={{ width: `${(todos.filter(t => t.status === 'done').length / (todos.length || 1)) * 100}%` }}
                            />
                        </div>
                    </div>
                </BentoCard>
            </div>

            <TodoModal
                isOpen={isTodoModalOpen}
                onClose={handleCloseModal}
                initialData={editingTask}
                isLoading={createMutation.isPending || updateTaskMutation.isPending}
                onSubmit={(data) => {
                    if (editingTask) {
                        updateTaskMutation.mutate({ ...data, id: editingTask._id });
                    } else {
                        createMutation.mutate(data);
                    }
                }}
            />
        </div>
    );
};

const ScheduleItem = ({ task, dotColors, onToggle, onDelete, onEdit }) => {
    const isDone = task.status === 'done';

    return (
        <BentoCard
            onClick={onEdit}
            className={`p-4 flex items-center justify-between group cursor-pointer hover:bg-secondary/50 transition-all border border-border/50 ${isDone ? 'opacity-60' : ''}`}
        >
            <div className="flex items-center gap-4">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle(task);
                    }}
                    className={`h-5 w-5 rounded-full border-2 transition-all flex items-center justify-center
                        ${isDone ? 'bg-primary border-primary scale-110' : 'border-muted-foreground/30 hover:border-primary'}`}
                >
                    {isDone && <div className="h-2 w-2 bg-background rounded-full" />}
                </button>

                <div>
                    <p className={`font-bold text-sm ${isDone ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <div className={`h-1.5 w-1.5 rounded-full ${dotColors[task.priority] || 'bg-gray-400'}`} />
                        <span className="capitalize">{task.status.replace('-', ' ')}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10"
                >
                    <Edit2 size={16} />
                </button>
                <button
                    onClick={(e) => onDelete(e, task._id)}
                    className="p-2 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-red-50"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </BentoCard>
    );
};

export default Schedule;