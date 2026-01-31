import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/button';
import { Loader2, X, CalendarDays } from 'lucide-react';

const todoSchema = z.object({
    title: z.string().min(1, "Title is required").max(50, "Title too long"),
    description: z.string().min(1, "Description is required").max(200, "Description too long"),
    priority: z.enum(['low', 'medium', 'high']),
    deadline: z.string().optional().or(z.literal('')), // Handles empty date strings
    status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
});

const TodoModal = ({ isOpen, onClose, onSubmit, isLoading, initialData }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(todoSchema),
        defaultValues: { priority: 'medium', status: 'todo' }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                title: initialData.title,
                description: initialData.description,
                priority: initialData.priority,
                deadline: initialData.deadline ? new Date(initialData.deadline).toISOString().split('T')[0] : '',
                status: initialData.status
            });
        } else {
            reset({ title: '', description: '', priority: 'medium', deadline: '', status: 'todo' });
        }
    }, [initialData, reset, isOpen])

    const onFormSubmit = (data) => {
        const formatedData = {
            ...data,
            deadline: data.deadline === '' ? undefined : data.deadline
        };
        onSubmit(formatedData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200'>
            <div className='bg-card border border-border w-full max-w-lg p-6 rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-200'>
                <button onClick={() => { reset(); onClose(); }} className='absolute right-4 top-2 p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground'>
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-black mb-6 tracking-tight">
                    {initialData ? 'Edit Task' : 'Create New Task'}
                </h2>

                <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-4'>
                    <div className='space-y-2'>
                        <label className='text-sm font-bold ml-1'>Title</label>
                        <input
                            {...register("title", { required: "Title is required" })}
                            className={`w-full h-12 px-4 rounded-xl bg-secondary/50 border outline-none transition-all ${errors.title ? 'border-destructive' : 'border-border focus:border-primary'}`}
                            placeholder="What needs to be done?"
                        />
                        {errors.title && <p className="text-[10px] font-bold text-destructive ml-1 uppercase">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold ml-1">Description</label>
                        <textarea
                            {...register("description")}
                            className={`w-full h-24 p-4 rounded-xl bg-secondary/50 border outline-none transition-all resize-none ${errors.description ? 'border-destructive' : 'border-border focus:border-primary'}`}
                            placeholder="Add some details..."
                        />
                        {errors.description && <p className="text-[10px] font-bold text-destructive ml-1 uppercase">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold ml-1">Priority</label>
                            <select
                                {...register("priority")}
                                className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary appearance-none cursor-pointer"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold ml-1">Deadline</label>
                            <div className="relative group">
                                <input
                                    type="date"
                                    {...register("deadline")}
                                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-secondary/50 border border-border outline-none focus:border-primary transition-all 
            [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 cursor-pointer"
                                />
                                <CalendarDays
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none"
                                    size={18}
                                />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-2xl font-black text-base mt-4 shadow-lg shadow-primary/20 cursor-pointer active:scale-95 transition-transform">
                        {isLoading ? <Loader2 className="animate-spin" /> : (initialData ? "Update Task" : "Create Task")}
                    </Button>
                </form>
            </div>
        </div >
    )
}

export default TodoModal
