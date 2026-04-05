# 📊 BÁO CÁO ĐỒ ÁN — Phần Trần Biện Minh Tâm

> **Môn:** Nhập môn phát triển ứng dụng đa nền tảng
> **Dự án:** Task & Habit Gamification System
> **Thành viên:** Trần Biện Minh Tâm
> **Phụ trách:** Module Reward, Point, Leaderboard, Notification + Frontend
> **Ngày:** 04/04/2026

---

## 1. Tổng quan dự án

**Task & Habit Gamification System** là hệ thống quản lý công việc và thói quen kết hợp game hóa. Người dùng hoàn thành task/habit → nhận điểm → đổi phần thưởng → xếp hạng trên leaderboard.

### Phân công nhóm (3 người):

| Thành viên | Module | Trạng thái |
|------------|--------|-----------|
| Người 1 | Auth, User, Role | Stub (chờ tích hợp) |
| Người 2 | Task, Habit, Category | Stub (chờ tích hợp) |
| **Trần Biện Minh Tâm** | **Reward, Point, Leaderboard, Notification, Socket.io, Frontend** | ✅ **Hoàn thành** |

---

## 2. Công nghệ sử dụng

| Layer | Công nghệ | Phiên bản |
|-------|-----------|-----------|
| Backend Runtime | Node.js | LTS |
| Backend Framework | Express | 4.18 |
| ORM | Sequelize | 6.35 |
| Database | MySQL (Laragon) | 8.4.3 |
| Realtime | Socket.io | 4.7 |
| Authentication | JWT (jsonwebtoken) | 9.0 |
| File Upload | Multer | 1.4 |
| Frontend | Vanilla HTML/CSS/JS | - |
| Font | Google Fonts (Inter) | - |

---

## 3. Kiến trúc hệ thống

```
┌─────────────────┐     ┌──────────────────────────────────────┐
│   Frontend      │     │           Backend (Express)           │
│  (HTML/CSS/JS)  │────▶│                                      │
│                 │     │  Routes → Controllers → Services     │
│  - Login        │     │                  ↓                   │
│  - Dashboard    │◀───▶│           Repositories                │
│  - Rewards      │     │                  ↓                   │
│  - Leaderboard  │     │         MySQL (Sequelize)             │
│  - Notifications│     │                                      │
└─────────────────┘     │  Socket.io ←→ Services (global.io)   │
         ↕              └──────────────────────────────────────┘
    Socket.io Client
```

### Design Pattern: Repository Pattern
- **Repository:** Chỉ truy vấn database (CRUD thuần)
- **Service:** Xử lý business logic, transaction
- **Controller:** Nhận request, gọi service, format response
- **Route:** Định tuyến URL, áp dụng middleware

---

## 4. Database Schema (5 bảng do tôi phụ trách)

### 4.1. Bảng `rewards`
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | INT (PK, AI) | ID phần thưởng |
| title | VARCHAR(255) | Tên phần thưởng |
| description | TEXT | Mô tả |
| image | VARCHAR(500) | Đường dẫn ảnh upload |
| point_cost | INT | Số điểm cần đổi |
| quantity | INT | Số lượng (-1 = vô hạn) |
| status | ENUM('active','inactive') | Trạng thái |
| created_by | INT (FK → users) | Admin tạo |

### 4.2. Bảng `user_rewards`
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | INT (PK, AI) | ID giao dịch |
| user_id | INT (FK → users) | User đổi thưởng |
| reward_id | INT (FK → rewards) | Phần thưởng |
| redeemed_points | INT | Số điểm đã trừ |
| status | VARCHAR | Trạng thái (pending/completed) |
| redeemed_at | DATETIME | Thời điểm đổi |

### 4.3. Bảng `point_logs`
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | INT (PK, AI) | ID log |
| user_id | INT (FK → users) | User |
| source_type | VARCHAR | Nguồn (task/habit/reward) |
| source_id | INT | ID nguồn |
| points | INT | Số điểm (+/-) |
| action | VARCHAR | Hành động (earn/redeem) |
| note | TEXT | Ghi chú |

### 4.4. Bảng `leaderboards`
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | INT (PK, AI) | ID |
| user_id | INT (FK → users) | User |
| total_points | INT | Tổng điểm |
| rank_position | INT | Vị trí xếp hạng |
| level | INT | Level hiện tại |

### 4.5. Bảng `notifications`
| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | INT (PK, AI) | ID thông báo |
| user_id | INT (FK → users) | User nhận |
| title | VARCHAR(255) | Tiêu đề |
| content | TEXT | Nội dung |
| type | VARCHAR | Loại thông báo |
| is_read | BOOLEAN | Đã đọc chưa |

