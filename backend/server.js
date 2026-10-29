const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Food = require('./models/Food');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// 1. Endpoint kiểm tra trạng thái hoạt động backend
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend running smoothly' });
});

// 2. API Lấy danh sách món ăn & Tìm kiếm theo từ khóa (?search=...)
app.get('/api/foods', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { cuisine: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const foods = await Food.find(query);
    res.status(200).json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu món ăn', error: err.message });
  }
});

// 3. API Xem thông tin một món ăn (theo ID MongoDB hoặc foodId)
app.get('/api/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let food;

    if (mongoose.Types.ObjectId.isValid(id)) {
      food = await Food.findById(id);
    }
    if (!food) {
      food = await Food.findOne({ foodId: id });
    }

    if (!food) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    }

    res.status(200).json(food);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết món ăn', error: err.message });
  }
});

// 4. API Thêm món ăn mới (Kiểm tra dữ liệu & trùng foodId)
app.post('/api/foods', async (req, res) => {
  try {
    const { foodId, name, price, category } = req.body;

    if (!foodId || !name || price === undefined || !category) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ các trường bắt buộc (foodId, name, price, category)' });
    }

    const existingFood = await Food.findOne({ foodId });
    if (existingFood) {
      return res.status(400).json({ message: 'Mã món ăn (foodId) đã tồn tại' });
    }

    const newFood = new Food(req.body);
    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (err) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ', error: err.message });
  }
});

// 5. API Cập nhật thông tin món ăn
app.put('/api/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let updatedFood;

    if (mongoose.Types.ObjectId.isValid(id)) {
      updatedFood = await Food.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    }
    if (!updatedFood) {
      updatedFood = await Food.findOneAndUpdate({ foodId: id }, req.body, { new: true, runValidators: true });
    }

    if (!updatedFood) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn để cập nhật' });
    }

    res.status(200).json(updatedFood);
  } catch (err) {
    res.status(400).json({ message: 'Dữ liệu cập nhật không hợp lệ', error: err.message });
  }
});

// 6. API Xóa món ăn
app.delete('/api/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let deletedFood;

    if (mongoose.Types.ObjectId.isValid(id)) {
      deletedFood = await Food.findByIdAndDelete(id);
    }
    if (!deletedFood) {
      deletedFood = await Food.findOneAndDelete({ foodId: id });
    }

    if (!deletedFood) {
      return res.status(404).json({ message: 'Không tìm thấy món ăn để xóa' });
    }

    res.status(200).json({ message: 'Xóa món ăn thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi xóa món ăn', error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));