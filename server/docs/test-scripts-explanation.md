# Giải thích chi tiết các file Unit Test – Content Management

## Yêu cầu đã thực hiện

1. **Detailed comments** – source code dễ hiểu
2. **Comment TC ID** – mỗi test phải ghi rõ Test Case ID tương ứng
3. **Meaningful naming** – tên biến, hàm mô tả rõ ràng
4. **CheckDB** – verify DB thay đổi đúng sau mỗi thao tác
5. **Rollback** – DB phải trở về trạng thái trước test

---

## 1. `server/package.json` – Cấu hình Jest

Thêm 2 scripts và block `jest`:

```json
"test": "jest --verbose --forceExit --detectOpenHandles --runInBand",
"test:coverage": "jest --coverage --verbose --forceExit --detectOpenHandles --runInBand"
```

- `--runInBand`: chạy tuần tự (không parallel) → tránh xung đột DB giữa các test suite
- `--forceExit` + `--detectOpenHandles`: đảm bảo Jest thoát sạch dù MySQL pool còn mở
- `testMatch: ["**/__tests__/**/*.test.js"]`: chỉ quét file `.test.js` trong `__tests__/`

---

## 2. `server/__tests__/setup.js` – Shared Setup

File này cung cấp mọi thứ dùng chung cho 11 test suites:

```javascript
/* Token admin – dùng cho request cần quyền admin */
const ADMIN_TOKEN = generateToken({ id: 99999, role: 'admin', ... });

/* Token student – dùng để test bị từ chối (403) */
const STUDENT_TOKEN = generateToken({ id: 99998, role: 'student', ... });
```

**→ Yêu cầu "Meaningful naming"**: `ADMIN_TOKEN`, `STUDENT_TOKEN` – đọc là hiểu ngay mục đích.

```javascript
/* Tạo Express app gắn crudFactory router */
const createCrudApp = (mountPath, options) => { ... };

/* Tạo Express app gắn custom router (departments, majors) */
const createCustomApp = (mountPath, router) => { ... };
```

**→ Yêu cầu "Meaningful naming"**: `createCrudApp` vs `createCustomApp` – phân biệt rõ 2 loại route.

```javascript
/* Rollback: xóa tất cả bản ghi trong bảng */
const rollbackTable = async (tableName) => {
  await pool.query(`DELETE FROM ${tableName}`);
};
```

**→ Yêu cầu "Rollback"**: helper dùng trong `afterAll()` của mỗi suite.

---

## 3. Các file `.test.js` – Pattern chung

Mỗi file đều tuân theo cùng 1 pattern đáp ứng đủ 5 yêu cầu. Lấy `news.test.js` làm ví dụ:

### ① Detailed comments (header block)

```javascript
/**
 * ============================================================
 * TEST SUITE: News Module (crudFactory – table: news)
 * Test Cases: TC091 → TC096
 * File under test: src/utils/crudFactory.js
 * ============================================================
 *   - TC091: Tạo tin tức hợp lệ              (Chuẩn,  CheckDB ✓, Rollback ✓)
 *   - TC092: Tạo tin tức thiếu title          (Ngoại lệ)
 *   ...
 */
```

→ Đọc header là biết ngay: test file nào, bao nhiêu TC, loại gì, có CheckDB/Rollback không.

### ② Comment TC ID trước mỗi test

```javascript
/* ============================================================
 * TC091 – Tạo tin tức hợp lệ
 * Loại: Chuẩn | CheckDB: Y | Rollback: Y
 * Input:  title, summary, content, image_url (đầy đủ)
 * Expect: HTTP 201, bản ghi mới trong DB
 * ============================================================ */
describe('TC091 – createNews: tạo tin tức hợp lệ', () => {
```

→ Mỗi `describe` block đều có comment block ghi rõ: **TC ID**, loại test, input, expected output, CheckDB/Rollback.

### ③ Meaningful naming

