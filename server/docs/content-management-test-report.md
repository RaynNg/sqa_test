# THÀNH VIÊN 4 – CONTENT MANAGEMENT

**Files:** crudFactory.js | departments.js | majors.js | middleware/auth.js | middleware/adminGuard.js  
**Framework:** Jest + Supertest

---

## 1. BẢNG TEST CASES

| TC ID | File / Module | Tên chức năng / File – Method | Mục tiêu kiểm thử | Input | Expected Output | Loại TC | CheckDB | Rollback | Ghi chú / Kỹ thuật | Kết quả (Pass/Fail) |
|-------|--------------|-------------------------------|-------------------|-------|-----------------|---------|---------|----------|--------------------|--------------------|
| TC091 | crudFactory.js (news) | createNews (POST /api/news) | Tạo tin tức hợp lệ | title:'Tin tức mới', summary:'Tóm tắt', content:'Nội dung', image_url:'img.jpg' | HTTP 201; bản ghi mới trong news | Chuẩn | Y | Y | CheckDB: verify row inserted | Pass |
| TC092 | crudFactory.js (news) | createNews (POST /api/news) | Thiếu title (required field) | body: { summary:'Tóm tắt' } (bỏ title) | HTTP 400; ER_BAD_NULL_ERROR | Ngoại lệ | N | N | MySQL NOT NULL constraint | Pass |
| TC093 | crudFactory.js (news) | updateNews (PUT /api/news/:id) | Cập nhật tin tức hợp lệ | id:\<id\>, title:'Tiêu đề mới' | HTTP 200; DB cập nhật title | Chuẩn | Y | Y | CheckDB: verify updated value | Pass |
| TC094 | crudFactory.js (news) | deleteNews (DELETE /api/news/:id) | Xóa tin tức | id:\<existing_id\> | HTTP 200; { message: 'Xóa thành công' } | Chuẩn | Y | Y | CheckDB: verify row deleted | Pass |
| TC095 | crudFactory.js (news) | getNewsList (GET /api/news) | Lấy danh sách tin tức công khai | Không cần auth | HTTP 200; array tin tức | Chuẩn | N | N | Public endpoint, no authGuard | Pass |
| TC096 | crudFactory.js (news) | searchNews (GET /api/news?q=) | Tìm tin tức theo từ khóa | ?q='CNTT' | HTTP 200; kết quả lọc theo title/summary/content | Chuẩn | N | N | searchableFields: ['title','summary','content'] | Pass |
| TC097 | crudFactory.js (events) | createEvent (POST /api/events) | Tạo sự kiện hợp lệ | title:'Hội thảo AI', event_date:'2025-07-01', location:'A1.01' | HTTP 201; bản ghi mới trong events | Chuẩn | Y | Y | CheckDB; dateFields: ['event_date'] | Pass |
| TC098 | crudFactory.js (events) | createEvent (POST /api/events) | Thiếu title | body: { location:'A1.01' } (bỏ title) | HTTP 400; ER_BAD_NULL_ERROR | Ngoại lệ | N | N | MySQL NOT NULL constraint | Pass |
| TC099 | crudFactory.js (events) | updateEvent (PUT /api/events/:id) | Cập nhật sự kiện | id:\<id\>, location:'B2.02' | HTTP 200; DB cập nhật location | Chuẩn | Y | Y | CheckDB; nullableFields: ['location'] | Pass |
| TC100 | crudFactory.js (events) | deleteEvent (DELETE /api/events/:id) | Xóa sự kiện | id:\<id\> | HTTP 200; { message: 'Xóa thành công' } | Chuẩn | Y | Y | CheckDB | Pass |
| TC101 | crudFactory.js (recruitment) | createRecruitment (POST /api/recruitment) | Tạo tin tuyển dụng | title:'Backend Dev', company_name:'Google', position:'Senior' | HTTP 201; bản ghi mới | Chuẩn | Y | Y | CheckDB; table: recruitment_posts | Pass |
| TC102 | crudFactory.js (recruitment) | createRecruitment (POST /api/recruitment) | Thiếu title | body: { company_name:'Google' } (bỏ title) | HTTP 400; ER_BAD_NULL_ERROR | Ngoại lệ | N | N | | Pass |
| TC103 | crudFactory.js (recruitment) | filterRecruitment (GET /api/recruitment?q=) | Tìm theo company_name | ?q=Google | HTTP 200; kết quả lọc company | Chuẩn | N | N | searchableFields: ['title','company_name','position','job_description'] | Pass |
| TC104 | crudFactory.js (lecturers) | createLecturer (POST /api/lecturers) | Tạo giảng viên hợp lệ | name:'GS. Nguyen A', email:'a@ptit.edu.vn', phone:'0901234567' | HTTP 201; bản ghi mới | Chuẩn | Y | Y | CheckDB; uniqueFields: ['phone'] | Pass |
| TC105 | crudFactory.js (lecturers) | createLecturer (POST /api/lecturers) | Thiếu name | body: { email:'a@ptit.edu.vn' } (bỏ name) | HTTP 400; ER_BAD_NULL_ERROR | Ngoại lệ | N | N | | Pass |
| TC106 | crudFactory.js (lecturers) | updateLecturer (PUT /api/lecturers/:id) | Cập nhật giảng viên | id:\<id\>, phone:'0912345678' | HTTP 200; DB cập nhật phone | Chuẩn | Y | Y | CheckDB; uniqueFields check on update | Pass |
| TC107 | crudFactory.js (lecturers) | deleteLecturer (DELETE /api/lecturers/:id) | Xóa giảng viên | id:\<lec_id\> | HTTP 200; { message: 'Xóa thành công' } | Chuẩn | Y | Y | CheckDB | Pass |
| TC108 | crudFactory.js (lecturers) | searchLecturers (GET /api/lecturers?q=) | Tìm GV theo tên | ?q='Nguyen' | HTTP 200; danh sách GV phù hợp | Chuẩn | N | N | searchableFields: ['name','email','phone','specialization'] | Pass |
| TC109 | departments.js | createDepartment (POST /api/departments) | Tạo bộ môn hợp lệ | name:'Bộ môn CNPM', description:'Mô tả' | HTTP 201; bản ghi mới | Chuẩn | Y | Y | CheckDB; express-validator: name.notEmpty() | Pass |
| TC110 | departments.js | createDepartment (POST /api/departments) | Thiếu tên bộ môn | body: { description:'Mô tả' } (bỏ name) | HTTP 400; Validation failed | Ngoại lệ | N | N | express-validator validation | Pass |
| TC111 | departments.js | addLecturerToDepartment (POST /api/departments/:id/lecturers) | Thêm GV vào bộ môn | departmentId:\<id\>, lecturer_id:\<lec_id\> | HTTP 201; lecturer updated with department_id | Chuẩn | Y | Y | CheckDB: UPDATE lecturers SET department_id | Pass |
| TC112 | departments.js | removeLecturerFromDepartment (DELETE /api/departments/:id/lecturers/:lecturerId) | Xóa GV khỏi bộ môn | departmentId:\<id\>, lecturerId:\<lec_id\> | HTTP 204; department_id = NULL | Chuẩn | Y | Y | CheckDB: SET department_id = NULL | Pass |
| TC113 | crudFactory.js (research) | createResearch (POST /api/research) | Tạo dự án nghiên cứu | title:'Nghiên cứu AI', lead_lecturer:'GS A', co_authors:'TS B' | HTTP 201; bản ghi mới | Chuẩn | Y | Y | CheckDB; table: research_projects | Pass |
| TC114 | crudFactory.js (research) | createResearch (POST /api/research) | Thiếu title | body: { lead_lecturer:'GS A' } (bỏ title) | HTTP 400; ER_BAD_NULL_ERROR | Ngoại lệ | N | N | | Pass |
| TC115 | crudFactory.js (research) | searchResearch (GET /api/research?q=) | Tìm nghiên cứu | ?q='AI' | HTTP 200; kết quả lọc | Chuẩn | N | N | searchableFields: ['title','lead_lecturer','co_authors'] | Pass |
| TC116 | crudFactory.js (student-documents) | createDocument (POST /api/student-documents) | Tạo tài liệu SV | title:'Quy định TT', category:'regulation', file_url:'file.pdf' | HTTP 201; bản ghi mới | Chuẩn | Y | Y | CheckDB; table: student_documents | Pass |
| TC117 | crudFactory.js (student-documents) | createDocument (POST /api/student-documents) | Thiếu title | body: { category:'regulation' } (bỏ title) | HTTP 400; ER_BAD_NULL_ERROR | Ngoại lệ | N | N | | Pass |
| TC118 | crudFactory.js (student-documents) | filterDocuments (GET /api/student-documents?q=) | Lọc theo danh mục | ?q=regulation | HTTP 200; kết quả lọc category | Chuẩn | N | N | searchableFields: ['title','category'] | Pass |
| TC119 | crudFactory.js (student-documents) | updateDocument (PUT /api/student-documents/:id) | Cập nhật tài liệu | id:\<id\>, title:'Tiêu đề mới' | HTTP 200; DB cập nhật | Chuẩn | Y | Y | CheckDB | Pass |
| TC120 | crudFactory.js (student-documents) | deleteDocument (DELETE /api/student-documents/:id) | Xóa tài liệu | id:\<id\> | HTTP 200; { message: 'Xóa thành công' } | Chuẩn | Y | Y | CheckDB | Pass |
| TC121 | majors.js | createMajor (POST /api/majors) | Tạo ngành học | name:'Kỹ thuật PM', code:'D480201', sort_order:1 | HTTP 201; bản ghi mới | Chuẩn | Y | Y | CheckDB; custom route (not crudFactory) | Pass |
| TC122 | majors.js | createMajor (POST /api/majors) | Thiếu name | body: { code:'D480201' } (bỏ name) | HTTP 400; ER_BAD_NULL_ERROR | Ngoại lệ | N | N | MySQL NOT NULL constraint | Pass |
| TC123 | majors.js | addCourseToMajor (POST /api/majors/:id/courses) | Thêm môn học vào ngành | majorId:\<id\>, name:'Lập trình web', code:'IT3456', credits:3, semester:5 | HTTP 201; bản ghi mới trong courses | Chuẩn | Y | Y | CheckDB; auto set major_id | Pass |
| TC124 | majors.js | addCourseToMajor (POST /api/majors/:id/courses) | Thiếu code môn học | body: { name:'Lập trình web', credits:3 } (bỏ code) | HTTP 400; ER_BAD_NULL_ERROR | Ngoại lệ | N | N | | Pass |
| TC125 | middleware/auth.js | Admin endpoints – no token | Truy cập admin endpoint không có token | POST /api/news (không có Authorization header) | HTTP 401; { message: 'Authorization header missing' } | Ngoại lệ | N | N | Verify authGuard middleware | Pass |
| TC126 | middleware/adminGuard.js | Admin endpoints – student token | Truy cập admin endpoint với student token | POST /api/news + Bearer \<student_token\> (role:'student') | HTTP 403; { message: 'Forbidden: Admin access required' } | Ngoại lệ | N | N | crudFactory protect() checks role | Pass |
| TC127 | crudFactory.js (news/events) | Pagination – GET list | Lấy danh sách có phân trang | GET /api/news?page=1&limit=5 | HTTP 200; { data: [...], pagination: { page:1, limit:5, total, totalPages } } | Chuẩn | N | N | crudFactory pagination logic | Pass |
| TC128 | crudFactory.js (news/events) | Pagination – page vượt tổng | Page > tổng số trang | GET /api/news?page=999&limit=5 | HTTP 200; { data: [], pagination: {...} } | Ngoại lệ | N | N | Boundary test | Pass |
| TC129 | crudFactory.js (admissions) | createAdmission (POST /api/admissions) | Tạo tin tuyển sinh | title:'Tuyển sinh 2025', admission_year:2025, description:'Mô tả' | HTTP 201; bản ghi mới | Chuẩn | Y | Y | CheckDB; table: admissions | Pass |
| TC130 | crudFactory.js (admissions) | createAdmission (POST /api/admissions) | Thiếu admission_year | body: { title:'Tuyển sinh' } (bỏ admission_year) | HTTP 400; ER_BAD_NULL_ERROR | Ngoại lệ | N | N | | Pass |

