# 🧠 BẢN GIẢI THÍCH CHUYÊN SÂU: THUẬT TOÁN, MODEL, API VÀ SOCKET.IO

> **Tài liệu dành cho:** Phục vụ báo cáo đồ án, phỏng vấn, giải thích sâu về kỹ thuật đã áp dụng trong dự án Task & Habit Gamification System.
> **Tác giả:** Trần Biện Minh Tâm

Tài liệu này sẽ mổ xẻ những "bộ não" đằng sau hệ thống của chúng ta một cách cực kỳ dễ hiểu nhưng không kém phần chuyên sâu.

---

## 1. Các Thư Viện Chìa Khóa (Core Libraries)

Thay vì "phát minh lại cái bánh xe", dự án sử dụng các thư viện đã được tối ưu hóa tốt nhất trong hệ sinh thái Node.js.

- **Express.js (`express`)**: Bộ khung (Framework) mỏng nhẹ của Node.js. Nó giúp tạo ra các Server và quản lý các Route (URL) một cách nhanh chóng.
- **Sequelize (`sequelize`)**: Một ORM (Object-Relational Mapper). Thay vì phải viết các câu lệnh SQL trần trụi (như `SELECT * FROM users`), Sequelize cho phép ta thao tác với Database bằng Code JavaScript (`User.findAll()`). Nó giúp code trong sáng và dễ chống lại lỗi bảo mật SQL Injection.
- **Socket.io (`socket.io`)**: Thư viện thần thánh dành cho Realtime (Thời gian thực). Khác với HTTP truyền thống, Socket duy trì một "đường ống" kết nối liên tục giữa Server và Client.
- **JsonWebToken (`jsonwebtoken`)**: Thư viện cấp phát vé (Token) để chứng minh người dùng là ai sau khi đăng nhập thành công.
- **Multer (`multer`)**: Thư viện xử lý việc upload file (ảnh phần thưởng) từ Client gửi lên Server qua `multipart/form-data`.

---

## 2. Models & Kiến Trúc Áp Dụng

Mô hình chúng ta đang dùng là mô hình phân tầng **Controller - Service - Repository (CSR)** kết hợp với **MVC** (Model-View-Controller).

### Tại sao lại chia các tầng này?
Nếu ném tất cả vào một chỗ, code sẽ giống như một "bát mì Ý" rối rắm. Chúng ta chia ra để dễ quản lý:
1. **Model** (VD: `Reward.js`): Chỉ làm 1 việc duy nhất là định nghĩa xem cái Bảng trong Database trông như nào (có cột id, cột title,...).
2. **Repository**: Chuyên đi nói chuyện với Database. Chỉ được quyền lấy/sửa/xóa dữ liệu. (VD: "Lấy cho tôi top 10 ông nhiều điểm nhất").
3. **Service**: Đây là **bộ não (Business Logic)**. Chứa thuật toán và các điều kiện phức tạp. (VD: Kiểm tra xem ông này đủ điểm không, kho còn hàng không, nếu thỏa mãn thì gọi Repository trừ điểm).
4. **Controller**: Người giao tiếp với khách hàng (Frontend). Nhận data từ khách, ném cho Service xử lý, rồi trả kết quả (`res.json`) lại cho khách.

---

## 3. Thuật Toán Và Logic Xử Lý Cốt Lõi

Khái niệm "Thuật toán" trong kỹ thuật phần mềm web thường chính là **luồng xử lý tối ưu**.

### Thuật toán xếp hạng (Leaderboard Sorting)
- **Logic:** Lấy tất cả user, sắp xếp theo `total_points` giảm dần (`ORDER BY total_points DESC`).
- **Phân trang (Pagination Algorithm):** 
  Sử dụng công thức `Offset = (Page - 1) * Limit`. 
  *Ví dụ:* Muốn lấy trang 2, mỗi trang 10 người -> `Offset = (2 - 1) * 10 = 10`. Tức là bỏ qua 10 người đầu tiên, lấy từ người thứ 11.

### Giải Thuật Giao Dịch An Toàn (Database Transaction)
Khi Đổi Thưởng (Redeem), đây là thuật toán quan trọng nhất để tránh lỗi **"Race Condition"** (nghĩa là 2 người bấm đổi thưởng cùng tíc tắc nhưng kho chỉ còn 1 cái).

