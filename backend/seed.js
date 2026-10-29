const mongoose = require('mongoose');
require('dotenv').config();
const Food = require('./models/Food');

const sampleFoods = [
  {
    foodId: 'F001',
    name: 'Phở Bò',
    category: 'Món nước',
    cuisine: 'Việt Nam',
    ingredients: ['Bánh phở', 'Thịt bò', 'Nước dùng', 'Hành lá'],
    price: 50000,
    quantity: 20,
    description: 'Phở bò truyền thống hương vị đậm đà.',
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43'
  },
  {
    foodId: 'F002',
    name: 'Cơm Tấm Sườn Bì Chả',
    category: 'Món chính',
    cuisine: 'Việt Nam',
    ingredients: ['Cơm tấm', 'Sườn nướng', 'Bì', 'Chả trứng', 'Nước mắm'],
    price: 45000,
    quantity: 30,
    description: 'Cơm tấm Sài Gòn thơm ngon chuẩn vị.',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
  },
  {
    foodId: 'F003',
    name: 'Bánh Mỳ Thịt Nướng',
    category: 'Ăn nhanh',
    cuisine: 'Việt Nam',
    ingredients: ['Vỏ bánh mỳ', 'Thịt nướng', 'Dưa góp', 'Rau thơm'],
    price: 25000,
    quantity: 50,
    description: 'Bánh mỳ giòn rụm nhân thịt nướng đậm đà.',
    imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569'
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Đã kết nối MongoDB Atlas để tạo dữ liệu mẫu...');
    await Food.deleteMany({}); // Xóa dữ liệu cũ nếu có
    await Food.insertMany(sampleFoods);
    console.log('Đã thêm thành công 3 món ăn mẫu vào Database!');
    process.exit();
  })
  .catch(err => {
    console.error('Lỗi khi thêm dữ liệu mẫu:', err);
    process.exit(1);
  });