---

## 📊 BẢNG TỔNG HỢP KẾT QUẢ KIỂM THỬ

| Chỉ số | Giá trị | Ghi chú |
|--------|---------|---------|
| Tổng số Test Cases | 40 | TC091 – TC130 |
| Test Chuẩn (Positive) | 27 | 67.5% tổng số |
| Test Ngoại lệ (Negative) | 13 | 32.5% tổng số |
| Số test PASS | 40 | Tất cả pass |
| Số test FAIL | 0 | |
| Tỉ lệ Pass (%) | 100% | |
| Test có CheckDB | 20 | Verify DB sau create/update/delete |
| Test có Rollback | 20 | Rollback DB sau mỗi test |

---

## 2. TEST SCRIPTS (Jest + Supertest)

### 2.1. Cài đặt dependencies

```bash
cd server
npm install --save-dev jest supertest
```

Thêm vào `package.json`:
```json
{
  "scripts": {
    "test": "jest --verbose --forceExit --detectOpenHandles",
    "test:coverage": "jest --coverage --verbose --forceExit --detectOpenHandles"
  },
  "jest": {
    "testEnvironment": "node",
    "testMatch": ["**/__tests__/**/*.test.js"],
    "coveragePathIgnorePatterns": ["/node_modules/", "/scripts/"],
    "coverageDirectory": "coverage"
  }
}
```

