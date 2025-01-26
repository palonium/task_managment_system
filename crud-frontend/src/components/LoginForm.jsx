import React, { useState } from 'react';
import axios from 'axios';

function LoginForm({ onLogin, switchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', form: '' });

  // Функция валидации формы
  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '', form: '' };

    // Проверка email
    if (!email) {
      newErrors.email = 'Введите ваш email.';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Введите корректный email.';
      isValid = false;
    }

    // Проверка пароля
    if (!password) {
      newErrors.password = 'Введите ваш пароль.';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов.';
      isValid = false;
    }

    // Установка ошибок
    setErrors(newErrors);
    return isValid;
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Очистка ошибок перед отправкой
    setErrors({ email: '', password: '', form: '' });

    // Если форма валидна, отправляем запрос
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          email,
          password,
        });
        // Успешный логин: передаем token через onLogin
        onLogin(response.data.token);
      } catch (err) {
        // Установка ошибки формы при неудачном запросе
        setErrors((prev) => ({
          ...prev,
          form: err.response?.data?.message || 'Ошибка при входе.',
        }));
      }
    }
  };

  return (
    <div className="card shadow-xl bg-base-100 p-6 w-full max-w-sm">
      <h2 className="text-xl font-bold mb-4">Вход</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="form-control">
          <input
            type="email"
            placeholder="Email"
            className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* Сообщение об ошибке email */}
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className="form-control">
          <input
            type="password"
            placeholder="Пароль"
            className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Сообщение об ошибке пароля */}
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
        </div>
        {/* Сообщение об общей ошибке формы */}
        {errors.form && <div className="text-red-600 text-sm mt-2">{errors.form}</div>}

        <button type="submit" className="btn btn-primary mt-2">
          Войти
        </button>
      </form>
      <button
        type="button"
        onClick={switchToRegister}
        className="btn btn-ghost text-sm text-blue-600 mt-2"
      >
        Нет аккаунта? Зарегистрироваться
      </button>
    </div>
  );
}

export default LoginForm;