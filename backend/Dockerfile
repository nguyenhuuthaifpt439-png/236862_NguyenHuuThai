# Sử dụng Node.js phiên bản lightweight
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json để cài đặt dependencies
COPY package*.json ./

# Cài đặt dependencies
RUN npm install --production

# Copy toàn bộ mã nguồn backend vào container
COPY . .

# Khai báo cổng ứng dụng sẽ lắng nghe
EXPOSE 5000

# Lệnh khởi chạy server
CMD ["node", "server.js"]