import * as userService from '../services/userService.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Секретный ключ для формирования JWT токенов
// В production лучше хранить его в .env
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_SECRET_KEY';

// Регистрация нового пользователя
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверяем, что пользователь с таким email не зарегистрирован
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаём пользователя
    const newUser = await userService.createUser(email, hashedPassword);

    return res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

// Вход в систему: проверяем email/пароль и выдаём JWT токен
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // Сравниваем хешированный пароль в БД с введённым
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // Формируем токен
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({
      message: 'Успешный вход',
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error('Ошибка при входе:', error);
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

// Смена пароля (нужен авторизованный пользователь)
export const changePassword = async (req, res) => {
  try {
    // authMiddleware уже прикрепит userId к req.user
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await userService.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Проверяем старый пароль
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Старый пароль неверен' });
    }

    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userService.updatePassword(userId, hashedPassword);

    return res.status(200).json({ message: 'Пароль успешно изменён' });
  } catch (error) {
    console.error('Ошибка при смене пароля:', error);
    return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};