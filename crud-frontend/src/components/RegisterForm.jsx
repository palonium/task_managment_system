import React, { useState } from 'react';
import axios from 'axios';

function RegisterForm({ switchToLogin }) {

  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [errorMsg, setErrorMsg] = useState(''); 
  const [emailError, setEmailError] = useState(''); 
  const [passwordError, setPasswordError] = useState('');

  // Функция для проверки корректности email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Регулярное выражение для проверки формата email
    return emailRegex.test(email); // Проверка на соответствие шаблону
  };

  // Функция для проверки длины пароля
  const validatePassword = (password) => {
    return password.length >= 6; 
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    setErrorMsg('');
    setEmailError('');
    setPasswordError('');

    // Проверяем корректность email
    if (!validateEmail(email)) {
      setEmailError('Введите корректный email'); // Устанавливаем ошибку email
      return; // Останавливаем выполнение, если email некорректный
    }

    // Проверяем корректность пароля
    if (!validatePassword(password)) {
      setPasswordError('Пароль должен быть не менее 6 символов'); // Устанавливаем ошибку пароля
      return; // Останавливаем выполнение, если пароль некорректный
    }

    // Отправляем запрос на сервер
    try {
      await axios.post('http://localhost:3000/api/auth/register', {
        email,
        password,
      });
      // Если запрос успешен, переключаемся на страницу логина
      switchToLogin();
    } catch (err) {
      // Обрабатываем ошибку запроса
      setErrorMsg(err.response?.data?.message || 'Ошибка при регистрации');
    }
  };

  return (
    <div className="card shadow-xl bg-base-100 p-6 w-full max-w-sm">
      <h2 className="text-xl font-bold mb-4">Регистрация</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>

          <input
            type="email"
            placeholder="Email"
            className={`input input-bordered w-full ${
              emailError ? 'border-red-600' : '' // Подсветка ошибки
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Обновление состояния email
            required
          />
          {emailError && (
            <div className="text-red-600 text-sm mt-1">{emailError}</div> // Вывод сообщения об ошибке email
          )}
        </div>
        <div>

          <input
            type="password"
            placeholder="Пароль"
            className={`input input-bordered w-full ${
              passwordError ? 'border-red-600' : '' // Подсветка ошибки
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          {passwordError && (
            <div className="text-red-600 text-sm mt-1">{passwordError}</div> // Вывод сообщения об ошибке пароля
          )}
        </div>

        {errorMsg && <div className="text-red-600 text-sm">{errorMsg}</div>}
        <button type="submit" className="btn btn-primary mt-2">
          Зарегистрироваться
        </button>
      </form>

      <button
        type="button"
        onClick={switchToLogin}
        className="btn btn-ghost text-sm text-blue-600 mt-2"
      >
        Уже есть аккаунт? Войти
      </button>
    </div>
  );
}

export default RegisterForm;
