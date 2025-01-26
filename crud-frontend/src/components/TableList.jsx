import axios from 'axios';
import { useState } from 'react';
import { AlertCircle, Clock } from 'lucide-react';

export default function TableList({
  token, // Токен для аутентификации
  handleOpen, // Функция для открытия модального окна
  tableData, // Данные задач
  setTableData, // Функция для обновления данных задач
  searchTerm, // Текст поиска
  filterStatus, // Текущий статус фильтра
  setFilterStatus, // Функция для установки фильтра по статусу
}) {
  const [error, setError] = useState(null);

  // Сортировка данных задач по приоритету
  const sortedData = [...tableData].sort((a, b) => {
    const priorityOrder = { высокий: 1, средний: 2, низкий: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Фильтрация данных задач по поисковому запросу и статусу
  const filteredData = sortedData.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilterStatus =
      !filterStatus || task.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilterStatus;
  });

  // Удаление задачи
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Удалить эту задачу?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/api/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Обновление состояния после удаления задачи
        setTableData((prev) => prev.filter((task) => task.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Изменение приоритета задачи
  const handlePriorityChange = async (taskId, newPriority) => {
    try {
      await axios.put(
        `http://localhost:3000/api/tasks/${taskId}/priority`,
        { priority: newPriority },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Обновление состояния после изменения приоритета
      setTableData((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, priority: newPriority } : task
        )
      );
    } catch (error) {
      console.error('Error updating task priority:', error);
    }
  };

  // Получение следующего статуса для задачи
  const getNextStatus = (currentStatus) => {
    const statuses = ['новая', 'в процессе', 'завершена'];
    const currentIndex = statuses.indexOf(currentStatus);
    return statuses[(currentIndex + 1) % statuses.length];
  };

  // Изменение статуса задачи
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/api/tasks/${taskId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Обновление состояния после изменения статуса
      setTableData((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Уведомление о дедлайне задачи
  const getDeadlineNotification = (deadline) => {
    if (!deadline) return <span>Без дедлайна</span>; // Если дедлайн не указан

    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = (deadlineDate - now) / (1000 * 60 * 60 * 24); // Разница в днях

    // Проверка, если срок прошел
    if (timeDiff < 0) {
      return (
        <span className="flex items-center text-red-600 font-bold">
          <AlertCircle className="w-4 h-4 mr-2" />
          Просрочено! ({deadlineDate.toLocaleDateString()})
        </span>
      );
    }
    // Проверка, если срок истекает скоро
    if (timeDiff <= 3) {
      return (
        <span className="flex items-center text-yellow-600 font-bold">
          <Clock className="w-4 h-4 mr-2" />
          Скоро срок! ({deadlineDate.toLocaleDateString()})
        </span>
      );
    }
    // Если срок в порядке
    return deadlineDate.toLocaleDateString();
  };

  return (
    <>
      {error && <div className="alert alert-error">{error}</div>} {/* Отображение ошибки */}

      {/* Фильтры для задач */}
      <div className="flex gap-4 mb-4 mx-2">
        <button
          className={`btn ${filterStatus === '' ? 'btn-primary' : ''}`}
          onClick={() => setFilterStatus('')}
        >
          Все
        </button>
        <button
          className={`btn ${filterStatus === 'новая' ? 'btn-primary' : ''}`}
          onClick={() => setFilterStatus('новая')}
        >
          Новые
        </button>
        <button
          className={`btn ${filterStatus === 'в процессе' ? 'btn-primary' : ''}`}
          onClick={() => setFilterStatus('в процессе')}
        >
          В процессе
        </button>
        <button
          className={`btn ${filterStatus === 'завершена' ? 'btn-primary' : ''}`}
          onClick={() => setFilterStatus('завершена')}
        >
          Завершенные
        </button>
      </div>

      {/* Таблица задач */}
      <div className="overflow-x-auto mt-6 mx-2">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Заголовок</th>
              <th>Описание</th>
              <th>Статус</th>
              <th>Приоритет</th>
              <th>Дедлайн</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((task) => (
              <tr key={task.id}>
                <th>{task.id}</th>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>
                  <button
                    className={`btn rounded-full w-24 ${
                      task.status === 'в процессе'
                        ? 'btn-warning'
                        : task.status === 'завершена'
                        ? 'btn-success'
                        : 'btn-primary'
                    }`}
                    onClick={() => handleStatusChange(task.id, getNextStatus(task.status))}
                  >
                    {task.status}
                  </button>
                </td>
                <td>
                  <select
                    value={task.priority}
                    className="select select-bordered"
                    onChange={(e) => handlePriorityChange(task.id, e.target.value)}
                  >
                    <option value="высокий">Высокий</option>
                    <option value="средний">Средний</option>
                    <option value="низкий">Низкий</option>
                  </select>
                </td>
                <td>{getDeadlineNotification(task.deadline)}</td>
                <td>
                  <button
                    onClick={() => handleOpen('edit', task)}
                    className="btn btn-secondary"
                  >
                    Изменить
                  </button>
                  <button
                    className="btn btn-accent ml-2"
                    onClick={() => handleDelete(task.id)} >Удалить </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
