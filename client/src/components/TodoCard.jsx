import React from 'react';
import BentoCard from './BentoCard';
import { Trash2, ArrowRight, CheckCircle2, RotateCcw, Calendar, Edit3, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TodoCard = ({ task, onUpdateStatus, onDelete, onEdit, index, isOverlay }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task._id,
        disabled: isOverlay
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.2 : 1,
        cursor: isOverlay ? 'grabbing' : 'inherit'
    };

    const dotColors = {
        high: "bg-red-500",
        medium: "bg-amber-500",
        low: "bg-emerald-500",
    };

    return (
        <div ref={setNodeRef} style={style} {...(isOverlay ? {} : attributes)} {...(isOverlay ? {} : listeners)}>
            <BentoCard
                className={`p-5 group flex flex-col gap-4 border relative ${task.status === 'done' ? 'opacity-75' : 'bg-card shadow-sm'}`}
            >
                {!isOverlay && (
                    <div {...attributes} {...listeners} className="absolute top-5 right-2 opacity-0 group-hover:opacity-30 cursor-grab active:cursor-grabbing">
                        <GripVertical size={16} />
                    </div>
                )}

                {/*  Title & Quick Actions */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full animate-pulse ${dotColors[task.priority]}`} />
                            <span className={`text-[10px] font-bold uppercase tracking-widest opacity-80`}>
                                {task.priority}
                            </span>
                        </div>
                        <h4 className={`font-bold text-sm leading-tight transition-all ${task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {task.title}
                        </h4>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onEdit?.(task)}
                            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                            <Edit3 size={14} />
                        </button>
                        <button
                            onClick={() => onDelete(task._id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 italic">
                    {task.description || "No specific details provided for this task."}
                </p>

                {/*  Deadline */}
                {task.deadline && (
                    <div className="flex items-center gap-1.5 text-muted-foreground/60">
                        <Calendar size={12} />
                        <span className="text-[10px] font-medium">
                            {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                )}

                {/*  Action Buttons */}
                {!isOverlay && (
                    <div className="pt-3 mt-auto border-t border-border/50 flex items-center gap-2">
                        {task.status === 'todo' && (
                            <button
                                onClick={() => onUpdateStatus(task._id, 'in-progress')}
                                className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase py-2 bg-foreground text-background rounded-xl hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Start <ArrowRight size={12} />
                            </button>
                        )}

                        {task.status === 'in-progress' && (
                            <>
                                <button
                                    onClick={() => onUpdateStatus(task._id, 'todo')}
                                    className="p-2 bg-secondary text-muted-foreground rounded-xl hover:bg-border transition-all"
                                    title="Reset"
                                >
                                    <RotateCcw size={14} />
                                </button>
                                <button
                                    onClick={() => onUpdateStatus(task._id, 'done')}
                                    className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all"
                                >
                                    Complete <CheckCircle2 size={12} />
                                </button>
                            </>
                        )}

                        {task.status === 'done' && (
                            <button
                                onClick={() => onUpdateStatus(task._id, 'in-progress')}
                                className="w-full text-[10px] font-black uppercase py-2 bg-secondary text-muted-foreground rounded-xl hover:bg-border transition-all"
                            >
                                Undo Completion
                            </button>
                        )}
                    </div>
                )}
            </BentoCard>
        </div>
    );
};

export default TodoCard;