---

## 5. API Endpoints (17 endpoints)

| # | Method | Endpoint | Chức năng | Auth | Role |
|---|--------|----------|-----------|------|------|
| 1 | POST | /api/auth/register | Đăng ký | ❌ | - |
| 2 | POST | /api/auth/login | Đăng nhập | ❌ | - |
| 3 | GET | /api/rewards | Danh sách reward | ✅ | All |
| 4 | GET | /api/rewards/:id | Chi tiết reward | ✅ | All |
| 5 | POST | /api/rewards | Tạo reward | ✅ | Admin |
| 6 | PUT | /api/rewards/:id | Sửa reward | ✅ | Admin |
| 7 | DELETE | /api/rewards/:id | Xóa mềm reward | ✅ | Admin |
| 8 | **POST** | **/api/rewards/:id/redeem** | **Đổi thưởng (Transaction)** | ✅ | User |
| 9 | GET | /api/points/history | Lịch sử điểm | ✅ | All |
| 10 | GET | /api/points/history/:userId | Lịch sử (admin) | ✅ | Admin |
| 11 | GET | /api/points/summary | Tổng hợp điểm+level | ✅ | All |
| 12 | GET | /api/leaderboard | Top 10 | ✅ | All |
| 13 | GET | /api/leaderboard/me | Rank của mình | ✅ | All |
| 14 | GET | /api/notifications | DS thông báo | ✅ | All |
| 15 | GET | /api/notifications/unread-count | Số chưa đọc | ✅ | All |
| 16 | PUT | /api/notifications/:id/read | Đánh dấu đã đọc | ✅ | All |
| 17 | PUT | /api/notifications/read-all | Đọc tất cả | ✅ | All |

> 📌 Chi tiết request/response xem file `docs/API.md`

---

## 6. Tính năng nổi bật

### 6.1. Managed Transaction (Đổi thưởng)

Endpoint `POST /api/rewards/:id/redeem` sử dụng **Sequelize Managed Transaction** để đảm bảo tính toàn vẹn dữ liệu:

```
Bắt đầu Transaction
  → Lock reward (SELECT FOR UPDATE)
  → Kiểm tra reward active + còn hàng
  → Lock user + kiểm tra đủ điểm
  → Trừ điểm user
  → Trừ quantity reward
  → Tạo PointLog
  → Tạo UserReward
  → Cập nhật Leaderboard
  → Tạo Notification
Commit Transaction

→ Nếu bất kỳ bước nào lỗi → ROLLBACK toàn bộ
→ Socket emit SAU transaction (sau commit)
```

### 6.2. Socket.io Realtime

Hệ thống gửi thông báo realtime qua Socket.io:
- **Cá nhân:** Gửi tới room `user_{userId}`
- **Broadcast:** Gửi tới room `global`

| Event | Target | Trigger |
|-------|--------|---------|
| `notification:new` | User cụ thể | Token nhận, đổi thưởng |
| `leaderboard:update` | Tất cả | Điểm thay đổi |
| `reward:new` | Tất cả | Admin tạo reward |
| `level:up` | User cụ thể | User lên level |

### 6.3. Level System

| Level | Tên | Điểm yêu cầu |
|-------|-----|---------------|
| 1 | Beginner | 0 – 99 |
| 2 | Learner | 100 – 299 |
| 3 | Achiever | 300 – 599 |
| 4 | Expert | 600 – 999 |
| 5 | Master | 1000+ |

### 6.4. Frontend (Dark Glassmorphism Theme)

5 trang giao diện với thiết kế dark mode hiện đại:

| Trang | Chức năng |
|-------|-----------|
| Login | Form đăng nhập với glassmorphism card |
| Dashboard | Tổng điểm, level, rank, lịch sử gần đây |
| Rewards | Danh sách reward dạng card, nút đổi thưởng |
| Leaderboard | Top 10 với medal 🥇🥈🥉, highlight user hiện tại |
| Notifications | Danh sách thông báo, mark đã đọc |

**Đặc điểm UI:**
- Dark theme gradient (tím-xanh)
- Glassmorphism cards (backdrop-filter blur)
- Micro-animations (hover, transitions, stagger)
- Google Font Inter
- Responsive (mobile-friendly)
- Toast notification realtime (Socket.io)

---

## 7. Cấu trúc thư mục

