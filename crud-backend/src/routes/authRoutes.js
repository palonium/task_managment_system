// routes/authRoutes.js
import express from 'express';
import * as authController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Регистрация (создаёт нового пользователя)
router.post('/register', authController.register);

// Авторизация (возвращает JWT токен)
router.post('/login', authController.login);

// Смена пароля (требует авторизации)
router.post('/change-password', authMiddleware, authController.changePassword);

// Выход может быть реализован по-разному. 
// Например, на клиенте можно удалить токен из cookie/хранилища.

export default router;