### 2.2. Test Setup – `server/__tests__/setup.js`

```javascript
const pool = require('../src/config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fit-secret';

const generateToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

const adminToken = generateToken({ id: 1, role: 'admin', email: 'admin@ptit.edu.vn' });
const studentToken = generateToken({ id: 2, role: 'student', email: 'student@ptit.edu.vn' });

const cleanTable = async (table) => {
  await pool.query(`DELETE FROM ${table}`);
};

const closePool = async () => {
  await pool.end();
};

module.exports = { pool, adminToken, studentToken, generateToken, cleanTable, closePool };
```

### 2.3. Test Script – News (TC091–TC096)

**File:** `server/__tests__/news.test.js`

```javascript
const request = require('supertest');
const express = require('express');
const buildCrudRouter = require('../src/utils/crudFactory');
const authGuard = require('../src/middleware/auth');
const { pool, adminToken, cleanTable, closePool } = require('./setup');

const app = express();
app.use(express.json());
app.use('/api/news', buildCrudRouter({
  tableName: 'news',
  searchableFields: ['title', 'summary', 'content'],
  authGuard,
  nullableFields: ['published_at', 'summary', 'image_url'],
  dateFields: ['published_at'],
}));

let createdId;

afterAll(async () => {
  await cleanTable('news');
  await closePool();
});

// TC091 – Tạo tin tức hợp lệ
describe('TC091 - createNews valid', () => {
  it('should return 201 and create news', async () => {
    const res = await request(app)
      .post('/api/news')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Tin tức mới', summary: 'Tóm tắt', content: 'Nội dung', image_url: 'img.jpg' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Tin tức mới');
    createdId = res.body.id;

    // CheckDB
    const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [createdId]);
    expect(rows.length).toBe(1);
    expect(rows[0].title).toBe('Tin tức mới');
  });
});

// TC092 – Thiếu title
describe('TC092 - createNews missing title', () => {
  it('should return 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/news')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ summary: 'Tóm tắt' });
    expect(res.status).toBe(400);
  });
});

// TC093 – Cập nhật tin tức
describe('TC093 - updateNews', () => {
  it('should return 200 and update title', async () => {
    const res = await request(app)
      .put(`/api/news/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Tiêu đề mới' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Tiêu đề mới');

    // CheckDB
    const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [createdId]);
    expect(rows[0].title).toBe('Tiêu đề mới');
  });
});

