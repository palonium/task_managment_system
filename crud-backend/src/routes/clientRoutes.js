
import express from 'express';
import * as taskController from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/tasks', authMiddleware, taskController.getTasks);           // Получение всех задач
router.post('/tasks', authMiddleware, taskController.createTask);        // Создание новой задачи
router.put('/tasks/:id', authMiddleware, taskController.updateTask);     // Обновление задачи
router.delete('/tasks/:id', authMiddleware, taskController.deleteTask);  // Удаление задачи
router.get('/tasks/search', authMiddleware, taskController.searchTasks); // Поиск задач
router.put('/tasks/:id/status', authMiddleware, taskController.updateTaskStatus); 
router.put('/tasks/:id/priority', authMiddleware, taskController.updatePriority);

export default router;