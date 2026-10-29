# Quản Lý Món Ăn - MSSV 236862

## Thông Tin Docker Hub Images
- **Backend Image:** `nguyenhuuthai1511/backend`
- **Frontend Image:** `nguyenhuuthai1511/frontend`

---

## Hướng Dẫn Chạy Bằng Docker

### 1. Chạy Backend Container
```bash
docker pull nguyenhuuthai1511/backend
docker run -d -p 5000:5000 --name backend-app -e PORT=5000 -e MONGO_URI="mongodb+srv://admin:123123Aa@cluster0.eaue62x.mongodb.net/236862_NguyenHuuThai?retryWrites=true&w=majority" nguyenhuuthai1511/backend