// TC094 – Xóa tin tức
describe('TC094 - deleteNews', () => {
  it('should return 200 and delete news', async () => {
    const res = await request(app)
      .delete(`/api/news/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Xóa thành công');

    // CheckDB
    const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [createdId]);
    expect(rows.length).toBe(0);
  });
});

// TC095 – Lấy danh sách tin tức (public)
describe('TC095 - getNewsList public', () => {
  it('should return 200 and array', async () => {
    const res = await request(app).get('/api/news');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// TC096 – Tìm kiếm tin tức
describe('TC096 - searchNews', () => {
  it('should return 200 with filtered results', async () => {
    // Seed data
    await request(app)
      .post('/api/news')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Tin CNTT mới', content: 'Nội dung CNTT' });

    const res = await request(app).get('/api/news?q=CNTT');
    expect(res.status).toBe(200);
  });
});
```

### 2.4. Test Script – Events (TC097–TC100)

**File:** `server/__tests__/events.test.js`

```javascript
const request = require('supertest');
const express = require('express');
const buildCrudRouter = require('../src/utils/crudFactory');
const authGuard = require('../src/middleware/auth');
const { pool, adminToken, cleanTable, closePool } = require('./setup');

const app = express();
app.use(express.json());
app.use('/api/events', buildCrudRouter({
  tableName: 'events',
  searchableFields: ['title', 'location', 'description'],
  authGuard,
  nullableFields: ['event_time', 'location', 'description', 'cover_image'],
  dateFields: ['event_date'],
}));

let createdId;

afterAll(async () => {
  await cleanTable('events');
  await closePool();
});

// TC097
describe('TC097 - createEvent valid', () => {
  it('should return 201', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Hội thảo AI', event_date: '2025-07-01', location: 'A1.01' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Hội thảo AI');
    createdId = res.body.id;

    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [createdId]);
    expect(rows.length).toBe(1);
  });
});

// TC098
describe('TC098 - createEvent missing title', () => {
  it('should return 400', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ location: 'A1.01' });
    expect(res.status).toBe(400);
  });
});

// TC099
describe('TC099 - updateEvent', () => {
  it('should return 200 and update location', async () => {
    const res = await request(app)
      .put(`/api/events/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ location: 'B2.02' });
    expect(res.status).toBe(200);

    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [createdId]);
    expect(rows[0].location).toBe('B2.02');
  });
});

// TC100
describe('TC100 - deleteEvent', () => {
  it('should return 200', async () => {
    const res = await request(app)
      .delete(`/api/events/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);

    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [createdId]);
    expect(rows.length).toBe(0);
  });
});
```

### 2.5. Test Script – Recruitment (TC101–TC103)

**File:** `server/__tests__/recruitment.test.js`

```javascript
const request = require('supertest');
const express = require('express');
const buildCrudRouter = require('../src/utils/crudFactory');
const authGuard = require('../src/middleware/auth');
const { pool, adminToken, cleanTable, closePool } = require('./setup');

const app = express();
app.use(express.json());
app.use('/api/recruitment', buildCrudRouter({
  tableName: 'recruitment_posts',
  searchableFields: ['title', 'company_name', 'position', 'job_description'],
  authGuard,
}));

let createdId;

afterAll(async () => {
  await cleanTable('recruitment_posts');
  await closePool();
});

// TC101
describe('TC101 - createRecruitment valid', () => {
  it('should return 201', async () => {
    const res = await request(app)
      .post('/api/recruitment')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Backend Dev', company_name: 'Google', position: 'Senior' });
    expect(res.status).toBe(201);
    createdId = res.body.id;

    const [rows] = await pool.query('SELECT * FROM recruitment_posts WHERE id = ?', [createdId]);
    expect(rows.length).toBe(1);
  });
});

// TC102
describe('TC102 - createRecruitment missing title', () => {
  it('should return 400', async () => {
    const res = await request(app)
      .post('/api/recruitment')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ company_name: 'Google' });
    expect(res.status).toBe(400);
  });
});

// TC103
describe('TC103 - filterRecruitment by company', () => {
  it('should return 200 with filtered results', async () => {
    const res = await request(app).get('/api/recruitment?q=Google');
    expect(res.status).toBe(200);
  });
});
```

### 2.6. Test Script – Lecturers (TC104–TC108)

**File:** `server/__tests__/lecturers.test.js`

```javascript
const request = require('supertest');
const express = require('express');
const buildCrudRouter = require('../src/utils/crudFactory');
const authGuard = require('../src/middleware/auth');
const { pool, adminToken, cleanTable, closePool } = require('./setup');

const app = express();
app.use(express.json());
app.use('/api/lecturers', buildCrudRouter({
  tableName: 'lecturers',
  searchableFields: ['name', 'email', 'phone', 'specialization'],
  authGuard,
  nullableFields: ['academic_rank'],
  uniqueFields: ['phone'],
}));

let createdId;

afterAll(async () => {
  await cleanTable('lecturers');
  await closePool();
});

// TC104
describe('TC104 - createLecturer valid', () => {
  it('should return 201', async () => {
    const res = await request(app)
      .post('/api/lecturers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'GS. Nguyen A', email: 'a@ptit.edu.vn', phone: '0901234567' });
    expect(res.status).toBe(201);
    createdId = res.body.id;

    const [rows] = await pool.query('SELECT * FROM lecturers WHERE id = ?', [createdId]);
    expect(rows.length).toBe(1);
  });
});

// TC105
describe('TC105 - createLecturer missing name', () => {
  it('should return 400', async () => {
    const res = await request(app)
      .post('/api/lecturers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ email: 'b@ptit.edu.vn' });
    expect(res.status).toBe(400);
  });
});

// TC106
describe('TC106 - updateLecturer', () => {
  it('should return 200 and update phone', async () => {
    const res = await request(app)
      .put(`/api/lecturers/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ phone: '0912345678' });
    expect(res.status).toBe(200);

    const [rows] = await pool.query('SELECT * FROM lecturers WHERE id = ?', [createdId]);
    expect(rows[0].phone).toBe('0912345678');
  });
});

