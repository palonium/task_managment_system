import React, { useState } from 'react';
import axios from 'axios';

function ChangePasswordForm({ isOpen, onClose, token }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  

  const [fieldErrors, setFieldErrors] = useState({
    oldPassword: '',
    newPassword: '',
  });
  
  const [successMsg, setSuccessMsg] = useState('');

  // Функция для валидации полей
  const validateFields = () => {
    const errors = {};
    if (!oldPassword) {
      errors.oldPassword = 'Старый пароль обязателен.';
    }
    if (!newPassword) {
      errors.newPassword = 'Новый пароль обязателен.';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Новый пароль должен быть не менее 6 символов.';
    }
    return errors;
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    setSuccessMsg('');  // Сбрасываем сообщение об успехе
    setFieldErrors({}); // Сбрасываем ошибки

    // Проверяем наличие токена авторизации
    if (!token) {
      setFieldErrors((prev) => ({
        ...prev,
        oldPassword: 'Не найден токен авторизации!',
      }));
      return;
    }

    // Валидация полей формы
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors); // Устанавливаем ошибки валидации
      return;
    }

    // Отправка запроса на сервер для смены пароля
    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/change-password',
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Передаём токен в заголовках
          },
        }
      );
      // При успешной смене пароля отображаем сообщение и очищаем поля
      setSuccessMsg('Пароль успешно изменён!');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      // Обработка ошибок сервера
      setFieldErrors((prev) => ({
        ...prev,
        oldPassword: err.response?.data?.message || 'Неверный старый пароль.',
      }));
    }
  };

  // Если форма не должна быть открыта, ничего не рендерим
  if (!isOpen) return null;

  return (
    <dialog open={isOpen} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Смена пароля</h3>
        <form onSubmit={handleSubmit} className="mt-4">
          {/* Сообщение об успешной смене пароля */}
          {successMsg && <div className="text-green-600 text-sm mb-2">{successMsg}</div>}

          {/* Поле ввода старого пароля */}
          <label className="label">
            <span className="label-text">Старый пароль</span>
          </label>
          <input
            type="password"
            className={`input input-bordered w-full ${fieldErrors.oldPassword ? 'input-error' : ''}`}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          {/* Ошибка для старого пароля */}
          {fieldErrors.oldPassword && (
            <div className="text-red-500 text-sm mt-1">{fieldErrors.oldPassword}</div>
          )}

          {/* Поле ввода нового пароля */}
          <label className="label mt-2">
            <span className="label-text">Новый пароль</span>
          </label>
          <input
            type="password"
            className={`input input-bordered w-full ${fieldErrors.newPassword ? 'input-error' : ''}`}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {/* Ошибка для нового пароля */}
          {fieldErrors.newPassword && (
            <div className="text-red-500 text-sm mt-1">{fieldErrors.newPassword}</div>
          )}

          {/* Кнопки действий */}
          <div className="modal-action mt-4">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn btn-success">
              Изменить
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default ChangePasswordForm;