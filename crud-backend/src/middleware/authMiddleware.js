import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_SECRET_KEY';

export const authMiddleware = (req, res, next) => {
  try {
    //Извлекаем заголовок Authorization из запроса
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      // Если заголовок отсутствует, возвращаем ошибку
      return res.status(401).json({ message: 'Нет заголовка авторизации' });
    }

    // Получаем токен из заголовка
    const token = authHeader.split(' ')[1];
    if (!token) {
      // Если токен отсутствует, возвращаем ошибку
      return res.status(401).json({ message: 'Токен не найден' });
    }

    // Проверяем валидность токена
    const decoded = jwt.verify(token, JWT_SECRET); // Расшифровываем токен с использованием секретного ключа
    // Если токен валиден, добавляем информацию из токена
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Ошибка авторизации: неверный или просроченный токен' });
  }
};