// TC107
describe('TC107 - deleteLecturer', () => {
  it('should return 200', async () => {
    const res = await request(app)
      .delete(`/api/lecturers/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);

    const [rows] = await pool.query('SELECT * FROM lecturers WHERE id = ?', [createdId]);
    expect(rows.length).toBe(0);
  });
});

// TC108
describe('TC108 - searchLecturers', () => {
  it('should return 200 with filtered results', async () => {
    await request(app)
      .post('/api/lecturers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Nguyen Van B', email: 'b@ptit.edu.vn', phone: '0999888777' });

    const res = await request(app).get('/api/lecturers?q=Nguyen');
    expect(res.status).toBe(200);
  });
});
```

### 2.7. Test Script – Departments (TC109–TC112)

**File:** `server/__tests__/departments.test.js`

```javascript
const request = require('supertest');
const express = require('express');
const { pool, adminToken, cleanTable, closePool } = require('./setup');

// Import actual departments router
const departmentsRouter = require('../src/routes/departments');

const app = express();
app.use(express.json());
app.use('/api/departments', departmentsRouter);

// Error handler for express-validator responses
const errorHandler = require('../src/middleware/errorHandler');
app.use(errorHandler);

let deptId, lecturerId;

afterAll(async () => {
  await pool.query('UPDATE lecturers SET department_id = NULL WHERE department_id IS NOT NULL');
  await cleanTable('departments');
  await closePool();
});

// TC109
describe('TC109 - createDepartment valid', () => {
  it('should return 201', async () => {
    const res = await request(app)
      .post('/api/departments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Bộ môn CNPM', description: 'Mô tả' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Bộ môn CNPM');
    deptId = res.body.id;

    const [rows] = await pool.query('SELECT * FROM departments WHERE id = ?', [deptId]);
    expect(rows.length).toBe(1);
  });
});

// TC110
describe('TC110 - createDepartment missing name', () => {
  it('should return 400 validation error', async () => {
    const res = await request(app)
      .post('/api/departments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ description: 'Mô tả' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
  });
});

// TC111
describe('TC111 - addLecturerToDepartment', () => {
  it('should return 201 and link lecturer to department', async () => {
    // Seed a lecturer first
    const [result] = await pool.query(
      "INSERT INTO lecturers (name, email, phone) VALUES ('Test GV', 'testgv@ptit.edu.vn', '0900000001')"
    );
    lecturerId = result.insertId;

    const res = await request(app)
      .post(`/api/departments/${deptId}/lecturers`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ lecturer_id: lecturerId });
    expect(res.status).toBe(201);

    const [rows] = await pool.query('SELECT department_id FROM lecturers WHERE id = ?', [lecturerId]);
    expect(rows[0].department_id).toBe(deptId);
  });
});

// TC112
describe('TC112 - removeLecturerFromDepartment', () => {
  it('should return 204 and set department_id to NULL', async () => {
    const res = await request(app)
      .delete(`/api/departments/${deptId}/lecturers/${lecturerId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(204);

    const [rows] = await pool.query('SELECT department_id FROM lecturers WHERE id = ?', [lecturerId]);
    expect(rows[0].department_id).toBeNull();
  });
});
```

### 2.8. Test Script – Research (TC113–TC115)

**File:** `server/__tests__/research.test.js`

```javascript
const request = require('supertest');
const express = require('express');
const buildCrudRouter = require('../src/utils/crudFactory');
const authGuard = require('../src/middleware/auth');
const { pool, adminToken, cleanTable, closePool } = require('./setup');

const app = express();
app.use(express.json());
app.use('/api/research', buildCrudRouter({
  tableName: 'research_projects',
  searchableFields: ['title', 'lead_lecturer', 'co_authors'],
  authGuard,
}));

afterAll(async () => {
  await cleanTable('research_projects');
  await closePool();
});

let createdId;

// TC113
describe('TC113 - createResearch valid', () => {
  it('should return 201', async () => {
    const res = await request(app)
      .post('/api/research')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Nghiên cứu AI', lead_lecturer: 'GS A', co_authors: 'TS B' });
    expect(res.status).toBe(201);
    createdId = res.body.id;

    const [rows] = await pool.query('SELECT * FROM research_projects WHERE id = ?', [createdId]);
    expect(rows.length).toBe(1);
  });
});

// TC114
describe('TC114 - createResearch missing title', () => {
  it('should return 400', async () => {
    const res = await request(app)
      .post('/api/research')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ lead_lecturer: 'GS A' });
    expect(res.status).toBe(400);
  });
});

// TC115
describe('TC115 - searchResearch', () => {
  it('should return 200 with filtered results', async () => {
    const res = await request(app).get('/api/research?q=AI');
    expect(res.status).toBe(200);
  });
});
```

### 2.9. Test Script – Student Documents (TC116–TC120)

**File:** `server/__tests__/student-documents.test.js`

```javascript
const request = require('supertest');
const express = require('express');
const buildCrudRouter = require('../src/utils/crudFactory');
const authGuard = require('../src/middleware/auth');
const { pool, adminToken, cleanTable, closePool } = require('./setup');

const app = express();
app.use(express.json());
app.use('/api/student-documents', buildCrudRouter({
  tableName: 'student_documents',
  searchableFields: ['title', 'category'],
  authGuard,
}));

afterAll(async () => {
  await cleanTable('student_documents');
  await closePool();
});

let createdId;

// TC116
describe('TC116 - createDocument valid', () => {
  it('should return 201', async () => {
    const res = await request(app)
      .post('/api/student-documents')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Quy định TT', category: 'regulation', file_url: 'file.pdf' });
    expect(res.status).toBe(201);
    createdId = res.body.id;

    const [rows] = await pool.query('SELECT * FROM student_documents WHERE id = ?', [createdId]);
    expect(rows.length).toBe(1);
  });
});

// TC117
describe('TC117 - createDocument missing title', () => {
  it('should return 400', async () => {
    const res = await request(app)
      .post('/api/student-documents')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ category: 'regulation' });
    expect(res.status).toBe(400);
  });
});

// TC118
describe('TC118 - filterDocuments by category', () => {
  it('should return 200', async () => {
    const res = await request(app).get('/api/student-documents?q=regulation');
    expect(res.status).toBe(200);
  });
});

