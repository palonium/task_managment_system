import { query } from "../db.js";

// Найти пользователя по email
export const findUserByEmail = async (email) => {
  const { rows } = await query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return rows[0];
};

// Найти пользователя по id
export const findUserById = async (id) => {
  const { rows } = await query(
    `SELECT * FROM users WHERE id = $1`,
    [id]
  );
  return rows[0];
};

// Создать нового пользователя
export const createUser = async (email, hashedPassword) => {
  const { rows } = await query(
    `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email`,
    [email, hashedPassword]
  );
  return rows[0];
};

// Обновить пароль пользователя
export const updatePassword = async (userId, hashedPassword) => {
  const { rows } = await query(
    `UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email`,
    [hashedPassword, userId]
  );
  return rows[0];
};