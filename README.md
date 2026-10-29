# Hệ Thống Quản Lý Món Ăn

- Họ và tên: Nguyễn Hữu Thái
- MSSV: 236862

## 1. Mô tả đề tài
Xây dựng và triển khai hệ thống quản lý món ăn trên nền tảng đám mây bao gồm Frontend (React), Backend API (Node.js/Express) và Cơ sở dữ liệu (MongoDB Atlas).

## 2. Thông Tin Triển Khai (Render & Cloud)
- **Frontend Live URL:** https://web-236862.onrender.com
- **Backend API URL:** https://api-236862.onrender.com
- **API Endpoint Foods:** https://api-236862.onrender.com/api/foods
- **Database:** MongoDB Atlas (Cluster0 / Database: `236862_NguyenHuuThai`)

## 3. Công nghệ sử dụng
- **Frontend:** React, Axios
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB Atlas
- **Containerization:** Docker, Docker Hub
- **Deployment:** Render

## 4. Cấu trúc dự án
- `frontend/`: Mã nguồn ứng dụng React
- `backend/`: Mã nguồn Node.js/Express API (bao gồm `seed.js` tạo dữ liệu mẫu)
- `.gitignore`: Cấu hình bỏ qua các file nhạy cảm (`.env`, `node_modules/`)
- `README.md`: Tài liệu hướng dẫn dự án

## 5. Hướng dẫn cài đặt và chạy ứng dụng

### Chạy Backend (Chế độ Local)
```bash
cd backend
npm install
node seed.js    # Khởi tạo 3 món ăn mẫu vào MongoDB Atlas
npm start       # Chạy máy chủ API ở cổng 5000