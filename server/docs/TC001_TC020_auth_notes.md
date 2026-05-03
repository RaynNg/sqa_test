# Trần Đình Nghĩa (TC001-TC020)

## Phạm vi đã thực hiện
- File test: `test/unit/TC001_TC020_auth.test.js`
- Nhóm test đã có:
  - Student login: TC001-TC005
  - Admin login: TC006-TC008
  - Auth guard: TC009-TC012
  - Change password: TC013-TC017
  - Forgot password: TC018-TC019
  - Reset password: TC020

## Endpoint xác thực theo source code
- `POST /api/auth/login`
- `POST /api/students/login`
- `PUT /api/students/change-password`
- `POST /api/students/forgot-password`
- `POST /api/students/reset-password`
- Middleware guard: `src/middleware/auth.js`

## Field input dùng đúng theo code
- `student_code`
- `password`
- `current_password`
- `new_password`
- `confirm_password`
- `email`
- `token`

## Điểm lệch sheet cũ đã hiệu chỉnh
1. Endpoint cũ khác code thực tế: đã đổi theo route thật.
2. Tên field cũ khác code thực tế: đã đổi theo validator thật.
3. TC015: xử lý theo logic code thật: token không phải student -> `403`.
4. TC019: xử lý theo logic code thật: email không tồn tại vẫn trả success generic message.

## Kết quả chạy test
- Command: `npm run test:auth`
- Kết quả: **20/20 passed**.

## CheckDB / Rollback trong unit test
- CheckDB thực hiện qua assert vào mock DB query:
  - Password đổi thành công (TC013, TC020)
  - Reset token được tạo (TC018)
  - Reset token được đánh dấu used (TC020)
- Rollback unit test thực hiện bằng reset mock state sau mỗi test (`jest.clearAllMocks()`).

## Coverage hiện tại (focused)
- `src/middleware/auth.js`: 100%
- `src/routes/auth.js`: 37.5%
- `src/routes/students.js`: 18.4% (file `students.js` rất lớn (nhiều module ngoài phạm vi TC001-TC020), nên coverage theo toàn file chưa đạt 80% nếu chỉ test phạm vi Auth & Password)

