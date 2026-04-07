# 💡 BRIEF: Task & Habit Gamification System

**Ngày tạo:** 2026-04-04  
**Repo:** https://github.com/s0ulyu/DACK_NNPTUDM  
**Loại dự án:** Web App (Node.js + Express + MySQL + React)  
**Nhóm:** 3 người  
**Thành viên:** Trần Biện Minh Tâm  
**Vai trò:** Người 3 — Reward + Point + Leaderboard + Notification + Socket

---

## 📌 1. VẤN ĐỀ CẦN GIẢI QUYẾT

Người dùng thiếu động lực để hoàn thành công việc hàng ngày và xây dựng thói quen tốt. Các app to-do list thông thường chỉ đánh dấu "done" mà không có cơ chế phản hồi tích cực.

**Giải pháp:** Xây dựng hệ thống quản lý công việc + thói quen có tích hợp **game hóa (gamification)**:
- Làm task → nhận điểm
- Tích điểm → lên level, đổi thưởng
- Xếp hạng với người khác → tạo động lực cạnh tranh
- Thông báo realtime → tạo sự gắn kết

---

## 🎯 2. ĐỐI TƯỢNG SỬ DỤNG

| Vai trò | Mô tả |
|---------|-------|
| **User** | Người dùng tạo task/habit, hoàn thành để nhận điểm, đổi thưởng |
| **Admin** | Quản lý người dùng, tạo/quản lý phần thưởng, xem thống kê |

---

## 📊 3. NGHIÊN CỨU THỊ TRƯỜNG

### Đối thủ chính:

| App | Điểm mạnh | Điểm yếu |
|-----|-----------|----------|
| **Habitica** | RPG toàn diện, có party/guild, avatar, pet/mount | Quá phức tạp cho người mới, UI cũ |
| **Todoist** | Karma system, streak, UI đẹp, professional | Gamification rất nhẹ, không có leaderboard |
| **Forest** | Focus-based, trồng cây khi tập trung | Chỉ focus, không quản lý task |
| **TickTick** | Task + Habit + Pomodoro | Gamification hạn chế |

### 💡 Điểm khác biệt của mình:

| Tính năng | Habitica | Todoist | **Mình** |
|-----------|---------|---------|----------|
| Điểm số | ✅ HP/XP/Gold | ✅ Karma | ✅ Points + Level |
| Đổi thưởng | ✅ Gear in-game | ❌ | ✅ Reward thực tế |
| Leaderboard | ❌ (chỉ party) | ❌ | ✅ Xếp hạng toàn hệ thống |
| Realtime notify | ❌ | ❌ | ✅ Socket.io |
| Đơn giản | ❌ Quá phức tạp | ✅ | ✅ Vừa đủ |

### Kết luận:
- Đề tài **không trùng** với các đề tài CRUD thông thường (bán hàng, thư viện, sinh viên)
- Có **logic nghiệp vụ** rõ ràng (tính điểm, transaction, socket)
- **Mới lạ** nhưng không quá khó

---

## 🗂️ 4. 10 MODELS CHI TIẾT

### Tổng quan quan hệ:

```
Role (1) ──── (n) User
User (1) ──── (n) Task
User (1) ──── (n) Habit
Category (1) ── (n) Task
Category (1) ── (n) Habit
User (1) ──── (n) PointLog
User (1) ──── (n) UserReward
Reward (1) ── (n) UserReward
User (1) ──── (1) Leaderboard
User (1) ──── (n) Notification
```

---

### Model 1: `User` (Người 1 phụ trách)

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT, PK, AUTO_INCREMENT | |
| full_name | VARCHAR(100) | |
| email | VARCHAR(100), UNIQUE | |
| password | VARCHAR(255) | Hashed bằng bcrypt |
| avatar | VARCHAR(255) | Đường dẫn ảnh upload |
| role_id | INT, FK → Role.id | |
| total_points | INT, DEFAULT 0 | Tổng điểm hiện tại |
| level | INT, DEFAULT 1 | Level tính từ điểm |
| created_at | DATETIME | |
| updated_at | DATETIME | |