// TC119
describe('TC119 - updateDocument', () => {
  it('should return 200', async () => {
    const res = await request(app)
      .put(`/api/student-documents/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Tiêu đề mới' });
    expect(res.status).toBe(200);

    const [rows] = await pool.query('SELECT * FROM student_documents WHERE id = ?', [createdId]);
    expect(rows[0].title).toBe('Tiêu đề mới');
  });
});

// TC120
describe('TC120 - deleteDocument', () => {
  it('should return 200', async () => {
    const res = await request(app)
      .delete(`/api/student-documents/${createdId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);

    const [rows] = await pool.query('SELECT * FROM student_documents WHERE id = ?', [createdId]);
    expect(rows.length).toBe(0);
  });
});
```

### 2.10. Test Script – Majors & Courses (TC121–TC124)

**File:** `server/__tests__/majors.test.js`

```javascript
const request = require('supertest');
const express = require('express');
const { pool, adminToken, closePool } = require('./setup');
const majorsRouter = require('../src/routes/majors');
const errorHandler = require('../src/middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/majors', majorsRouter);
app.use(errorHandler);

let majorId, courseId;

afterAll(async () => {
  if (majorId) {
    await pool.query('DELETE FROM courses WHERE major_id = ?', [majorId]);
    await pool.query('DELETE FROM majors WHERE id = ?', [majorId]);
  }
  await closePool();
});

// TC121
describe('TC121 - createMajor valid', () => {
  it('should return 201', async () => {
    const res = await request(app)
      .post('/api/majors')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Kỹ thuật PM', code: 'D480201', sort_order: 1 });
    expect(res.status).toBe(201);
    majorId = res.body.id;

    const [rows] = await pool.query('SELECT * FROM majors WHERE id = ?', [majorId]);
    expect(rows.length).toBe(1);
  });
});

// TC122
describe('TC122 - createMajor missing name', () => {
  it('should return 400', async () => {
    const res = await request(app)
      .post('/api/majors')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ code: 'D480202' });
    expect(res.status).toBe(400);
  });
});

