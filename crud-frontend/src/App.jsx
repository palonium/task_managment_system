import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Компоненты
import NavBar from './components/NavBar';
import TableList from './components/TableList';
import ModalForm from './components/ModalForm';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ChangePasswordForm from './components/ChangePasswordForm';

function App() {
  const [token, setToken] = useState('');
  const [mode, setMode] = useState('login');
  // управление модалкой создания/редактирования задачи
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [taskData, setTaskData] = useState(null);
  // поиск и фильтрация
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  // список задач
  const [tableData, setTableData] = useState([]);
  // модалка смены пароля
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);


  //функция загрузки задач с сервера
  const fetchTasks = async () => {
    if (!token) return;
    try {
      const response = await axios.get('http://localhost:3000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTableData(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err.message);
    }
  };

   // Обработчик для отправки данных задачи (добавление или обновление)
  const handleSubmitTask = async (newTaskData) => {
    try {
      //если данный режим, тогда выполняется запрос на создание новой задачи
      if (modalMode === 'add') {
        const response = await axios.post(
          'http://localhost:3000/api/tasks',
          newTaskData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTableData((prev) => [...prev, response.data]);// Добавляем новую задачу в список
      } else {// Если режим иной режим, выполняем запрос на обновление задачи
        const response = await axios.put(
          `http://localhost:3000/api/tasks/${taskData.id}`,
          newTaskData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTableData((prev) =>
          prev.map((task) => (task.id === taskData.id ? response.data : task))// Обновляем задачу в списке
        );
      }
      fetchTasks(); // Перезагружаем список задач
      setIsOpen(false);// Закрываем модальное окно
    } catch (error) {
      console.error('Error adding/updating task:', error);
    }
  };
  // Обработчик для открытия модального окна создания/редактирования задачи
  const handleOpen = (m, task = null) => {
    setTaskData(task); // Устанавливаем данные текущей задачи
    setModalMode(m); // Устанавливаем режим 
    setIsOpen(true); // Открываем модальное окно
  };

  useEffect(() => {
    if (mode === 'tasks' && token) {
      fetchTasks();
    }
  }, [mode, token]);

  // Обработчик успешного входа (сохранение токена и переход к задачам)
  const handleLoginSuccess = (receivedToken) => {
    setToken(receivedToken);
    setMode('tasks');// Устанавливаем режим отображения задач
  };

  // Обработчик выхода из системы (очистка токена и возврат к экрану входа)
  const handleLogout = () => {
    setToken('');
    setMode('login');
    setTableData([]);// Очищаем список задач
  };

  // Рендер входа
  if (mode === 'login') {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoginForm
          onLogin={handleLoginSuccess}// Обработчик успешного входа
          switchToRegister={() => setMode('register')}
        />
      </div>
    );
  }
// ренден регистации
  if (mode === 'register') {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <RegisterForm
          switchToLogin={() => setMode('login')}
        />
      </div>
    );
  }

  // Если мы здесь, значит mode === 'tasks'
  return (
    <div className="min-h-screen bg-base-200">
      {/* Панель навигации */}
      <NavBar 
        onSearch={setSearchTerm} // Обновление поискового запроса
        onChangePassword={() => setIsChangePassOpen(true)} // Открытие модального окна смены пароля
        onLogout={handleLogout} // Выход из системы
        onOpen={() => handleOpen('add')} // Открытие модального окна добавления задачи
      />

      <div className="mx-4">
        {/* Таблица задач */}
        <TableList
          token={token} // Токен для аутентификации
          setTableData={setTableData} // Функция обновления списка задач
          tableData={tableData} // Данные задач
          handleOpen={handleOpen} // Открытие модального окна редактирования задачи
          searchTerm={searchTerm} // Поисковый запрос
          filterStatus={filterStatus} // Статус фильтрации
          setFilterStatus={setFilterStatus} // Функция установки фильтрации
        />
      </div>

      {/* Модальное окно для добавления/редактирования задачи */}
      <ModalForm
        isOpen={isOpen} // Состояние открытия модального окна
        mode={modalMode} // Режим модального окна ("add" или "edit")
        taskData={taskData} // Данные текущей задачи
        onSubmit={handleSubmitTask} // Обработчик отправки данных задачи
        onClose={() => setIsOpen(false)} // Закрытие модального окна
      />

      {/* Модальное окно для смены пароля */}
      <ChangePasswordForm
        isOpen={isChangePassOpen} // Состояние открытия модального окна
        onClose={() => setIsChangePassOpen(false)} // Закрытие модального окна
        token={token} // Токен для аутентификации
      />
    </div>
  );
}

export default App;