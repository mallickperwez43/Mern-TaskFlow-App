import TodoModel from '../models/Todo.js'
import { todoSchema, updateTodoSchema } from '../validators/todoValidator.js';

const createTodo = async (req, res) => {
    try {
        // check validation using zod
        const validatedData = todoSchema.safeParse(req.body);
        if (!validatedData.success) {
            return res.status(400).json({
                message: "Incorrect format",
                errors: validatedData.error.issues
            });
        }

        const { title, description, deadline, priority, status } = validatedData.data;

        // create after validation
        const todo = await TodoModel.create({
            user: req.userId,
            title: title,
            description: description,
            deadline: deadline,
            priority: priority,
            status: status || 'todo'
        });

        res.status(201).json({ message: "Todo created", todo });
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
};

const getTodos = async (req, res) => {
    try {
        const todos = await TodoModel.find({ user: req.userId }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: todos.length,
            todos: todos
        });
    } catch (error) {
        // console.log("Fetching todos for user ID:", req.userId); // Check if this is defined
        console.error()
        res.status(500).json({ message: "Server error" });
    }
};

const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;

        // check validation using zod
        const validatedData = updateTodoSchema.safeParse(req.body);
        if (!validatedData.success) {
            return res.status(400).json({
                message: "Invalid update data",
                errors: validatedData.error.issues
            });
        }

        const updates = { ...validatedData.data };

        const currentTodo = await TodoModel.findOne({ _id: id, user: req.userId });
        if (!currentTodo) return res.status(404).json({ message: "Todo not found" });

        if (updates.status === 'done' && currentTodo.status !== 'done') {
            updates.completedAt = new Date();
        } else if (updates.status && updates.status !== 'done' && currentTodo.status === 'done') {
            updates.completedAt = null;
        }

        const updatedTodo = await TodoModel.findOneAndUpdate(
            { _id: id, user: req.userId },
            { $set: updates },
            { new: true }
        );

        res.status(200).json({ message: "Updated successfully", todo: updatedTodo });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        const todoToDelete = await TodoModel.findOneAndDelete({ _id: id, user: req.userId });

        if (!todoToDelete) {
            return res.status(404).json({ message: "Todo not found or unauthorized" });
        }

        res.status(200).json({ message: "Updated deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export { createTodo, getTodos, updateTodo, deleteTodo }