---

### Model 2: `Role` (Người 1 phụ trách)

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT, PK, AUTO_INCREMENT | |
| name | VARCHAR(50), UNIQUE | 'admin' hoặc 'user' |

---

### Model 3: `Category` (Người 2 phụ trách)

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT, PK, AUTO_INCREMENT | |
| name | VARCHAR(100) | VD: Học tập, Sức khỏe |
| description | TEXT | |
| created_by | INT, FK → User.id | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

---

### Model 4: `Task` (Người 2 phụ trách)

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT, PK, AUTO_INCREMENT | |
| title | VARCHAR(200) | |
| description | TEXT | |
| due_date | DATETIME | Deadline |
| status | ENUM('pending','completed','cancelled') | DEFAULT 'pending' |
| priority | ENUM('low','medium','high') | DEFAULT 'medium' |
| point_reward | INT, DEFAULT 10 | Điểm nhận khi hoàn thành |
| user_id | INT, FK → User.id | |
| category_id | INT, FK → Category.id | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

---

### Model 5: `Habit` (Người 2 phụ trách)

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT, PK, AUTO_INCREMENT | |
| title | VARCHAR(200) | |
| description | TEXT | |
| frequency | ENUM('daily','weekly') | Tần suất lặp lại |
| target_days | INT | Số ngày mục tiêu |
| current_streak | INT, DEFAULT 0 | Streak hiện tại |
| point_reward | INT, DEFAULT 5 | Điểm mỗi lần hoàn thành |
| status | ENUM('active','paused','completed') | |
| user_id | INT, FK → User.id | |
| category_id | INT, FK → Category.id | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

---

### ⭐ Model 6: `PointLog` (NGƯỜI 3 — TÔI)

> Lưu lịch sử cộng/trừ điểm. Model quan trọng nhất cho transaction.

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT, PK, AUTO_INCREMENT | |
| user_id | INT, FK → User.id | |
| source_type | ENUM('task','habit','reward') | Nguồn điểm |
| source_id | INT | ID của task/habit/reward |
| points | INT | Số điểm (+/-) |
| action | ENUM('earn','redeem') | Cộng hay trừ |
| note | VARCHAR(255) | Ghi chú: "Hoàn thành task: Học bài" |
| created_at | DATETIME | |

**Ví dụ dữ liệu:**

| user_id | source_type | source_id | points | action | note |
|---------|-------------|-----------|--------|--------|------|
| 1 | task | 5 | +20 | earn | Hoàn thành: Học NodeJS |
| 1 | habit | 3 | +5 | earn | Streak: Tập thể dục |
| 1 | reward | 2 | -50 | redeem | Đổi: Voucher trà sữa |

---

### ⭐ Model 7: `Reward` (NGƯỜI 3 — TÔI)

> Phần thưởng mà user có thể đổi bằng điểm.

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT, PK, AUTO_INCREMENT | |
| title | VARCHAR(200) | |
| description | TEXT | |
| image | VARCHAR(255) | Ảnh upload |
| point_cost | INT | Giá quy đổi bằng điểm |
| quantity | INT | Số lượng còn lại (-1 = vô hạn) |
| status | ENUM('active','inactive') | DEFAULT 'active' |
| created_by | INT, FK → User.id | Admin tạo |
| created_at | DATETIME | |
| updated_at | DATETIME | |

**Dữ liệu mẫu:**

| title | point_cost | quantity |
|-------|-----------|----------|
| Voucher trà sữa 50k | 100 | 10 |
| 1 ngày nghỉ ngơi | 200 | 5 |
| Vé xem phim CGV | 150 | 8 |
| Badge "Siêu nhân" | 50 | -1 |

---