1. **BEGIN TRANSACTION** (Khóa cửa lại, không ai được làm gián đoạn rạp chiếu phim này).
2. Kiểm tra phần thưởng tồn tại và `quantity > 0`? Nếu sai -> **ROLLBACK** (hủy bỏ, trả lại trạng thái cũ).
3. Kiểm tra user đủ `total_points >= reward.point_cost`? Nếu sai -> **ROLLBACK**.
4. Trừ lượng tồn kho phần thưởng `- 1`.
5. Trừ điểm của người dùng `- cost`.
6. Lưu lại lịch sử `PointLog`.
7. Ghi nhận đã mua vào `UserReward`.
8. **COMMIT TRANSACTION** (Mọi thứ hoàn hảo, lưu lại tất cả vào Database vĩnh viễn).

### Thuật Toán Tính Cấp Độ (Leveling System)
Thay vì lưu level chết cứng, mỗi khi điểm tăng/giảm, hệ thống sẽ chui qua một cây rẽ nhánh `IF-ELSE` bậc thang:
- `>= 1000` -> Mức 5 (Master)
- `>= 600` -> Mức 4 (Expert)
- `>= 300` -> Mức 3 (Achiever)
- `>= 100` -> Mức 2 (Learner)
- `< 100` -> Mức 1 (Beginner)
Tùy vào điểm rơi vào "bucket" (xô) nào, level sẽ được cập nhật lại vào Database.

---

## 4. Hiểu Sâu Về API (RESTful API)

### API là gì? Hãy tưởng tượng...
API giống hệt như một **Anh Bồi Bàn** trong nhà hàng.
- **Client (Frontend)**: Là bạn đang ngồi ở bàn. Bạn không được tự ý vào bếp nấu.
- **Nhà Bếp (Database + Logic)**: Nơi chế biến dữ liệu.
- **Anh Bồi Bàn (API)**: Bạn sẽ đưa tờ giấy gọi món (Request) cho anh bồi bàn. Anh bồi bàn mang vào bếp, lát sau mang đĩa thức ăn (Response - chuỗi JSON) ra cho bạn.

### RESTful là sự chuẩn hóa
Bạn không thể gọi món bằng tiếng Ả Rập, bạn phải dùng "menu" theo chuẩn (RESTful):
- **Cấu trúc dễ hiểu:** 
  - `GET /api/rewards`: Tôi muốn XEM danh sách phần thưởng.
  - `POST /api/rewards`: Tôi muốn TẠO MỚI một phần thưởng.
  - `DELETE /api/rewards/1`: Tôi muốn XÓA phần thưởng có id=1.
- Tùy vào phương thức (Method) bạn dùng mà hệ thống hiểu bạn muốn làm gì đối với "Tài nguyên" (Rewards).

---

## 5. Hiểu Sâu Về Socket.io (Realtime)

### Sao phải sinh ra Socket trong khi đã có API?
**Nhược điểm của API:** API là giao tiếp **1 chiều kiểu Hỏi - Đáp**. Bạn hỏi (Request), Server đáp (Response), xong là ngắt kết nối. Phương thức này không thể nào giải quyết được bài toán: "Khi nào có thông báo mới, Server TỰ ĐỘNG báo cho tôi với". Trừ khi bạn cứ 1 giây lại ép Client gọi API hỏi Server (kiểu polling) -> Sập Server!

### Sức mạnh của Socket.io
Socket.io tạo ra một **cuộc gọi điện thoại mở liên tục 2 chiều (WebSockets)**.
- Khi người dùng vào trang web, Client "nhấc máy" lên gọi Server.
- Đường truyền này giữ mở. Khi ai đó trong hệ thống tạo phần thưởng mới, Server chỉ cần "alo" thẳng vào tai người dùng: `socket.emit("reward:new", data)`. Hệ thống Client nhận tín hiệu và hiển thị Notification ngay lập tức mà màn hình không hề giật hay tải lại.

### Khái Niệm "Room" trong Socket.io (Tuyệt kỹ phân luồng thông báo)
Ở hệ thống này áp dụng cơ chế Căn Phòng (Rooms):
- Khi User #1 đăng nhập, hệ thống socket kết nối và đẩy họ vào căn phòng mang tên `room_user_1`.
- **Áp dụng cá nhân**: Khi User 1 hoàn thành công việc, Server muốn khen đúng User 1. Server sẽ nói: `io.to("room_user_1").emit("notification:new")`. Chỉ User 1 nghe thấy tiếng "ting ting".
- **Áp dụng toàn cục (Broadcast)**: Khi có sự kiện quy mô lớn (Bảng xếp hạng thay đổi), Server sẽ đứng ở sảnh hô to: `io.emit("leaderboard:update")`. Lúc này TẤT CẢ mọi user đang trực tuyến đều sẽ được cập nhật Bảng Xếp Hạng tại thời gian thực.
