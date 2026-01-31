import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { useModalStore } from '@/store/useModalStore';
import BentoCard from '@/components/BentoCard';
import { CheckCircle2, Clock, Circle, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TodoModal from '@/components/TodoModal';
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, pointerWithin, rectIntersection } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import DroppableColumn from '@/components/DroppableColumn';
import { createPortal } from 'react-dom';
import TodoCard from '@/components/TodoCard';

const Dashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingTask, setEditingTask] = useState(false);
    const [activeTask, setActiveTask] = useState(null);

    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const { isTodoModalOpen, openTodoModal, closeTodoModal } = useModalStore();

    // Fetching logic 
    const { data: todos = [] } = useQuery({
        queryKey: ['todos'],
        queryFn: async () => {
            const res = await api.get('/todo/all-todos');
            return res.data.todos || [];
        },
        refetchOnWindowFocus: true,
    });

    // Mutations 
    const createMutation = useMutation({
        mutationFn: (newTodo) => api.post('/todo/create-todo', newTodo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            closeTodoModal();
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }) => api.put(`/todo/update-todo/${id}`, { status }),
        onMutate: async ({ id, status }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['todos'] });
            // Snapshot previous value
            const previousTodos = queryClient.getQueryData(['todos']);
            // Optimistically update the cache
            queryClient.setQueryData(['todos'], (old) =>
                old.map(t => t._id === id ? { ...t, status } : t)
            );
            return { previousTodos };
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(['todos'], context.previousTodos);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    });

    const updateTaskMutation = useMutation({
        mutationFn: (updatedTodo) => api.put(`/todo/update-todo/${updatedTodo.id}`, updatedTodo),
        onMutate: async (updatedTodo) => {
            await queryClient.cancelQueries({ queryKey: ['todos'] });
            const previousTodos = queryClient.getQueryData(['todos']);

            queryClient.setQueryData(['todos'], (old) =>
                old.map(t => t._id === updatedTodo.id ? { ...t, ...updatedTodo } : t)
            );

            return { previousTodos };
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(['todos'], context.previousTodos);
        },
        onSuccess: () => {
            setEditingTask(null);
            closeTodoModal();
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => api.delete(`/todo/delete-todo/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    });

    const handleEdit = (task) => {
        setEditingTask(task);
        openTodoModal();
    };

    const handleCloseModal = () => {
        setEditingTask(null);
        closeTodoModal();
    };

    // Stats Logic 
    const stats = useMemo(() => {
        const total = todos.length;
        const done = todos.filter(t => t.status === 'done').length;
        const perc = total > 0 ? Math.round((done / total) * 100) : 0;
        return { total, done, perc };
    }, [todos]);

    // Columns Configuration
    const columns = [
        { id: 'todo', label: 'To Do', icon: <Circle size={16} className="text-muted-foreground" />, color: 'bg-secondary' },
        { id: 'in-progress', label: 'In Progress', icon: <Clock size={16} className="text-amber-500" />, color: 'bg-amber-500/10' },
        { id: 'done', label: 'Completed', icon: <CheckCircle2 size={16} className="text-emerald-500" />, color: 'bg-emerald-500/10' }
    ];

    // sensors for dnd
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // drag handlers
    const handleDragStart = (event) => {
        const { active } = event;
        const task = todos.find(t => t._id === active.id);
        setActiveTask(task);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const taskId = active.id;
        let newStatus = over.id; // column id[todo, in-progress, done]

        const isColumn = columns.some(col => col.id === newStatus);

        if (!isColumn) {
            const overTask = todos.find(t => t._id === newStatus);
            if (overTask) {
                newStatus = overTask.status;
            }
        }

        const task = todos.find(t => t._id === taskId);
        if (task && task.status !== newStatus) { // now in state in between somewhere
            updateStatusMutation.mutate({ id: taskId, status: newStatus });
        }
    };

    // collision detection strategy
    const customCollisonStrategy = (args) => {
        const pointerCollisions = pointerWithin(args);

        if (pointerCollisions.length > 0) {
            return pointerCollisions;
        }

        return rectIntersection(args);
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-10">
            {/* TOP HEADER */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">
                        Focus <span className="text-primary">Mode</span>
                    </h1>
                    <p className="text-muted-foreground font-medium">Welcome back, {user?.firstName}. Let's be productive.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2.5 h-12 rounded-xl bg-card border border-border focus:ring-2 ring-primary/20 outline-none text-sm w-48 lg:w-72 transition-all"
                        />
                    </div>
                    <Button onClick={openTodoModal} className="rounded-xl shadow-lg shadow-primary/20 gap-2 h-12 px-6 font-bold">
                        <Plus size={18} /> New Task
                    </Button>
                </div>
            </header>

            {/* STATS CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <BentoCard className="flex flex-col p-5 justify-between h-32" delay={0.1}>
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Efficiency</span>
                    <div className="space-y-2">
                        <span className="text-3xl font-black">{stats.perc}%</span>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${stats.perc}%` }} />
                        </div>
                    </div>
                </BentoCard>
                <BentoCard className="flex flex-col p-5 justify-between h-32 border-none bg-orange-400 text-white" delay={0.2}>
                    <span className="text-[10px] font-black uppercase opacity-80 tracking-widest">Pending</span>
                    <span className="text-3xl font-black">{todos.filter(t => t.status !== 'done').length}</span>
                </BentoCard>
                <BentoCard className="flex flex-col p-5 justify-between h-32 border-none bg-emerald-500 text-white" delay={0.3}>
                    <span className="text-[10px] font-black uppercase opacity-80 tracking-widest">Completed</span>
                    <span className="text-3xl font-black">{stats.done}</span>
                </BentoCard>
                <BentoCard className="flex flex-col p-5 justify-between h-32" delay={0.4}>
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Weekly Focus</span>
                    <span className="text-sm font-bold">{stats.perc === 100 ? 'All Clear! 🏆' : 'Consistency is Key'}</span>
                </BentoCard>
            </div>

            {/* KANBAN BOARD */}
            <DndContext
                sensors={sensors}
                collisionDetection={rectIntersection}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pb-20">
                    {columns.map((col) => (
                        <DroppableColumn
                            key={col.id}
                            col={col}
                            tasks={todos.filter(t => t.status === col.id && t.title.toLowerCase().includes(searchTerm.toLowerCase()))}
                            onUpdateStatus={(id, status) => updateStatusMutation.mutate({ id, status })}
                            onDelete={(id) => deleteMutation.mutate(id)}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>

                {createPortal(
                    <DragOverlay dropAnimation={null}>
                        {activeTask ? (
                            <div className='w-full rotate-2 scale-105 cursor-grabbing opacity-90'>
                                <TodoCard task={activeTask} isOverlay={true} />
                            </div>
                        ) : null}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>

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
    )
}

export default Dashboard;