```javascript
// Tên biến mô tả rõ nội dung:
const validNewsPayload = { title: '...', summary: '...', content: '...' };
const missingTitlePayload = { summary: 'Chỉ có tóm tắt' };
const updatedTitle = 'Tiêu đề đã cập nhật TC093';
let createdNewsId;  // lưu id để dùng cho CheckDB & các TC tiếp theo
```

→ Đọc tên biến là biết: `validNewsPayload` = payload hợp lệ, `missingTitlePayload` = payload thiếu title.

### ④ CheckDB – Verify DB sau mỗi thao tác CUD

```javascript
// TC091 – sau khi POST tạo news:
const [dbRows] = await pool.query('SELECT * FROM news WHERE id = ?', [createdNewsId]);
expect(dbRows).toHaveLength(1);              // Có đúng 1 bản ghi
expect(dbRows[0].title).toBe('Tin tức mới'); // Giá trị đúng

// TC093 – sau khi PUT update:
const [dbRows] = await pool.query('SELECT title FROM news WHERE id = ?', [createdNewsId]);
expect(dbRows[0].title).toBe(updatedTitle);  // DB đã cập nhật

// TC094 – sau khi DELETE:
const [dbRows] = await pool.query('SELECT * FROM news WHERE id = ?', [createdNewsId]);
expect(dbRows).toHaveLength(0);              // Bản ghi đã bị xóa
```

→ Không chỉ check HTTP response, mà **query trực tiếp MySQL** để xác nhận DB thay đổi đúng.

### ⑤ Rollback – DB trở về trạng thái trước test

```javascript
// Đầu suite: dọn dữ liệu cũ từ lần chạy trước (nếu có)
beforeAll(async () => {
  await pool.query("DELETE FROM lecturers WHERE lecturer_code LIKE 'TC10%'");
});

// Cuối suite: xóa toàn bộ dữ liệu test đã tạo
afterAll(async () => {
  await rollbackTable('news');  // DELETE FROM news
});
```

→ Đảm bảo: chạy test lần 1 hay lần 100, DB đều sạch trước và sau.

Với departments (có FK phức tạp hơn):

```javascript
afterAll(async () => {
  // Gỡ liên kết GV-BM trước khi xóa (tránh FK constraint)
  if (seedLecturerId) {
    await pool.query('UPDATE lecturers SET department_id = NULL WHERE id = ?', [seedLecturerId]);
    await pool.query('DELETE FROM lecturers WHERE id = ?', [seedLecturerId]);
  }
  if (createdDepartmentId) {
    await pool.query('DELETE FROM departments WHERE id = ?', [createdDepartmentId]);
  }
});
```

---

## 4. Tổng hợp mapping file → yêu cầu

| File test | TC IDs | CheckDB | Rollback | Ghi chú |
|-----------|--------|---------|----------|---------|
| `news.test.js` | TC091–096 | TC091,093,094 | `rollbackTable('news')` | crudFactory route |
| `events.test.js` | TC097–100 | TC097,099,100 | `rollbackTable('events')` | crudFactory route |
| `recruitment.test.js` | TC101–103 | TC101 | `rollbackTable('recruitment_posts')` | crudFactory route |
| `lecturers.test.js` | TC104–108 | TC104,106,107 | `DELETE WHERE lecturer_code LIKE 'TC10%'` | uniqueFields: phone |
| `departments.test.js` | TC109–112 | TC109,111,112 | Manual cleanup FK | custom route, express-validator |
| `research.test.js` | TC113–115 | TC113 | `rollbackTable('research_projects')` | crudFactory route |
| `student-documents.test.js` | TC116–120 | TC116,119,120 | `rollbackTable('student_documents')` | crudFactory route |
| `majors.test.js` | TC121–124 | TC121,123 | Manual cleanup courses→majors | custom route, FK |
| `auth-middleware.test.js` | TC125–126 | N/A | N/A | Không cần DB |
| `pagination.test.js` | TC127–128 | N/A | `rollbackTable('news')` | Seed 10 rows trước |
| `admissions.test.js` | TC129–130 | TC129 | `rollbackTable('admissions')` | crudFactory route |
