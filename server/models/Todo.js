import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const ObjectId = mongoose.Schema.Types.ObjectId;

const TodoSchema = new Schema({
    user: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    deadline: {
        type: Date,
        required: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'done'],
        default: 'todo'
    },
    completedAt: {
        type: Date,
        default: null
    },
}, { timestamps: true }).index({ user: 1, title: 1, status: 1, completedAt: -1 });;

const TodoModel = model('Todo', TodoSchema);

export default TodoModel;