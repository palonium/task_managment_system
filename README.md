# task_managment_system
## **Technologies Used:**
- **Frontend:**
    - React (Vite)
    - Daisy UI
    - Tailwind CSS

- **Backend:**
    - Node.js with Express.js
    - JSON Web Token (JWT) для авторизации и регистрации
    
- **Database:**
    - PostgreSQL


## Предварительные требования
- Установленный [Node.js](https://nodejs.org/) (версии 14+ или 16+).  
- Установленная [PostgreSQL](https://www.postgresql.org/) (порт по умолчанию — 5432).  
- Браузер для проверки фронтенда.
## Склонируйте репозиторий

## Настройка бэкенда
1. Перейдите в директорию `crud-backend`:
    ```bash
    cd crud-backend
    ```
2. Создайте файл `.env` и укажите в нём следующие параметры:
    - `JWT_SECRET`: секретный ключ для подписи токенов.
    - `PG_USER`: имя пользователя базы данных. Обычно это postgres (по умолчанию в PostgreSQL).
    - `PG_HOST`: локальный хост для подключения к базе данных. Обычно используется localhost.
    - `PG_DATABASE`: имя базы данных, созданной для вашего проекта, у меня tasks_db.
    - `PG_PASSWORD`: пароль для подключения к базе данных.
    - `PG_PORT`: порт для подключения к базе данных. Стандартное значение — 5432.
3. Установите зависимости и запустите сервер:
    ```bash
    npm install
    npx nodemon src/index.js
    ```
4. Работы сервера можно проверить на http://localhost:3000/api/tasks

## Настройка БД
**Таблица: `users`**

Таблица `users` хранит информацию о пользователях системы.

### Схема

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,                        -- Уникальный идентификатор пользователя
    email VARCHAR(255) UNIQUE NOT NULL,           -- Уникальный email пользователя
    password VARCHAR(255) NOT NULL,               -- Пароль пользователя (хэшированный)
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),  -- Время создания пользователя
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()   -- Время последнего обновления пользователя
);
```
**Таблица: `tasks`**

Таблица `tasks` хранит информацию о заданиях.
```sql
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,                          -- Уникальный идентификатор задачи
    title VARCHAR(255) NOT NULL,                    -- Название задачи
    description TEXT,                               -- Подробное описание задачи
    status VARCHAR(20) NOT NULL DEFAULT 'новая',    -- Статус задачи (например, 'новая', 'в процессе', 'завершена')
    priority VARCHAR(20) NOT NULL DEFAULT 'средний',-- Приоритет задачи (например, 'низкий', 'средний', 'высокий')
    deadline TIMESTAMP,                             -- Срок выполнения задачи (может быть NULL)
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),    -- Время создания задачи
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),    -- Время последнего обновления задачи
    user_id INTEGER NOT NULL,                       -- Внешний ключ, связывающий задачу с пользователем
    CONSTRAINT fk_user FOREIGN KEY (user_id)        -- Ограничение внешнего ключа
        REFERENCES users(id)
        ON DELETE CASCADE                           -- Удаление задач, если пользователь удалён
        ON UPDATE CASCADE
);
```
**Трииггер и функция для `updated_at`

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW(); -- Устанавливает значение поля updated_at на текущее время
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

  CREATE TRIGGER set_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_user_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

## Настройка фронтенда
1. Перейдите в директорию `crud-frontend`:
    ```bash
    cd ../frontend
    ```
2. Установите зависимости
   ```bash
   npm install
   ```
3. Запуск
   ```bash
   npm run dev
   ```
4. Откройте в браузере: http://localhost:5173/
   
