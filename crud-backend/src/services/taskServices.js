// services/taskServices.js
import { query } from "../db.js";

// Получить все задачи для конкретного userId
export const getTasksForUser = async (userId) => {
    const { rows } = await query(
        `SELECT * FROM tasks WHERE user_id = $1`,
        [userId]
    );
    return rows;
};

// Создать новую задачу
export const createTask = async (taskData) => {
    const { title, description, priority, status, deadline, user_id } = taskData;
    const { rows } = await query(
        `INSERT INTO tasks (title, description, priority, status, deadline, user_id) 
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [title, description, priority, status, deadline, user_id]
    );
    return rows[0];
};

// Обновить задачу (учитываем userId, чтобы нельзя было редактировать другими пользователями)
export const updateTask = async (taskId, userId, taskData) => {
    const { title, description, priority, status, deadline } = taskData;
    const { rows } = await query(
        `UPDATE tasks
         SET title = $1, 
             description = $2, 
             priority = $3, 
             status = $4, 
             deadline = $5, 
             updated_at = NOW()
         WHERE id = $6
           AND user_id = $7
         RETURNING *`,
        [title, description, priority, status, deadline, taskId, userId]
    );
    return rows[0];
};

// Удалить задачу (учитываем userId)
export const deleteTask = async (taskId, userId) => {
    const { rowCount } = await query(
        `DELETE FROM tasks WHERE id = $1 AND user_id = $2`,
        [taskId, userId]
    );
    return rowCount > 0; // Возвращает true, если строка удалена, иначе false
};

// Поиск задач (с учётом userId)
export const searchTasks = async (searchTerm, userId) => {
    const { rows } = await query(
        `SELECT * FROM tasks
         WHERE user_id = $1
           AND (
               title ILIKE $2 
            OR description ILIKE $2 
            OR status ILIKE $2
           )`,
        [userId, `%${searchTerm}%`]
    );
    return rows;
};

// Обновление статуса задачи (учитываем userId)
export const updateTaskStatus = async (taskId, userId, status) => {
    const { rows } = await query(
        `UPDATE tasks
         SET status = $1, 
             updated_at = NOW()
         WHERE id = $2
           AND user_id = $3
         RETURNING *`,
        [status, taskId, userId]
    );
    return rows[0];
};

// Обновление приоритета задачи (учитываем userId)
export const updatePriority = async (taskId, userId, priority) => {
    const { rows } = await query(
        `UPDATE tasks 
         SET priority = $1, 
             updated_at = NOW()
         WHERE id = $2
           AND user_id = $3
         RETURNING *`,
        [priority, taskId, userId]
    );
    return rows[0];
};