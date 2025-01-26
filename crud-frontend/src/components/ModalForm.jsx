import { useState, useEffect } from "react";

export default function ModalForm({ isOpen, onClose, mode, onSubmit, taskData }) {

  const [title, setTitle] = useState(""); 
  const [description, setDescription] = useState(""); 
  const [status, setStatus] = useState("новая"); 
  const [priority, setPriority] = useState("средний");
  const [deadline, setDeadline] = useState(""); 
  const [noDeadline, setNoDeadline] = useState(false); 

  const [errors, setErrors] = useState({}); // Ошибки валидации формы


  useEffect(() => {
    if (mode === "edit" && taskData) {
      setTitle(taskData.title);
      setDescription(taskData.description);
      setStatus(taskData.status);
      setPriority(taskData.priority);
      setDeadline(taskData.deadline || ""); // Если дедлайн отсутствует, устанавливаем пустую строку
      setNoDeadline(!taskData.deadline); // Устанавливаем флаг "Без дедлайна", если дедлайн не указан
    } else {
      // Сбрасываем поля при добавлении новой задачи
      setTitle("");
      setDescription("");
      setStatus("новая");
      setPriority("средний");
      setDeadline("");
      setNoDeadline(false);
    }
    setErrors({}); // Сброс ошибок при открытии формы
  }, [mode, taskData]);

  // Функция для валидации полей формы
  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Название обязательно для заполнения.";
    if (!description.trim())
      newErrors.description = "Описание обязательно для заполнения.";
    setErrors(newErrors);
    // Если ошибок нет, возвращаем true
    return Object.keys(newErrors).length === 0;
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // Если есть ошибки, не отправляем форму


    const payload = {
      title,
      description,
      status,
      priority,
      deadline: noDeadline ? null : deadline || null, // Если выбран "Без дедлайна", передаем null
    };
    await onSubmit(payload); // Отправка данных через переданный обработчик
  };

  // Если модальное окно закрыто, ничего не рендерим
  if (!isOpen) return null;

  return (
    <dialog open={isOpen} className="modal">
      <div className="modal-box">

        <h3 className="font-bold text-lg py-4">
          {mode === "edit" ? "Изменить задачу" : "Добавить задачу"}
        </h3>

        <form onSubmit={handleSubmit}>

          <label className="label">
            <span className="label-text">Название</span>
          </label>
          <input
            type="text"
            className={`input input-bordered w-full ${
              errors.title ? "border-red-500" : ""
            }`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {/* Сообщение об ошибке для поля "Название" */}
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}


          <label className="label mt-4">
            <span className="label-text">Описание</span>
          </label>
          <textarea
            className={`textarea textarea-bordered w-full ${
              errors.description ? "border-red-500" : ""
            }`}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {/* Сообщение об ошибке для поля "Описание" */}
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}


          <div className="flex gap-4 mt-4">

            <div className="flex-1">
              <label className="label">
                <span className="label-text">Статус</span>
              </label>
              <select
                value={status}
                className="select select-bordered w-full"
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="новая">Новая</option>
                <option value="в процессе">В процессе</option>
                <option value="завершена">Завершена</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="label">
                <span className="label-text">Приоритет</span>
              </label>
              <select
                value={priority}
                className="select select-bordered w-full"
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="низкий">Низкий</option>
                <option value="средний">Средний</option>
                <option value="высокий">Высокий</option>
              </select>
            </div>
          </div>


          <label className="label mt-4">
            <span className="label-text">Дедлайн</span>
          </label>
          <div className="flex items-center gap-2">

            <input
              type="datetime-local"
              className={`input input-bordered w-full ${
                errors.deadline ? "border-red-500" : ""
              }`}
              value={noDeadline ? "" : deadline || ""}
              onChange={(e) => setDeadline(e.target.value)}
              disabled={noDeadline} // Блокируем поле, если выбран "Без дедлайна"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="checkbox"
                checked={noDeadline}
                onChange={(e) => setNoDeadline(e.target.checked)}
              />
              <span>Без дедлайна</span>
            </label>
          </div>
          {/* Сообщение об ошибке для поля "Дедлайн" */}
          {errors.deadline && (
            <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>
          )}

          <div className="modal-action mt-6">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
            >
              Отмена
            </button>
            <button type="submit" className="btn btn-success">
              {mode === "edit" ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}