import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/foods';

function App() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  // Form State (Thêm/Sửa)
  const [formData, setFormData] = useState({
    foodId: '',
    name: '',
    category: '',
    cuisine: '',
    ingredients: '',
    price: '',
    quantity: '',
    description: '',
    imageUrl: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null); // Chi tiết món ăn

  // Lấy danh sách món ăn / Tìm kiếm
  const fetchFoods = async (keyword = '') => {
    setLoading(true);
    setError('');
    try {
      const url = keyword ? `${API_URL}?search=${encodeURIComponent(keyword)}` : API_URL;
      const res = await axios.get(url);
      setFoods(res.data);
    } catch (err) {
      setError('Lỗi khi tải danh sách món ăn!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    fetchFoods(search);
  };

  // Xử lý Input Form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Thêm hoặc Cập nhật món ăn
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const payload = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      ingredients: typeof formData.ingredients === 'string' 
        ? formData.ingredients.split(',').map(item => item.trim()) 
        : formData.ingredients
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
        setMessage('Cập nhật món ăn thành công!');
      } else {
        await axios.post(API_URL, payload);
        setMessage('Thêm món ăn mới thành công!');
      }
      resetForm();
      fetchFoods(search);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Chọn món ăn để sửa
  const handleEdit = (food) => {
    setEditingId(food._id);
    setFormData({
      foodId: food.foodId || '',
      name: food.name || '',
      category: food.category || '',
      cuisine: food.cuisine || '',
      ingredients: Array.isArray(food.ingredients) ? food.ingredients.join(', ') : food.ingredients || '',
      price: food.price || '',
      quantity: food.quantity || '',
      description: food.description || '',
      imageUrl: food.imageUrl || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xóa món ăn
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa món ăn này?')) return;
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessage('Xóa món ăn thành công!');
      fetchFoods(search);
    } catch (err) {
      setError('Lỗi khi xóa món ăn!');
    } finally {
      setLoading(false);
    }
  };

  // Reset Form
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      foodId: '', name: '', category: '', cuisine: '',
      ingredients: '', price: '', quantity: '', description: '', imageUrl: ''
    });
  };

  return (
    <div className="container">
      <h1>Quản Lý Món Ăn - MSSV: 236862</h1>

      {/* Thông báo lỗi / thành công */}
      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}
      {loading && <div className="loading">Đang tải dữ liệu...</div>}

      {/* Form Tìm kiếm */}
      <form onSubmit={handleSearch} className="search-form">
        <input 
          type="text" 
          placeholder="Tìm theo tên, loại món hoặc vùng miền..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <button type="submit">Tìm kiếm</button>
        <button type="button" onClick={() => { setSearch(''); fetchFoods(''); }}>Rải lọc</button>
      </form>

      {/* Form Thêm/Cập nhật */}
      <div className="form-card">
        <h2>{editingId ? 'Cập Nhật Món Ăn' : 'Thêm Món Ăn Mới'}</h2>
        <form onSubmit={handleSubmit} className="grid-form">
          <input name="foodId" placeholder="Mã món ăn (foodId) *" value={formData.foodId} onChange={handleChange} required disabled={!!editingId} />
          <input name="name" placeholder="Tên món ăn *" value={formData.name} onChange={handleChange} required />
          <input name="category" placeholder="Loại món ăn *" value={formData.category} onChange={handleChange} required />
          <input name="cuisine" placeholder="Ẩm thực / Vùng miền" value={formData.cuisine} onChange={handleChange} />
          <input name="price" type="number" placeholder="Giá bán *" value={formData.price} onChange={handleChange} required />
          <input name="quantity" type="number" placeholder="Số lượng hiện có" value={formData.quantity} onChange={handleChange} />
          <input name="imageUrl" placeholder="URL hình ảnh" value={formData.imageUrl} onChange={handleChange} />
          <input name="ingredients" placeholder="Nguyên liệu (phân cách bằng dấu phẩy)" value={formData.ingredients} onChange={handleChange} />
          <textarea name="description" placeholder="Mô tả món ăn" value={formData.description} onChange={handleChange}></textarea>
          
          <div className="form-buttons">
            <button type="submit" className="btn-primary">{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
            {editingId && <button type="button" onClick={resetForm} className="btn-secondary">Hủy</button>}
          </div>
        </form>
      </div>

      {/* Danh sách món ăn */}
      <h2>Danh Sách Món Ăn</h2>
      <div className="food-grid">
        {foods.length === 0 ? <p>Không tìm thấy món ăn nào.</p> : foods.map(food => (
          <div key={food._id} className="food-card">
            {food.imageUrl && <img src={food.imageUrl} alt={food.name} className="food-img" />}
            <div className="food-info">
              <h3>{food.name} <small>({food.foodId})</small></h3>
              <p><strong>Loại:</strong> {food.category} | <strong>Vùng miền:</strong> {food.cuisine || 'N/A'}</p>
              <p><strong>Giá:</strong> {food.price?.toLocaleString()} VNĐ | <strong>Số lượng:</strong> {food.quantity}</p>
              
              <div className="card-actions">
                <button onClick={() => setSelectedFood(food)} className="btn-info">Xem chi tiết</button>
                <button onClick={() => handleEdit(food)} className="btn-warning">Sửa</button>
                <button onClick={() => handleDelete(food._id)} className="btn-danger">Xóa</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Xem chi tiết món ăn */}
      {selectedFood && (
        <div className="modal-backdrop" onClick={() => setSelectedFood(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Chi Tiết Món Ăn: {selectedFood.name}</h2>
            {selectedFood.imageUrl && <img src={selectedFood.imageUrl} alt={selectedFood.name} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />}
            <p><strong>Mã món:</strong> {selectedFood.foodId}</p>
            <p><strong>Loại món:</strong> {selectedFood.category}</p>
            <p><strong>Ẩm thực:</strong> {selectedFood.cuisine}</p>
            <p><strong>Giá bán:</strong> {selectedFood.price?.toLocaleString()} VNĐ</p>
            <p><strong>Số lượng:</strong> {selectedFood.quantity}</p>
            <p><strong>Nguyên liệu:</strong> {Array.isArray(selectedFood.ingredients) ? selectedFood.ingredients.join(', ') : selectedFood.ingredients}</p>
            <p><strong>Mô tả:</strong> {selectedFood.description}</p>
            <button onClick={() => setSelectedFood(null)} className="btn-secondary">Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;