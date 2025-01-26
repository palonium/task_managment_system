// controllers/taskController.js
import * as taskService from "../services/taskServices.js";

// Создание задачи (контроллер)
export const createTask = async (req, res) => {
    try {
        // Берём userId из токена (устанавливается в authMiddleware)
        const userId = req.user.userId;

        const taskData = req.body;
        // Добавляем поле user_id при создании
        const newTask = await taskService.createTask({ ...taskData, user_id: userId });
        res.status(200).json(newTask);
    } catch (err) { 
        console.error('Error adding task:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Обновление задачи (контроллер)
export const updateTask = async (req, res) => {
    try {
        // userId из токена
        const userId = req.user.userId;

        const taskId = req.params.id;
        const taskData = req.body;

        // Передаём userId в сервис, чтобы обновлять только свою задачу
        const updatedTask = await taskService.updateTask(taskId, userId, taskData);

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(updatedTask);

    } catch (err) { 
        console.error('Error updating task:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Удаление задачи (контроллер)
export const deleteTask = async (req, res) => {
    try {
        // userId из токена
        const userId = req.user.userId;

        const taskId = req.params.id;
        const deleted = await taskService.deleteTask(taskId, userId);
        if (!deleted) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).send();
    } catch (err) { 
        console.error('Error deleting task:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Поиск задачи (контроллер)
export const searchTasks = async (req, res) => {
    try {
        // userId из токена
        const userId = req.user.userId;

        const searchTerm = req.query.q; // Получение поискового термина из параметров запроса
        const tasks = await taskService.searchTasks(searchTerm, userId);
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error searching tasks:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Контроллер дляя обновления приоритета задачи
export const updateTaskStatus = async (req, res) => {
    try {
        // userId из токена
        const userId = req.user.userId;

        const taskId = req.params.id;
        const { status } = req.body; // Новый статус задачи
        const updatedTask = await taskService.updateTaskStatus(taskId, userId, status);

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(updatedTask);
    } catch (err) {
        console.error('Error updating task status:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Контроллер для обновления приоритета задачи
export const updatePriority = async (req, res) => {
    try {
      // userId из токена
      const userId = req.user.userId;

      const taskId = req.params.id;
      const { priority } = req.body; // Новый приоритет задачи
  
      // Обновляем задачу в базе данных
      const updatedTask = await taskService.updatePriority(taskId, userId, priority);
  
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json(updatedTask); // Возвращаем обновлённую задачу
    } catch (err) {
      console.error('Error updating task priority:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};
  

// Получение всех задач с сортировкой по приоритету(контроллер)
export const getTasks = async (req, res) => {
    try {
        // userId из токена
        const userId = req.user.userId;

        const tasks = await taskService.getTasksForUser(userId);
        // Сортировка по приоритету
        const sortedTasks = tasks.sort((a, b) => {
            const priorities = { высокий: 1, средний: 2, низкий: 3 };
            return priorities[a.priority] - priorities[b.priority];
        });
        res.status(200).json(sortedTasks);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};