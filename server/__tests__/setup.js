/**
 * ============================================================
 * SHARED TEST SETUP – Content Management Module
 * ============================================================
 * Cung cấp:
 *   - Kết nối MySQL pool dùng chung cho tất cả test suites
 *   - JWT token cho admin và student (dùng để test auth)
 *   - Helper: tạo Express app với crudFactory hoặc custom router
 *   - Helper: rollback (xóa dữ liệu test) đảm bảo DB sạch sau test
 * ============================================================
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../src/config/db');
const buildCrudRouter = require('../src/utils/crudFactory');
const authGuard = require('../src/middleware/auth');
const errorHandler = require('../src/middleware/errorHandler');

/* ---------- JWT Secret (giống server.js / auth.js) ---------- */
const JWT_SECRET = process.env.JWT_SECRET || 'fit-secret';

/* ---------- Token helpers ---------- */

/** Tạo JWT token với payload tùy ý */
const generateToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

/** Token admin hợp lệ – dùng cho các request cần quyền admin */
const ADMIN_TOKEN = generateToken({
  id: 99999,
  role: 'admin',
  email: 'testadmin@ptit.edu.vn',
});

/** Token student – dùng để test trường hợp bị từ chối (403) */
const STUDENT_TOKEN = generateToken({
  id: 99998,
  role: 'student',
  email: 'teststudent@ptit.edu.vn',
});

/* ---------- App factory ---------- */

/**
 * Tạo Express app gắn crudFactory router cho 1 resource.
 * Dùng cho các test của news, events, recruitment, lecturers, research,
 * student-documents, admissions (tất cả đi qua crudFactory).
 *
 * @param {string} mountPath  – VD: '/api/news'
 * @param {object} options    – Truyền thẳng vào buildCrudRouter
 * @returns {express.Application}
 */
const createCrudApp = (mountPath, options) => {
  const app = express();
  app.use(express.json());
  app.use(mountPath, buildCrudRouter({ ...options, authGuard }));
  app.use(errorHandler);
  return app;
};

/**
 * Tạo Express app gắn custom router (departments, majors).
 *
 * @param {string} mountPath – VD: '/api/departments'
 * @param {Router} router    – Express router đã require
 * @returns {express.Application}
 */
const createCustomApp = (mountPath, router) => {
  const app = express();
  app.use(express.json());
  app.use(mountPath, router);
  app.use(errorHandler);
  return app;
};

/* ---------- Rollback helpers ---------- */

/**
 * Rollback: Xóa tất cả bản ghi trong bảng chỉ định.
 * Gọi trong afterAll() để đảm bảo DB trở về trạng thái trước test.
 *
 * @param {string} tableName – Tên bảng cần rollback
 */
const rollbackTable = async (tableName) => {
  await pool.query(`DELETE FROM ${tableName}`);
};

/**
 * Rollback: Xóa 1 bản ghi theo id.
 *
 * @param {string} tableName
 * @param {number} id
 */
const rollbackById = async (tableName, id) => {
  await pool.query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
};

/** Đóng pool – gọi 1 lần duy nhất ở file cuối cùng chạy */
const closePool = async () => {
  await pool.end();
};

/* ---------- Exports ---------- */
module.exports = {
  pool,
  ADMIN_TOKEN,
  STUDENT_TOKEN,
  generateToken,
  createCrudApp,
  createCustomApp,
  rollbackTable,
  rollbackById,
  closePool,
};