### ⭐ Model 8: `UserReward` (NGƯỜI 3 — TÔI)

> Lưu lịch sử user đổi thưởng.

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT, PK, AUTO_INCREMENT | |
| user_id | INT, FK → User.id | |
| reward_id | INT, FK → Reward.id | |
| redeemed_points | INT | Số điểm đã trừ |
| status | ENUM('pending','received','cancelled') | DEFAULT 'pending' |
| redeemed_at | DATETIME | |

---

### ⭐ Model 9: `Leaderboard` (NGƯỜI 3 — TÔI)

> Bảng xếp hạng user theo điểm.

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT, PK, AUTO_INCREMENT | |
| user_id | INT, FK → User.id, UNIQUE | Mỗi user 1 bản ghi |
| total_points | INT, DEFAULT 0 | Copy từ User.total_points |
| rank_position | INT | Thứ hạng (1, 2, 3...) |
| level | INT, DEFAULT 1 | Level hiện tại |
| updated_at | DATETIME | |

**Level System:**

| Điểm | Level | Rank Name |
|------|-------|-----------|
| 0 – 99 | 1 | 🌱 Beginner |
| 100 – 299 | 2 | ⭐ Learner |
| 300 – 599 | 3 | 🔥 Achiever |
| 600 – 999 | 4 | 💎 Expert |
| 1000+ | 5 | 👑 Master |

---

### ⭐ Model 10: `Notification` (NGƯỜI 3 — TÔI)

> Thông báo realtime + lưu lịch sử.

| Cột | Kiểu | Ghi chú |
|-----|------|---------|
| id | INT, PK, AUTO_INCREMENT | |
| user_id | INT, FK → User.id | |
| title | VARCHAR(200) | |
| content | TEXT | |
| type | ENUM('task_completed','reward_redeemed','new_reward','ranking_updated') | |
| is_read | BOOLEAN, DEFAULT FALSE | |
| created_at | DATETIME | |

---

## 🔥 5. PHẦN CỦA TÔI — NGƯỜI 3: CHI TIẾT

### 5.1. Tổng quan phụ trách

| Hạng mục | Chi tiết |
|----------|---------|
| **Models** | PointLog, Reward, UserReward, Leaderboard, Notification |
| **Số model** | 5/10 |
| **APIs** | Reward CRUD, Redeem, Point history, Leaderboard, Notification |
| **Transaction** | Redeem reward (trừ điểm + tạo UserReward + cập nhật leaderboard) |
| **Socket** | Realtime notification cho tất cả events |
| **Upload** | Ảnh reward |

---

### 5.2. API Endpoints chi tiết

#### 🎁 Reward APIs

| Method | Endpoint | Auth | Role | Mô tả |
|--------|----------|------|------|--------|
| GET | `/api/rewards` | ✅ | All | Lấy danh sách reward (có filter status, sort by point_cost) |
| GET | `/api/rewards/:id` | ✅ | All | Chi tiết 1 reward |
| POST | `/api/rewards` | ✅ | Admin | Tạo reward mới (có upload ảnh) |
| PUT | `/api/rewards/:id` | ✅ | Admin | Cập nhật reward |
| DELETE | `/api/rewards/:id` | ✅ | Admin | Xóa reward (soft delete → status = 'inactive') |

#### 🔄 Redeem API (TRANSACTION)

| Method | Endpoint | Auth | Role | Mô tả |
|--------|----------|------|------|--------|
| POST | `/api/rewards/:id/redeem` | ✅ | User | Đổi thưởng bằng điểm |

