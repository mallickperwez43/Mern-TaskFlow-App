import express from 'express';
import { createTodo, getTodos, updateTodo, deleteTodo } from '../controllers/todoController.js';
import { userMiddleware } from '../middleware/authMiddleware.js';

const todoRouter = express.Router();

todoRouter.use(userMiddleware)

todoRouter.post('/create-todo', createTodo);
todoRouter.get('/all-todos', getTodos);
todoRouter.put('/update-todo/:id', updateTodo);
todoRouter.delete('/delete-todo/:id', deleteTodo);

export default todoRouter;