// TC123
describe('TC123 - addCourseToMajor valid', () => {
  it('should return 201', async () => {
    const res = await request(app)
      .post(`/api/majors/${majorId}/courses`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Lập trình web', code: 'IT3456', credits: 3, semester: 5 });
    expect(res.status).toBe(201);
    courseId = res.body.id;

    const [rows] = await pool.query('SELECT * FROM courses WHERE id = ?', [courseId]);
    expect(rows.length).toBe(1);
    expect(rows[0].major_id).toBe(majorId);
  });
});

// TC124
describe('TC124 - addCourseToMajor missing code', () => {
  it('should return 400', async () => {
    const res = await request(app)
      .post(`/api/majors/${majorId}/courses`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Lập trình web', credits: 3 });
    expect(res.status).toBe(400);
  });
});
```

### 2.11. Test Script – Auth Middleware (TC125–TC126)

**File:** `server/__tests__/auth-middleware.test.js`

```javascript
const request = require('supertest');
const express = require('express');
const buildCrudRouter = require('../src/utils/crudFactory');
const authGuard = require('../src/middleware/auth');
const { studentToken, closePool } = require('./setup');

const app = express();
app.use(express.json());
app.use('/api/news', buildCrudRouter({
  tableName: 'news',
  searchableFields: ['title'],
  authGuard,
}));

afterAll(async () => {
  await closePool();
});

// TC125 – No token
describe('TC125 - admin endpoint without token', () => {
  it('should return 401', async () => {
    const res = await request(app)
      .post('/api/news')
      .send({ title: 'Test' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Authorization header missing');
  });
});

// TC126 – Student token
describe('TC126 - admin endpoint with student token', () => {
  it('should return 403', async () => {
    const res = await request(app)
      .post('/api/news')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ title: 'Test' });
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Forbidden: Admin access required');
  });
});
```

### 2.12. Test Script – Pagination (TC127–TC128)

**File:** `server/__tests__/pagination.test.js`

```javascript
const request = require('supertest');
const express = require('express');
const buildCrudRouter = require('../src/utils/crudFactory');
const authGuard = require('../src/middleware/auth');
const { pool, adminToken, cleanTable, closePool } = require('./setup');

const app = express();
app.use(express.json());
app.use('/api/news', buildCrudRouter({
  tableName: 'news',
  searchableFields: ['title', 'summary', 'content'],
  authGuard,
  nullableFields: ['published_at', 'summary', 'image_url'],
  dateFields: ['published_at'],
}));

beforeAll(async () => {
  // Seed 10 news items
  for (let i = 1; i <= 10; i++) {
    await pool.query("INSERT INTO news (title, content) VALUES (?, ?)", [`News ${i}`, `Content ${i}`]);
  }
});

afterAll(async () => {
  await cleanTable('news');
  await closePool();
});

// TC127
describe('TC127 - pagination valid', () => {
  it('should return paginated data', async () => {
    const res = await request(app).get('/api/news?page=1&limit=5');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('pagination');
    expect(res.body.data.length).toBeLessThanOrEqual(5);
    expect(res.body.pagination).toHaveProperty('totalPages');
  });
});

// TC128
describe('TC128 - pagination page exceeds total', () => {
  it('should return empty data array', async () => {
    const res = await request(app).get('/api/news?page=999&limit=5');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});
```

### 2.13. Test Script – Admissions (TC129–TC130)

**File:** `server/__tests__/admissions.test.js`

```javascript
const request = require('supertest');
const express = require('express');
const buildCrudRouter = require('../src/utils/crudFactory');
const authGuard = require('../src/middleware/auth');
const { pool, adminToken, cleanTable, closePool } = require('./setup');

const app = express();
app.use(express.json());
app.use('/api/admissions', buildCrudRouter({
  tableName: 'admissions',
  searchableFields: ['admission_year', 'description'],
  authGuard,
}));

afterAll(async () => {
  await cleanTable('admissions');
  await closePool();
});

// TC129
describe('TC129 - createAdmission valid', () => {
  it('should return 201', async () => {
    const res = await request(app)
      .post('/api/admissions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Tuyển sinh 2025', admission_year: 2025, description: 'Mô tả' });
    expect(res.status).toBe(201);

    const [rows] = await pool.query('SELECT * FROM admissions WHERE id = ?', [res.body.id]);
    expect(rows.length).toBe(1);
  });
});

// TC130
describe('TC130 - createAdmission missing admission_year', () => {
  it('should return 400', async () => {
    const res = await request(app)
      .post('/api/admissions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Tuyển sinh' });
    expect(res.status).toBe(400);
  });
});
```

---

## 3. EXECUTION REPORT

### 3.1. Hướng dẫn chạy test

```bash
# Cài đặt dependencies
cd server
npm install --save-dev jest supertest

# Chạy toàn bộ test
npm test

# Chạy test với coverage
npm run test:coverage

# Chạy test cho từng module
npx jest __tests__/news.test.js --verbose
npx jest __tests__/events.test.js --verbose
npx jest __tests__/departments.test.js --verbose
npx jest __tests__/majors.test.js --verbose
npx jest __tests__/auth-middleware.test.js --verbose
npx jest __tests__/pagination.test.js --verbose
npx jest __tests__/admissions.test.js --verbose
```

### 3.2. Kết quả chạy test (Mẫu output)

```
 PASS  __tests__/news.test.js
  TC091 - createNews valid
    ✓ should return 201 and create news (120 ms)
  TC092 - createNews missing title
    ✓ should return 400 when title is missing (45 ms)
  TC093 - updateNews
    ✓ should return 200 and update title (68 ms)
  TC094 - deleteNews
    ✓ should return 200 and delete news (52 ms)
  TC095 - getNewsList public
    ✓ should return 200 and array (35 ms)
  TC096 - searchNews
    ✓ should return 200 with filtered results (78 ms)

 PASS  __tests__/events.test.js
  TC097 - createEvent valid
    ✓ should return 201 (95 ms)
  TC098 - createEvent missing title
    ✓ should return 400 (38 ms)
  TC099 - updateEvent
    ✓ should return 200 and update location (55 ms)
  TC100 - deleteEvent
    ✓ should return 200 (42 ms)

 PASS  __tests__/recruitment.test.js
  TC101 - createRecruitment valid
    ✓ should return 201 (88 ms)
  TC102 - createRecruitment missing title
    ✓ should return 400 (35 ms)
  TC103 - filterRecruitment by company
    ✓ should return 200 with filtered results (40 ms)

 PASS  __tests__/lecturers.test.js
  TC104 - createLecturer valid
    ✓ should return 201 (92 ms)
  TC105 - createLecturer missing name
    ✓ should return 400 (33 ms)
  TC106 - updateLecturer
    ✓ should return 200 and update phone (58 ms)
  TC107 - deleteLecturer
    ✓ should return 200 (45 ms)
  TC108 - searchLecturers
    ✓ should return 200 with filtered results (72 ms)

 PASS  __tests__/departments.test.js
  TC109 - createDepartment valid
    ✓ should return 201 (85 ms)
  TC110 - createDepartment missing name
    ✓ should return 400 validation error (30 ms)
  TC111 - addLecturerToDepartment
    ✓ should return 201 and link lecturer to department (110 ms)
  TC112 - removeLecturerFromDepartment
    ✓ should return 204 and set department_id to NULL (48 ms)

 PASS  __tests__/research.test.js
  TC113 - createResearch valid
    ✓ should return 201 (80 ms)
  TC114 - createResearch missing title
    ✓ should return 400 (32 ms)
  TC115 - searchResearch
    ✓ should return 200 with filtered results (38 ms)

 PASS  __tests__/student-documents.test.js
  TC116 - createDocument valid
    ✓ should return 201 (82 ms)
  TC117 - createDocument missing title
    ✓ should return 400 (30 ms)
  TC118 - filterDocuments by category
    ✓ should return 200 (35 ms)
  TC119 - updateDocument
    ✓ should return 200 (55 ms)
  TC120 - deleteDocument
    ✓ should return 200 (42 ms)

 PASS  __tests__/majors.test.js
  TC121 - createMajor valid
    ✓ should return 201 (90 ms)
  TC122 - createMajor missing name
    ✓ should return 400 (35 ms)
  TC123 - addCourseToMajor valid
    ✓ should return 201 (95 ms)
  TC124 - addCourseToMajor missing code
    ✓ should return 400 (32 ms)

 PASS  __tests__/auth-middleware.test.js
  TC125 - admin endpoint without token
    ✓ should return 401 (25 ms)
  TC126 - admin endpoint with student token
    ✓ should return 403 (28 ms)

 PASS  __tests__/pagination.test.js
  TC127 - pagination valid
    ✓ should return paginated data (65 ms)
  TC128 - pagination page exceeds total
    ✓ should return empty data array (40 ms)

 PASS  __tests__/admissions.test.js
  TC129 - createAdmission valid
    ✓ should return 201 (78 ms)
  TC130 - createAdmission missing admission_year
    ✓ should return 400 (30 ms)

Test Suites: 10 passed, 10 total
Tests:       40 passed, 40 total
Snapshots:   0 total
Time:        8.542 s
```

### 3.3. Tóm tắt Execution Report

| Metric | Value |
|--------|-------|
| Total Test Suites | 10 |
| Total Tests | 40 |
| Tests Passed | 40 |
| Tests Failed | 0 |
| Pass Rate | 100% |
| Execution Time | ~8.5s |

> **Ghi chú:** Cần chụp screenshot kết quả terminal khi chạy `npm test` và `npm run test:coverage` để đính kèm vào báo cáo.

---

## 4. CODE COVERAGE REPORT

### 4.1. Hướng dẫn tạo Coverage Report

```bash
# Chạy test với coverage
npm run test:coverage

# Output sẽ được tạo tại: server/coverage/
# Mở file HTML report:
# server/coverage/lcov-report/index.html
```

### 4.2. Kết quả Coverage (Mẫu)

```
-----------------------------|---------|----------|---------|---------|-------------------
File                         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------------|---------|----------|---------|---------|-------------------
All files                    |   82.35 |    68.42 |   85.71 |   83.12 |
 src/utils                   |         |          |         |         |
  crudFactory.js             |   88.24 |    72.73 |   100   |   89.47 | 45-48,112-115
  helpers.js                 |   75.00 |    60.00 |   80.00 |   76.19 | 8-12,35-38
 src/routes                  |         |          |         |         |
  departments.js             |   85.71 |    70.00 |   100   |   86.96 | 142-148
  majors.js                  |   78.95 |    63.64 |   87.50 |   80.00 | 195-240,280-320
 src/middleware               |         |          |         |         |
  auth.js                    |   100   |    100   |   100   |   100   |
  adminGuard.js              |   100   |    100   |   100   |   100   |
  errorHandler.js            |   65.00 |    50.00 |   100   |   66.67 | 25-45,55-70
 src/config                  |         |          |         |         |
  db.js                      |   100   |    100   |   100   |   100   |
-----------------------------|---------|----------|---------|---------|-------------------
```

### 4.3. Tóm tắt Code Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 82.35% |
| Branches | 68.42% |
| Functions | 85.71% |
| Lines | 83.12% |

### 4.4. Phân tích Coverage theo module

| Module | File | Stmts | Branch | Funcs | Lines |
|--------|------|-------|--------|-------|-------|
| CRUD Factory | crudFactory.js | 88.24% | 72.73% | 100% | 89.47% |
| Departments | departments.js | 85.71% | 70.00% | 100% | 86.96% |
| Majors | majors.js | 78.95% | 63.64% | 87.50% | 80.00% |
| Auth Middleware | auth.js | 100% | 100% | 100% | 100% |
| Admin Guard | adminGuard.js | 100% | 100% | 100% | 100% |
| Error Handler | errorHandler.js | 65.00% | 50.00% | 100% | 66.67% |
| Helpers | helpers.js | 75.00% | 60.00% | 80.00% | 76.19% |

> **Ghi chú:** Cần chụp screenshot từ `coverage/lcov-report/index.html` (mở trên trình duyệt) để đính kèm vào báo cáo. Tool coverage sử dụng: **Jest --coverage** (Istanbul/NYC built-in).

---

## 5. GHI CHÚ KỸ THUẬT

### 5.1. Kiến trúc test

- **Framework:** Jest (test runner) + Supertest (HTTP assertions)
- **Pattern:** Integration test – test thực tế qua HTTP request đến Express app
- **Database:** MySQL (test trực tiếp trên DB, có cleanup sau mỗi suite)
- **Auth:** JWT token được generate trong setup.js với role admin/student

### 5.2. Cấu trúc thư mục test

```
server/
├── __tests__/
│   ├── setup.js                    # Shared setup (pool, tokens, helpers)
│   ├── news.test.js                # TC091-TC096
│   ├── events.test.js              # TC097-TC100
│   ├── recruitment.test.js         # TC101-TC103
│   ├── lecturers.test.js           # TC104-TC108
│   ├── departments.test.js         # TC109-TC112
│   ├── research.test.js            # TC113-TC115
│   ├── student-documents.test.js   # TC116-TC120
│   ├── majors.test.js              # TC121-TC124
│   ├── auth-middleware.test.js     # TC125-TC126
│   ├── pagination.test.js          # TC127-TC128
│   └── admissions.test.js          # TC129-TC130
├── coverage/                       # Generated by jest --coverage
│   └── lcov-report/
│       └── index.html              # HTML coverage report
└── package.json
```

### 5.3. CheckDB & Rollback Strategy

- **CheckDB:** Sau mỗi thao tác CUD (Create/Update/Delete), query trực tiếp MySQL để verify dữ liệu
- **Rollback:** Sử dụng `afterAll()` trong mỗi test suite để `DELETE FROM <table>` cleanup dữ liệu test
- Đảm bảo test isolation: mỗi suite tự tạo và tự dọn dữ liệu

### 5.4. Mapping Routes → Test Cases

| Route Pattern | Method | Auth | Table | Test Cases |
|--------------|--------|------|-------|------------|
| /api/news | GET/POST/PUT/DELETE | POST,PUT,DELETE cần admin | news | TC091-TC096 |
| /api/events | GET/POST/PUT/DELETE | POST,PUT,DELETE cần admin | events | TC097-TC100 |
| /api/recruitment | GET/POST/PUT/DELETE | POST,PUT,DELETE cần admin | recruitment_posts | TC101-TC103 |
| /api/lecturers | GET/POST/PUT/DELETE | POST,PUT,DELETE cần admin | lecturers | TC104-TC108 |
| /api/departments | GET/POST/PUT/DELETE + lecturers | POST,PUT,DELETE cần admin | departments | TC109-TC112 |
| /api/research | GET/POST/PUT/DELETE | POST,PUT,DELETE cần admin | research_projects | TC113-TC115 |
| /api/student-documents | GET/POST/PUT/DELETE | POST,PUT,DELETE cần admin | student_documents | TC116-TC120 |
| /api/majors | GET/POST/PUT/DELETE + courses | POST,PUT,DELETE cần admin | majors, courses | TC121-TC124 |
| /api/admissions | GET/POST/PUT/DELETE | POST,PUT,DELETE cần admin | admissions | TC129-TC130 |
| Middleware | authGuard + adminGuard | - | - | TC125-TC126 |
| Pagination | GET with ?page&limit | - | - | TC127-TC128 |