**Flow Transaction khi Redeem:**
```
BEGIN TRANSACTION
├── 1. Kiểm tra reward tồn tại & status = 'active'
├── 2. Kiểm tra user có đủ điểm (total_points >= point_cost)
├── 3. Kiểm tra reward còn quantity
├── 4. Trừ User.total_points -= point_cost
├── 5. Trừ Reward.quantity -= 1 (nếu không phải vô hạn)
├── 6. Tạo PointLog (action: 'redeem', points: -point_cost)
├── 7. Tạo UserReward (status: 'pending')
├── 8. Cập nhật Leaderboard (total_points, rank_position, level)
├── 9. Tạo Notification (type: 'reward_redeemed')
├── 10. Emit socket: 'notification' → user
COMMIT

Nếu BẤT KỲ bước nào lỗi → ROLLBACK toàn bộ
```

#### 📊 Point APIs

| Method | Endpoint | Auth | Role | Mô tả |
|--------|----------|------|------|--------|
| GET | `/api/points/history` | ✅ | User | Lịch sử cộng/trừ điểm của user đang đăng nhập |
| GET | `/api/points/history/:userId` | ✅ | Admin | Lịch sử điểm của 1 user (admin xem) |
| GET | `/api/points/summary` | ✅ | User | Tổng điểm, level, rank hiện tại |

#### 🏆 Leaderboard APIs

| Method | Endpoint | Auth | Role | Mô tả |
|--------|----------|------|------|--------|
| GET | `/api/leaderboard` | ✅ | All | Top 10 (hoặc top N) user theo điểm |
| GET | `/api/leaderboard/me` | ✅ | User | Vị trí của mình trong bảng xếp hạng |

#### 🔔 Notification APIs

| Method | Endpoint | Auth | Role | Mô tả |
|--------|----------|------|------|--------|
| GET | `/api/notifications` | ✅ | User | Danh sách thông báo (phân trang, sort mới nhất) |
| GET | `/api/notifications/unread-count` | ✅ | User | Số thông báo chưa đọc |
| PUT | `/api/notifications/:id/read` | ✅ | User | Đánh dấu đã đọc |
| PUT | `/api/notifications/read-all` | ✅ | User | Đánh dấu tất cả đã đọc |

---

### 5.3. Transaction Logic chi tiết

#### Transaction 1: Hoàn thành Task (Liên kết với Người 2)

> Khi Người 2 code API `POST /tasks/:id/complete`, trong service sẽ gọi các service/repository của Người 3.

```
BEGIN TRANSACTION
├── [Người 2] Update Task.status = 'completed'
├── [Người 3] User.total_points += Task.point_reward
├── [Người 3] Tạo PointLog (action: 'earn')
├── [Người 3] Cập nhật Leaderboard
├── [Người 3] Tạo Notification (type: 'task_completed')
COMMIT → [Người 3] Emit socket
```

#### Transaction 2: Đổi thưởng (100% Người 3)

```
BEGIN TRANSACTION
├── Validate: reward active? đủ điểm? còn quantity?
├── User.total_points -= Reward.point_cost
├── Reward.quantity -= 1
├── Tạo PointLog (action: 'redeem', points: -point_cost)
├── Tạo UserReward (status: 'pending')
├── Cập nhật Leaderboard
├── Tạo Notification (type: 'reward_redeemed')
COMMIT → Emit socket
```

#### Nếu lỗi xảy ra:
```javascript
// Sử dụng Sequelize Managed Transaction
const result = await sequelize.transaction(async (t) => {
  // Tất cả operations ở đây
  // Nếu throw Error → tự động ROLLBACK
});
```

---

### 5.4. Socket.io Events

| Event | Trigger | Target | Data |
|-------|---------|--------|------|
| `notification:new` | Task hoàn thành | User cụ thể | `{ title, content, type, points }` |
| `notification:new` | Đổi thưởng thành công | User cụ thể | `{ title, content, type, reward }` |
| `leaderboard:update` | Có thay đổi điểm | Tất cả user | `{ top10: [...], updatedUser }` |
| `reward:new` | Admin tạo reward mới | Tất cả user | `{ reward: { id, title, point_cost, image } }` |
| `level:up` | User lên level | User cụ thể | `{ newLevel, levelName, totalPoints }` |

