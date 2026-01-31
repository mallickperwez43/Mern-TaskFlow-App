import { z } from 'zod';

export const todoSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title too long").trim(),
    description: z.string().min(1, "Description is required").max(200, "Description too long").trim(),
    deadline: z.string().optional().or(z.literal('')),
    priority: z.enum(['low', 'medium', 'high'], { message: "Priority must be low, medium or high" }),
    status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
    completedAt: z.any().optional(),
});

export const updateTodoSchema = todoSchema.partial();