```
DoAn/
├── backend/
│   ├── server.js                 # Entry point
│   ├── .env                      # Cấu hình (DB, JWT)
│   ├── uploads/                  # Ảnh reward upload
│   └── src/
│       ├── config/
│       │   ├── database.js       # Sequelize connection
│       │   └── multer.js         # Upload config
│       ├── models/               # 10 models (5 stub + 5 full)
│       │   ├── index.js          # Model associations
│       │   ├── Reward.js         ⭐
│       │   ├── UserReward.js     ⭐
│       │   ├── PointLog.js       ⭐
│       │   ├── Leaderboard.js    ⭐
│       │   └── Notification.js   ⭐
│       ├── repositories/         # Database queries
│       │   ├── rewardRepository.js       ⭐
│       │   ├── userRewardRepository.js   ⭐
│       │   ├── pointLogRepository.js     ⭐
│       │   ├── leaderboardRepository.js  ⭐
│       │   └── notificationRepository.js ⭐
│       ├── services/             # Business logic
│       │   ├── rewardService.js         ⭐ (Transaction)
│       │   ├── pointService.js          ⭐ (earnPoints)
│       │   ├── leaderboardService.js    ⭐
│       │   └── notificationService.js   ⭐
│       ├── controllers/          # Request handlers
│       ├── routes/               # URL routing
│       ├── middlewares/          # Auth, role check, error handler
│       ├── sockets/              # Socket.io setup ⭐
│       └── utils/                # Helpers (level calculator, response)
├── frontend/
│   ├── index.html                # Login page ⭐
│   ├── dashboard.html            ⭐
│   ├── rewards.html              ⭐
│   ├── leaderboard.html          ⭐
│   ├── notifications.html        ⭐
│   ├── css/style.css             # Dark glassmorphism theme ⭐
│   └── js/
│       ├── api.js                # Fetch + JWT helper ⭐
│       └── socket.js             # Socket.io client ⭐
└── docs/
    ├── BRIEF.md                  # Chi tiết kỹ thuật
    ├── API.md                    # API documentation
    └── REPORT.md                 # Báo cáo này
```

> ⭐ = File do Trần Biện Minh Tâm viết

---

## 8. Kết quả kiểm thử

### 8.1. API Test (9/9 PASSED ✅)

| # | Test Case | Kết quả | Ghi chú |
|---|-----------|---------|---------|
| 1 | Register user | ✅ PASS | Tạo user + leaderboard entry |
| 2 | Login | ✅ PASS | JWT token trả về đúng |
| 3 | Create Reward (admin) | ✅ PASS | 2 rewards tạo thành công |
| 4 | Point Summary | ✅ PASS | 200 điểm, Level 2 Learner |
| 5 | Redeem Transaction | ✅ PASS | 200→100 điểm, UserReward created |
| 6 | Transaction Rollback | ✅ PASS | Không đủ điểm → 400, điểm không đổi |
| 7 | Leaderboard | ✅ PASS | Rank chính xác |
| 8 | Notifications | ✅ PASS | 2 unread notifications |
| 9 | Point History | ✅ PASS | Record trừ điểm action=redeem |

### 8.2. Frontend Test (5/5 PASSED ✅)

| # | Trang | Kết quả | Ghi chú |
|---|-------|---------|---------|
| 1 | Login | ✅ PASS | Đăng nhập OK, redirect đúng |
| 2 | Dashboard | ✅ PASS | 100 pts, Lv.2, Rank #1 |
| 3 | Rewards | ✅ PASS | 2 rewards hiển thị, nút đổi thưởng |
| 4 | Leaderboard | ✅ PASS | Tên đúng, medal, highlight user |
| 5 | Notifications | ✅ PASS | 3 thông báo, badge, mark all |

---

## 9. Hướng dẫn chạy

```bash
# 1. Cài dependencies
cd backend
npm install

# 2. Cấu hình .env
cp .env.example .env
# Sửa DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET

# 3. Tạo database MySQL
mysql -u root -e "CREATE DATABASE task_gamification_db"

# 4. Chạy server
npm run dev
# Hoặc: node server.js

# 5. Mở trình duyệt
# http://localhost:3000
```

---

## 10. Kết luận

Phần việc đã hoàn thành đầy đủ bao gồm:
- **5 database models** với đầy đủ associations
- **17 API endpoints** (bao gồm transaction đổi thưởng)
- **Socket.io realtime** cho thông báo và leaderboard
- **5 trang frontend** với dark glassmorphism theme
- **9/9 API tests** và **5/5 frontend tests** đều PASS

Code đã push lên GitHub nhánh `develop` với 2 commits dưới tên **Trần Biện Minh Tâm**.

---

> *Báo cáo này được tạo ngày 04/04/2026 bởi Trần Biện Minh Tâm*