**Cấu trúc Socket Server:**
```
src/sockets/
├── index.js          // Khởi tạo socket.io, attach vào HTTP server
├── authSocket.js     // Middleware xác thực JWT cho socket connection
├── handlers/
│   ├── notificationHandler.js  // Xử lý emit notification
│   ├── leaderboardHandler.js   // Xử lý emit leaderboard update
│   └── rewardHandler.js        // Xử lý emit new reward
```

**Flow Socket:**
```
Client connect → JWT auth middleware → Join room(userId)
                                     → Join room('global')

Server emit notification → io.to(userId).emit('notification:new', data)
Server emit leaderboard  → io.to('global').emit('leaderboard:update', data)
Server emit new reward    → io.to('global').emit('reward:new', data)
```

---

### 5.5. Upload ảnh Reward

| Hạng mục | Chi tiết |
|----------|---------|
| Library | `multer` |
| Thư mục lưu | `uploads/rewards/` |
| Format cho phép | JPG, PNG, WEBP |
| Max size | 5MB |
| Tên file | `reward-{id}-{timestamp}.{ext}` |

---

## 📂 6. CẤU TRÚC THƯ MỤC DỰ ÁN

```
DACK_NNPTUDM/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js        // Kết nối MySQL (Sequelize)
│   │   │   ├── socket.js          // Cấu hình Socket.io
│   │   │   └── multer.js          // Cấu hình upload
│   │   ├── models/
│   │   │   ├── index.js           // Sequelize init + associations
│   │   │   ├── User.js            // [Người 1]
│   │   │   ├── Role.js            // [Người 1]
│   │   │   ├── Category.js        // [Người 2]
│   │   │   ├── Task.js            // [Người 2]
│   │   │   ├── Habit.js           // [Người 2]
│   │   │   ├── PointLog.js        // ⭐ [Người 3 - TÔI]
│   │   │   ├── Reward.js          // ⭐ [Người 3 - TÔI]
│   │   │   ├── UserReward.js      // ⭐ [Người 3 - TÔI]
│   │   │   ├── Leaderboard.js     // ⭐ [Người 3 - TÔI]
│   │   │   └── Notification.js    // ⭐ [Người 3 - TÔI]
│   │   ├── repositories/
│   │   │   ├── pointLogRepository.js    // ⭐
│   │   │   ├── rewardRepository.js      // ⭐
│   │   │   ├── userRewardRepository.js  // ⭐
│   │   │   ├── leaderboardRepository.js // ⭐
│   │   │   └── notificationRepository.js // ⭐
│   │   ├── services/
│   │   │   ├── pointService.js          // ⭐ Logic tính điểm
│   │   │   ├── rewardService.js         // ⭐ CRUD + redeem
│   │   │   ├── leaderboardService.js    // ⭐ Xếp hạng + cập nhật
│   │   │   └── notificationService.js   // ⭐ Tạo + đánh dấu đọc
│   │   ├── controllers/
│   │   │   ├── pointController.js       // ⭐
│   │   │   ├── rewardController.js      // ⭐
│   │   │   ├── leaderboardController.js // ⭐
│   │   │   └── notificationController.js // ⭐
│   │   ├── routes/
│   │   │   ├── index.js                 // Mount tất cả routes
│   │   │   ├── pointRoutes.js           // ⭐
│   │   │   ├── rewardRoutes.js          // ⭐
│   │   │   ├── leaderboardRoutes.js     // ⭐
│   │   │   └── notificationRoutes.js    // ⭐
│   │   ├── middlewares/
│   │   │   ├── auth.js             // [Người 1] — tôi sử dụng
│   │   │   ├── roleCheck.js        // [Người 1] — tôi sử dụng
│   │   │   ├── upload.js           // ⭐ Multer middleware
│   │   │   └── errorHandler.js     // Global error handler
│   │   ├── sockets/
│   │   │   ├── index.js            // ⭐ Socket.io setup
│   │   │   ├── authSocket.js       // ⭐ JWT auth cho socket
│   │   │   └── handlers/
│   │   │       ├── notificationHandler.js  // ⭐
│   │   │       ├── leaderboardHandler.js   // ⭐
│   │   │       └── rewardHandler.js        // ⭐
│   │   └── utils/
│   │       ├── levelCalculator.js  // ⭐ Tính level từ điểm
│   │       └── responseHelper.js   // Format response chuẩn
│   ├── uploads/
│   │   ├── avatars/                // [Người 1]
│   │   └── rewards/                // ⭐ [Người 3 - TÔI]
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js                   // Entry point
├── frontend/                       // React (30% - đơn giản)
├── docs/
│   └── BRIEF.md                    // File này
├── .gitignore
└── README.md
```

