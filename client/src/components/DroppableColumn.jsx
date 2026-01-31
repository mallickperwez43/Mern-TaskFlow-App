import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TodoCard from './TodoCard';
import { LayoutPanelLeft } from 'lucide-react';

const DroppableColumn = ({ col, tasks, onUpdateStatus, onDelete, onEdit }) => {
    const { setNodeRef, isOver } = useDroppable({ id: col.id });

    return (
        <div className="flex flex-col gap-4">
            <div className={`flex items-center justify-between p-3 rounded-2xl border border-border/50 ${col.color}`}>
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                    {col.icon}
                    {col.label}
                </div>
                <span className="text-[10px] font-black bg-background/50 px-2 py-0.5 rounded-full">
                    {tasks.length}
                </span>
            </div>

            {/* Dropping zone */}
            <div
                ref={setNodeRef}
                className={`flex flex-col gap-3 min-h-screen pb-32 rounded-3xl transition-all duration-200 ${isOver
                    ? 'bg-primary/5 ring-2 ring-primary/20 ring-dashed border-transparent'
                    : 'bg-transparent border-transparent'
                    }`}>
                <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task, idx) => (
                        <TodoCard
                            key={task._id}
                            task={task}
                            index={idx}
                            onUpdateStatus={onUpdateStatus}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />
                    ))}
                </SortableContext>
                {/* Empty State visual when column is empty */}
                {tasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-border/50 rounded-3xl opacity-40">
                        <LayoutPanelLeft size={24} className="mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Empty</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DroppableColumn
