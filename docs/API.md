# 📄 API Documentation — Task & Habit Gamification System

> **Người thực hiện:** Trần Biện Minh Tâm
> **Ngày cập nhật:** 04/04/2026
> **Base URL:** `http://localhost:3000/api`

---

## 📑 Mục lục

1. [Authentication](#-authentication)
2. [Rewards](#-rewards)
3. [Points](#-points)
4. [Leaderboard](#-leaderboard)
5. [Notifications](#-notifications)

---

## Response Format

### Thành công
```json
{
  "success": true,
  "message": "Thành công",
  "data": { ... }
}
```

### Phân trang
```json
{
  "success": true,
  "message": "Thành công",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Lỗi
```json
{
  "success": false,
  "message": "Mô tả lỗi"
}
```

---

## 🔐 Authentication

> ⚠️ **Tạm thời** — Sẽ được Người 1 thay thế bằng auth chính thức

### POST `/api/auth/register`

Đăng ký tài khoản mới.

**Request Body:**
```json
{
  "full_name": "Trần Biện Minh Tâm",
  "email": "minhtam@test.com",
  "password": "123456"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "user": {
      "id": 1,
      "full_name": "Trần Biện Minh Tâm",
      "email": "minhtam@test.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Vui lòng nhập đầy đủ thông tin |
| 409 | Email đã tồn tại |

---

### POST `/api/auth/login`

Đăng nhập, nhận JWT token.

**Request Body:**
```json
{
  "email": "minhtam@test.com",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "id": 1,
      "full_name": "Minh Tam",
      "email": "minhtam@test.com",
      "total_points": 100,
      "level": 2,
      "role_id": 2
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Vui lòng nhập email và password |
| 401 | Email hoặc password không đúng |

---

## 🎁 Rewards

> Yêu cầu: Header `Authorization: Bearer {token}`

### GET `/api/rewards`

Danh sách phần thưởng (có phân trang). Chỉ hiện reward đang active.

**Query Parameters:**
| Param | Type | Default | Mô tả |
|-------|------|---------|-------|
| page | number | 1 | Trang hiện tại |
| limit | number | 10 | Số items/trang |

**Response (200):**
```json
{
  "success": true,
  "message": "Thành công",
  "data": [
    {
      "id": 1,
      "title": "Voucher tra sua 50k",
      "description": "Voucher tra sua Phuc Long",
      "image": null,
      "point_cost": 100,
      "quantity": 10,
      "status": "active",
      "created_by": 2,
      "created_at": "2026-04-04T00:50:00.000Z",
      "updated_at": "2026-04-04T00:50:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}
```

---

### GET `/api/rewards/:id`

Chi tiết một phần thưởng.

**Response (200):**
```json
{
  "success": true,
  "message": "Thành công",
  "data": {
    "id": 1,
    "title": "Voucher tra sua 50k",
    "description": "Voucher tra sua Phuc Long",
    "image": null,
    "point_cost": 100,
    "quantity": 10,
    "status": "active",
    "created_by": 2,
    "created_at": "2026-04-04T00:50:00.000Z",
    "updated_at": "2026-04-04T00:50:00.000Z"
  }
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 404 | Reward không tồn tại |

---

### POST `/api/rewards`

Tạo phần thưởng mới (Chỉ Admin). Hỗ trợ upload ảnh qua `multipart/form-data`.

**Headers:** `Authorization: Bearer {admin_token}`

**Request Body (JSON hoặc FormData):**
```json
{
  "title": "Voucher tra sua 50k",
  "description": "Voucher tra sua Phuc Long",
  "point_cost": 100,
  "quantity": 10
}
```

Nếu upload ảnh: dùng `form-data` với field `image` (file).

**Response (201):**
```json
{
  "success": true,
  "message": "Tạo reward thành công",
  "data": {
    "id": 1,
    "title": "Voucher tra sua 50k",
    "point_cost": 100,
    "quantity": 10,
    "status": "active",
    "image": "/uploads/rewards/reward-1712195400000.jpg"
  }
}
```

> 💡 Khi tạo reward, hệ thống tự động:
> - Gửi Socket event `reward:new` tới tất cả user
> - Tạo Notification cho tất cả user

---

### PUT `/api/rewards/:id`

Cập nhật phần thưởng (Chỉ Admin).

**Request Body:**
```json
{
  "title": "Voucher tra sua 100k",
  "point_cost": 200
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cập nhật reward thành công",
  "data": { ... }
}
```

---

### DELETE `/api/rewards/:id`

Xóa mềm phần thưởng (đổi status → inactive). Chỉ Admin.

**Response (200):**
```json
{
  "success": true,
  "message": "Xóa reward thành công",
  "data": null
}
```

---

### POST `/api/rewards/:id/redeem` ⭐

**Đổi thưởng bằng điểm** — Endpoint quan trọng nhất, sử dụng **Sequelize Managed Transaction**.

**Request:** Không cần body (lấy userId từ JWT token).

**Transaction Flow:**
1. Lock reward (SELECT FOR UPDATE)
2. Kiểm tra reward active + còn hàng
3. Lock user, kiểm tra đủ điểm
4. Trừ điểm user
5. Trừ quantity reward (nếu không vô hạn)
6. Tạo PointLog (ghi lịch sử trừ điểm)
7. Tạo UserReward (ghi nhận đổi thưởng)
8. Cập nhật Leaderboard
9. Tạo Notification
10. **Nếu bất kỳ bước nào lỗi → ROLLBACK toàn bộ**

**Response (200):**
```json
{
  "success": true,
  "message": "Đổi thưởng thành công!",
  "data": {
    "userReward": {
      "id": 1,
      "user_id": 1,
      "reward_id": 1,
      "redeemed_points": 100,
      "status": "pending"
    },
    "remainingPoints": 0,
    "level": {
      "level": 1,
      "name": "Beginner",
      "minPoints": 0,
      "maxPoints": 99
    }
  }
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Không đủ điểm. Cần X, bạn có Y |
| 400 | Reward đã hết hàng |
| 404 | Reward không tồn tại hoặc đã ngừng |

> 💡 Sau khi redeem thành công:
> - Socket event `notification:new` gửi tới user
> - Socket event `leaderboard:update` gửi tới tất cả

---

## ⭐ Points

> Yêu cầu: Header `Authorization: Bearer {token}`

### GET `/api/points/summary`

Tổng hợp điểm, level, rank của user hiện tại.

**Response (200):**
```json
{
  "success": true,
  "message": "Thành công",
  "data": {
    "userId": 1,
    "fullName": "Minh Tam",
    "totalPoints": 100,
    "level": 2,
    "levelName": "Learner",
    "rank": 1
  }
}
```

**Level System:**
| Level | Tên | Điểm |
|-------|-----|------|
| 1 | Beginner | 0 – 99 |
| 2 | Learner | 100 – 299 |
| 3 | Achiever | 300 – 599 |
| 4 | Expert | 600 – 999 |
| 5 | Master | 1000+ |

---

### GET `/api/points/history`

Lịch sử cộng/trừ điểm của user hiện tại.

**Query Parameters:**
| Param | Type | Default | Mô tả |
|-------|------|---------|-------|
| page | number | 1 | Trang |
| limit | number | 10 | Số items/trang |

**Response (200):**
```json
{
  "success": true,
  "message": "Thành công",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "source_type": "reward",
      "source_id": 1,
      "points": -100,
      "action": "redeem",
      "note": "Đổi thưởng: Voucher tra sua 50k",
      "created_at": "2026-04-04T01:10:00.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
}
```

---

### GET `/api/points/history/:userId`

Lịch sử điểm của user khác (Chỉ Admin).

---

## 🏆 Leaderboard

> Yêu cầu: Header `Authorization: Bearer {token}`

### GET `/api/leaderboard`

Top 10 xếp hạng.

**Response (200):**
```json
{
  "success": true,
  "message": "Thành công",
  "data": [
    {
      "rank": 1,
      "userId": 1,
      "fullName": "Minh Tam",
      "avatar": null,
      "totalPoints": 100,
      "level": 2
    },
    {
      "rank": 2,
      "userId": 2,
      "fullName": "Admin User",
      "avatar": null,
      "totalPoints": 0,
      "level": 1
    }
  ]
}
```

---

### GET `/api/leaderboard/me`

Vị trí xếp hạng của user hiện tại.

**Response (200):**
```json
{
  "success": true,
  "message": "Thành công",
  "data": {
    "rank": 1,
    "totalPoints": 100,
    "level": 2
  }
}
```

---

## 🔔 Notifications

> Yêu cầu: Header `Authorization: Bearer {token}`

### GET `/api/notifications`

Danh sách thông báo (phân trang, mới nhất trước).

**Query Parameters:**
| Param | Type | Default | Mô tả |
|-------|------|---------|-------|
| page | number | 1 | Trang |
| limit | number | 10 | Số items/trang |

**Response (200):**
```json
{
  "success": true,
  "message": "Thành công",
  "data": [
    {
      "id": 3,
      "user_id": 1,
      "title": "Phần thưởng mới!",
      "content": "\"iPhone 16\" - 500 điểm",
      "type": "new_reward",
      "is_read": false,
      "created_at": "2026-04-04T01:00:00.000Z"
    },
    {
      "id": 2,
      "user_id": 1,
      "title": "Đổi thưởng thành công!",
      "content": "Bạn đã đổi \"Voucher tra sua 50k\" với 100 điểm",
      "type": "reward_redeemed",
      "is_read": false,
      "created_at": "2026-04-04T00:55:00.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 3, "totalPages": 1 }
}
```

**Notification Types:**
| Type | Mô tả |
|------|-------|
| `new_reward` | Admin tạo reward mới |
| `reward_redeemed` | User đổi thưởng thành công |
| `task_completed` | Hoàn thành task, nhận điểm |
| `level_up` | Lên level |

---

### GET `/api/notifications/unread-count`

Số thông báo chưa đọc.

**Response (200):**
```json
{
  "success": true,
  "message": "Thành công",
  "data": {
    "unreadCount": 3
  }
}
```

---

### PUT `/api/notifications/:id/read`

Đánh dấu 1 thông báo đã đọc.

**Response (200):**
```json
{
  "success": true,
  "message": "Thành công",
  "data": [1]
}
```

---

### PUT `/api/notifications/read-all`

Đánh dấu tất cả thông báo đã đọc.

**Response (200):**
```json
{
  "success": true,
  "message": "Thành công",
  "data": [2]
}
```

---

## 🔌 Socket.io Events

**Kết nối:** `ws://localhost:3000` với auth token.

```javascript
const socket = io('http://localhost:3000', {
  auth: { token: 'Bearer eyJ...' }
});
```

**Events nhận được (Client lắng nghe):**

| Event | Target | Data | Khi nào |
|-------|--------|------|---------|
| `notification:new` | User cụ thể | `{ title, type }` | Có thông báo mới |
| `leaderboard:update` | Tất cả | `{ top10: [...] }` | Bảng xếp hạng thay đổi |
| `reward:new` | Tất cả | `{ reward: { id, title, point_cost } }` | Admin tạo reward |
| `level:up` | User cụ thể | `{ newLevel, levelName, totalPoints }` | User lên level |

---

## 🧪 Test Accounts

| Email | Password | Role | Points |
|-------|----------|------|--------|
| minhtam@test.com | 123456 | User (role_id=2) | 100 |
| admin@test.com | 123456 | Admin (role_id=1) | 0 |