---

## ⚙️ 7. CẤU HÌNH MÔI TRƯỜNG

### 7.1. Laragon (từ ảnh config của bạn)

| Hạng mục | Giá trị |
|----------|---------|
| Network type | MariaDB or MySQL (TCP/IP) |
| Library | libmariadb.dll |
| Hostname | 127.0.0.1 |
| User | root |
| Password | *(trống)* |
| Port | 3306 |
| Database name | `task_gamification_db` |

### 7.2. File .env

```env
# Server
PORT=3000
NODE_ENV=development

# Database (Laragon MySQL)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=task_gamification_db
DB_DIALECT=mysql

# JWT (Người 1 config, tôi sử dụng)
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

# Socket
SOCKET_CORS_ORIGIN=http://localhost:5173
```

### 7.3. Dependencies (package.json)

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "sequelize": "^6.35.0",
    "mysql2": "^3.6.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "socket.io": "^4.7.2",
    "multer": "^1.4.5-lts.1",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "sequelize-cli": "^6.6.2"
  }
}
```

---

## 🌿 8. GIT BRANCHING STRATEGY

### Nhánh chính:
```
main          → Code hoàn thiện, ổn định
develop       → Merge từ feature branches
```

### Nhánh feature của tôi (Người 3):
```
develop/feature/person3/reward-model
develop/feature/person3/reward-crud
develop/feature/person3/pointlog-model
develop/feature/person3/point-history-api
develop/feature/person3/redeem-transaction
develop/feature/person3/userreward-model
develop/feature/person3/leaderboard-model
develop/feature/person3/leaderboard-api
develop/feature/person3/notification-model
develop/feature/person3/notification-api
develop/feature/person3/socket-setup
develop/feature/person3/socket-events
develop/feature/person3/upload-reward-image
```

### Flow:
```
feature branch → PR to develop → Review → Merge to develop
                                         → Khi hoàn thiện → Merge to main
```

---

## 📅 9. TIMELINE ƯỚC TÍNH (NGƯỜI 3)

| Tuần | Task | Ưu tiên |
|------|------|---------|
| **Tuần 1** | Setup models (PointLog, Reward, UserReward, Leaderboard, Notification) | 🔴 Cao |
| **Tuần 1** | Reward CRUD API + Upload ảnh | 🔴 Cao |
| **Tuần 2** | Redeem Transaction (trừ điểm, tạo UserReward, cập nhật Leaderboard) | 🔴 Cao |
| **Tuần 2** | Point history API + Summary API | 🟡 Trung bình |
| **Tuần 3** | Leaderboard API (top N, rank me) | 🟡 Trung bình |
| **Tuần 3** | Notification CRUD + Mark read | 🟡 Trung bình |
| **Tuần 4** | Socket.io setup + Events + Integration | 🔴 Cao |
| **Tuần 4** | Level system logic + Level up notification | 🟢 Thấp |
| **Tuần 5** | Tích hợp với Người 1 (auth middleware) & Người 2 (complete task) | 🔴 Cao |
| **Tuần 5** | Test toàn bộ flow, chụp Postman, demo | 🔴 Cao |

---

## 🧪 10. TEST / DEMO SCENARIOS (Postman)

### Scenario 1: Reward CRUD
```
1. POST /api/rewards (Admin) → Tạo "Voucher trà sữa" cost=100
2. GET /api/rewards → Xem danh sách
3. PUT /api/rewards/1 → Sửa giá thành 80
4. DELETE /api/rewards/1 → Soft delete
```

### Scenario 2: Redeem Transaction ✅
```
1. GET /api/points/summary → Xem điểm hiện tại (VD: 150 điểm)
2. POST /api/rewards/1/redeem → Đổi reward cost=100
3. GET /api/points/summary → Kiểm tra còn 50 điểm
4. GET /api/points/history → Có record trừ 100 điểm
5. GET /api/leaderboard → Rank đã cập nhật
```

### Scenario 3: Redeem FAIL (rollback) ❌
```
1. GET /api/points/summary → 50 điểm
2. POST /api/rewards/2/redeem → Reward cost=200
3. Response: 400 "Không đủ điểm"
4. GET /api/points/summary → VẪN 50 điểm (rollback thành công)
```

### Scenario 4: Socket Notification
```
1. Connect socket → ws://localhost:3000
2. Complete task → Socket emit 'notification:new'
3. Admin tạo reward → Socket emit 'reward:new' to all
4. User lên level → Socket emit 'level:up'
```

### Scenario 5: Leaderboard
```
1. GET /api/leaderboard → Top 10 users
2. Complete nhiều task → Điểm tăng
3. GET /api/leaderboard → Rank thay đổi
4. GET /api/leaderboard/me → Vị trí của mình
```

---

## 🔗 11. LIÊN KẾT VỚI CÁC THÀNH VIÊN KHÁC

### Tôi CẦN từ Người 1:
- ✅ Middleware `auth.js` (verify JWT, attach `req.user`)
- ✅ Middleware `roleCheck.js` (kiểm tra admin/user)
- ✅ Model `User` (để tham chiếu FK, cập nhật `total_points`, `level`)

### Tôi CẦN từ Người 2:
- ✅ Gọi `pointService.earnPoints()` khi `POST /tasks/:id/complete`
- ✅ Gọi `leaderboardService.update()` sau khi cộng điểm
- ✅ Gọi `notificationService.create()` sau khi task completed

### Tôi CUNG CẤP cho Người 2:
- ✅ `pointService.earnPoints(userId, sourceType, sourceId, points, note, transaction)`
- ✅ `leaderboardService.updateUserRank(userId, transaction)`
- ✅ `notificationService.createAndEmit(userId, title, content, type)`

---

## 📌 12. LƯU Ý QUAN TRỌNG

### ⚠️ Transaction là TRỌNG TÂM
- Sử dụng **Sequelize Managed Transaction** (`sequelize.transaction(async (t) => { ... })`)
- **Luôn pass `{ transaction: t }`** cho mọi query trong transaction
- Test kỹ case rollback (không đủ điểm, reward hết hàng)

### ⚠️ Socket.io cần JWT Auth
- Socket connection phải verify JWT token
- Mỗi user join vào room riêng (`userId`) + room chung (`global`)
- Không emit data nhạy cảm (password, email) qua socket

### ⚠️ Phối hợp nhóm
- Người 1 cần hoàn thành auth middleware TRƯỚC → tôi mới test được
- Người 2 khi code complete task → cần gọi service của tôi
- Thống nhất format response: `{ success: true, data: {...}, message: "..." }`

---

## ➡️ BƯỚC TIẾP THEO

1️⃣ **OK — Lên plan luôn** (`/plan`) → Tạo kế hoạch implement chi tiết
2️⃣ **Sửa** — Cần điều chỉnh phần nào
3️⃣ **Lưu lại** — Cần suy nghĩ thêm
4️⃣ **Code luôn** (`/code`) → Bắt tay vào code ngay
