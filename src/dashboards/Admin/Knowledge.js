import React, { useState, useEffect, Fragment } from 'react';
import '../../assets/styles/Knowledge.css';
import { InputGroup, Form, Button } from 'react-bootstrap';

export default function Knowledge() {
  const [fishList, setFishList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFish, setEditingFish] = useState(null);
  const [expandedFishId, setExpandedFishId] = useState(null); // State để quản lý dropdown
  const [newFish, setNewFish] = useState({
    id: '',
    name: '',
    characteristics: {
      appearance: '',
      size: ''
    },
    behavior: '',
    favorite_bait: '',
    image_url: '',
    info: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadFishData = async () => {
      try {
        const response = await fetch('http://localhost:9999/knowledgeFish');
        if (!response.ok) {
          throw new Error('Failed to fetch fish data');
        }
        const data = await response.json();
        setFishList(data);
      } catch (error) {
        console.error('Error loading fish data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadFishData();
  }, []);

  const validateForm = () => {
    const errors = {};
    
    // Kiểm tra ID
    if (!newFish.id) {
      errors.id = 'ID không được để trống';
    } else if (isNaN(newFish.id) || parseInt(newFish.id) <= 0) {
      errors.id = 'ID phải là số nguyên dương';
    } else if (fishList.some(fish => fish.id === parseInt(newFish.id))) {
      errors.id = 'ID đã tồn tại trong hệ thống';
    }
    
    // Kiểm tra tên cá
    if (!newFish.name.trim()) {
      errors.name = 'Tên cá không được để trống';
    }
    
    // Kiểm tra đặc điểm ngoại hình
    if (!newFish.characteristics.appearance.trim()) {
      errors.appearance = 'Đặc điểm ngoại hình không được để trống';
    }
    
    // Kiểm tra kích thước
    if (!newFish.characteristics.size.trim()) {
      errors.size = 'Kích thước không được để trống';
    }
    
    // Kiểm tra tập tính
    if (!newFish.behavior.trim()) {
      errors.behavior = 'Tập tính không được để trống';
    }
    
    // Kiểm tra mồi yêu thích
    if (!newFish.favorite_bait.trim()) {
      errors.favorite_bait = 'Mồi yêu thích không được để trống';
    }
    
    // Kiểm tra URL ảnh
    if (!newFish.image_url.trim()) {
      errors.image_url = 'URL ảnh không được để trống';
    }
    
    // Kiểm tra thông tin
    if (!newFish.info.trim()) {
      errors.info = 'Thông tin không được để trống';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEditForm = () => {
    const errors = {};
    
    // Kiểm tra tên cá
    if (!editingFish.name.trim()) {
      errors.name = 'Tên cá không được để trống';
    }
    
    // Kiểm tra đặc điểm ngoại hình
    if (!editingFish.characteristics.appearance.trim()) {
      errors.appearance = 'Đặc điểm ngoại hình không được để trống';
    }
    
    // Kiểm tra kích thước
    if (!editingFish.characteristics.size.trim()) {
      errors.size = 'Kích thước không được để trống';
    }
    
    // Kiểm tra tập tính
    if (!editingFish.behavior.trim()) {
      errors.behavior = 'Tập tính không được để trống';
    }
    
    // Kiểm tra mồi yêu thích
    if (!editingFish.favorite_bait.trim()) {
      errors.favorite_bait = 'Mồi yêu thích không được để trống';
    }
    
    // Kiểm tra URL ảnh
    if (!editingFish.image_url.trim()) {
      errors.image_url = 'URL ảnh không được để trống';
    }
    
    // Kiểm tra thông tin
    if (!editingFish.info.trim()) {
      errors.info = 'Thông tin không được để trống';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddNew = () => {
    setShowAddModal(true);
    setNewFish({
      id: '',
      name: '',
      characteristics: {
        appearance: '',
        size: ''
      },
      behavior: '',
      favorite_bait: '',
      image_url: '',
      info: ''
    });
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const fishToAdd = {
        ...newFish,
        id: parseInt(newFish.id)
      };
      
      const response = await fetch('http://localhost:9999/knowledgeFish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fishToAdd)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add fish');
      }
      
      // Thêm vào danh sách local
      setFishList(prev => [...prev, fishToAdd]);
      setShowAddModal(false);
      alert('Thêm thông tin cá thành công!');
      
    } catch (error) {
      console.error('Error adding fish:', error);
      alert('Có lỗi xảy ra khi thêm thông tin cá!');
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'appearance' || field === 'size') {
      setNewFish(prev => ({
        ...prev,
        characteristics: {
          ...prev.characteristics,
          [field]: value
        }
      }));
    } else {
      setNewFish(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleEdit = (fishId) => {
    const fishToEdit = fishList.find(fish => fish.id === fishId);
    if (fishToEdit) {
      setEditingFish({
        ...fishToEdit,
        id: fishToEdit.id.toString() // Convert to string for form input
      });
      setShowEditModal(true);
      setFormErrors({});
    }
  };

  const handleDelete = async (fishId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thông tin cá này?')) {
      try {
        const response = await fetch(`http://localhost:9999/knowledgeFish/${fishId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete fish');
        }
        
        // Remove from local list
        setFishList(prev => prev.filter(fish => fish.id !== fishId));
        alert('Xóa thông tin cá thành công!');
        
      } catch (error) {
        console.error('Error deleting fish:', error);
        alert('Có lỗi xảy ra khi xóa thông tin cá!');
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEditForm()) {
      return;
    }
    
    try {
      const fishToUpdate = {
        ...editingFish,
        id: parseInt(editingFish.id)
      };
      
      const response = await fetch(`http://localhost:9999/knowledgeFish/${fishToUpdate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fishToUpdate)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update fish');
      }
      
      // Update local list
      setFishList(prev => prev.map(fish => 
        fish.id === fishToUpdate.id ? fishToUpdate : fish
      ));
      setShowEditModal(false);
      setEditingFish(null);
      alert('Cập nhật thông tin cá thành công!');
      
    } catch (error) {
      console.error('Error updating fish:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin cá!');
    }
  };

  const handleEditInputChange = (field, value) => {
    if (field === 'appearance' || field === 'size') {
      setEditingFish(prev => ({
        ...prev,
        characteristics: {
          ...prev.characteristics,
          [field]: value
        }
      }));
    } else {
      setEditingFish(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Lọc danh sách cá theo tên
  const filteredFishList = fishList.filter(fish =>
    fish.name.toLowerCase().includes(search.toLowerCase())
  );

  // Hàm xử lý toggle dropdown
  const toggleFishDetails = (fishId) => {
    setExpandedFishId(expandedFishId === fishId ? null : fishId);
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="text-center py-5">
          <div className="alert alert-danger" role="alert">
            <h4>Lỗi khi tải dữ liệu</h4>
            <p>{error}</p>
            <p>Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="main-content">
      <div className="knowledge-header">
        <h1>Quản lý thông tin cá</h1>
        <button 
          className="btn btn-primary add-fish-btn"
          onClick={handleAddNew}
        >
          <i className="fas fa-plus"></i> Thêm thông tin cá
        </button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="mb-3" style={{maxWidth: 400}}>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tên cá..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Tìm kiếm theo tên cá"
          />
          {search && (
            <Button variant="outline-secondary" onClick={() => setSearch('')}>X</Button>
          )}
        </InputGroup>
      </div>

      {/* Bảng danh sách cá */}
      <div className="fish-table-container">
        {filteredFishList.length === 0 ? (
          <div className="no-data">
            <p>Chưa có thông tin cá nào được thêm.</p>
          </div>
        ) : (
          <div className="fish-table">
            {/* Header của bảng */}
            <div className="fish-table-header">
              <div className="fish-table-cell header-cell">ID</div>
              <div className="fish-table-cell header-cell">Tên</div>
              <div className="fish-table-cell header-cell">Xem</div>
              <div className="fish-table-cell header-cell">Sửa</div>
              <div className="fish-table-cell header-cell">Xóa</div>
            </div>

            {/* Danh sách cá */}
            {filteredFishList.map((fish, index) => (
              <Fragment key={fish.id}>
                <div className="fish-table-row">
                  <div className="fish-table-cell">{fish.id}</div>
                  <div className="fish-table-cell">{fish.name}</div>
                  <div className="fish-table-cell">
                    <button 
                      className="btn btn-info btn-sm"
                      onClick={() => toggleFishDetails(fish.id)}
                      title="Xem thông tin chi tiết"
                    >
                      <i className="fas fa-eye"></i> Xem
                    </button>
                  </div>
                  <div className="fish-table-cell">
                    <button 
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(fish.id)}
                      title="Sửa thông tin"
                    >
                      <i className="fas fa-edit"></i> Sửa
                    </button>
                  </div>
                  <div className="fish-table-cell">
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(fish.id)}
                      title="Xóa thông tin"
                    >
                      <i className="fas fa-trash"></i> Xóa
                    </button>
                  </div>
                </div>

                {/* Dropdown thông tin chi tiết */}
                {expandedFishId === fish.id && (
                  <div className="fish-details-dropdown">
                    <div className="fish-details-content">
                      <div className="fish-details-grid">
                        <div className="fish-image-section">
                          <img 
                            src={fish.image_url} 
                            alt={fish.name}
                            className="fish-detail-image"
                            onError={(e) => {
                              e.target.src = '/placeholder-fish.jpg';
                              e.target.alt = 'Không thể tải ảnh';
                            }}
                          />
                        </div>
                        <div className="fish-info-section">
                          <h4>{fish.name}</h4>
                          <div className="fish-details-list">
                            <div className="detail-item">
                              <strong>Đặc điểm ngoại hình:</strong>
                              <p>{fish.characteristics?.appearance}</p>
                            </div>
                            <div className="detail-item">
                              <strong>Kích thước:</strong>
                              <p>{fish.characteristics?.size}</p>
                            </div>
                            <div className="detail-item">
                              <strong>Tập tính:</strong>
                              <p>{fish.behavior}</p>
                            </div>
                            <div className="detail-item">
                              <strong>Mồi yêu thích:</strong>
                              <p>{fish.favorite_bait}</p>
                            </div>
                            <div className="detail-item">
                              <strong>Thông tin bổ sung:</strong>
                              <p>{fish.info}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Add Fish Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Thêm thông tin cá mới</h3>
              <button 
                className="btn-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label>ID *</label>
                <input
                  type="number"
                  value={newFish.id}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  className={`form-control ${formErrors.id ? 'is-invalid' : ''}`}
                  placeholder="Nhập ID cá"
                />
                {formErrors.id && <div className="invalid-feedback">{formErrors.id}</div>}
              </div>

              <div className="form-group">
                <label>Tên cá *</label>
                <input
                  type="text"
                  value={newFish.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                  placeholder="Nhập tên cá"
                />
                {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
              </div>

              <div className="form-group">
                <label>Đặc điểm ngoại hình *</label>
                <textarea
                  value={newFish.characteristics.appearance}
                  onChange={(e) => handleInputChange('appearance', e.target.value)}
                  className={`form-control ${formErrors.appearance ? 'is-invalid' : ''}`}
                  placeholder="Mô tả đặc điểm ngoại hình"
                  rows="3"
                />
                {formErrors.appearance && <div className="invalid-feedback">{formErrors.appearance}</div>}
              </div>

              <div className="form-group">
                <label>Kích thước *</label>
                <input
                  type="text"
                  value={newFish.characteristics.size}
                  onChange={(e) => handleInputChange('size', e.target.value)}
                  className={`form-control ${formErrors.size ? 'is-invalid' : ''}`}
                  placeholder="Ví dụ: Chiều dài 20-30cm, trọng lượng 0.5-1kg"
                />
                {formErrors.size && <div className="invalid-feedback">{formErrors.size}</div>}
              </div>

              <div className="form-group">
                <label>Tập tính *</label>
                <textarea
                  value={newFish.behavior}
                  onChange={(e) => handleInputChange('behavior', e.target.value)}
                  className={`form-control ${formErrors.behavior ? 'is-invalid' : ''}`}
                  placeholder="Mô tả tập tính của cá"
                  rows="3"
                />
                {formErrors.behavior && <div className="invalid-feedback">{formErrors.behavior}</div>}
              </div>

              <div className="form-group">
                <label>Mồi yêu thích *</label>
                <input
                  type="text"
                  value={newFish.favorite_bait}
                  onChange={(e) => handleInputChange('favorite_bait', e.target.value)}
                  className={`form-control ${formErrors.favorite_bait ? 'is-invalid' : ''}`}
                  placeholder="Ví dụ: Giun, Côn trùng, Tôm"
                />
                {formErrors.favorite_bait && <div className="invalid-feedback">{formErrors.favorite_bait}</div>}
              </div>

              <div className="form-group">
                <label>URL ảnh *</label>
                <input
                  type="url"
                  value={newFish.image_url}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  className={`form-control ${formErrors.image_url ? 'is-invalid' : ''}`}
                  placeholder="Nhập URL ảnh cá"
                />
                {formErrors.image_url && <div className="invalid-feedback">{formErrors.image_url}</div>}
              </div>

              <div className="form-group">
                <label>Thông tin bổ sung *</label>
                <textarea
                  value={newFish.info}
                  onChange={(e) => handleInputChange('info', e.target.value)}
                  className={`form-control ${formErrors.info ? 'is-invalid' : ''}`}
                  placeholder="Thông tin về giá trị dinh dưỡng, ẩm thực, v.v."
                  rows="3"
                />
                {formErrors.info && <div className="invalid-feedback">{formErrors.info}</div>}
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Thêm cá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Fish Modal */}
      {showEditModal && editingFish && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Sửa thông tin cá</h3>
              <button 
                className="btn-close"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingFish(null);
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="modal-body">
              <div className="form-group">
                <label>ID *</label>
                <input
                  type="number"
                  value={editingFish.id}
                  onChange={(e) => handleEditInputChange('id', e.target.value)}
                  className={`form-control ${formErrors.id ? 'is-invalid' : ''}`}
                  placeholder="Nhập ID cá"
                  disabled
                />
                <small className="form-text text-muted">ID không thể thay đổi</small>
              </div>

              <div className="form-group">
                <label>Tên cá *</label>
                <input
                  type="text"
                  value={editingFish.name}
                  onChange={(e) => handleEditInputChange('name', e.target.value)}
                  className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                  placeholder="Nhập tên cá"
                />
                {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
              </div>

              <div className="form-group">
                <label>Đặc điểm ngoại hình *</label>
                <textarea
                  value={editingFish.characteristics.appearance}
                  onChange={(e) => handleEditInputChange('appearance', e.target.value)}
                  className={`form-control ${formErrors.appearance ? 'is-invalid' : ''}`}
                  placeholder="Mô tả đặc điểm ngoại hình"
                  rows="3"
                />
                {formErrors.appearance && <div className="invalid-feedback">{formErrors.appearance}</div>}
              </div>

              <div className="form-group">
                <label>Kích thước *</label>
                <input
                  type="text"
                  value={editingFish.characteristics.size}
                  onChange={(e) => handleEditInputChange('size', e.target.value)}
                  className={`form-control ${formErrors.size ? 'is-invalid' : ''}`}
                  placeholder="Ví dụ: Chiều dài 20-30cm, trọng lượng 0.5-1kg"
                />
                {formErrors.size && <div className="invalid-feedback">{formErrors.size}</div>}
              </div>

              <div className="form-group">
                <label>Tập tính *</label>
                <textarea
                  value={editingFish.behavior}
                  onChange={(e) => handleEditInputChange('behavior', e.target.value)}
                  className={`form-control ${formErrors.behavior ? 'is-invalid' : ''}`}
                  placeholder="Mô tả tập tính của cá"
                  rows="3"
                />
                {formErrors.behavior && <div className="invalid-feedback">{formErrors.behavior}</div>}
              </div>

              <div className="form-group">
                <label>Mồi yêu thích *</label>
                <input
                  type="text"
                  value={editingFish.favorite_bait}
                  onChange={(e) => handleEditInputChange('favorite_bait', e.target.value)}
                  className={`form-control ${formErrors.favorite_bait ? 'is-invalid' : ''}`}
                  placeholder="Ví dụ: Giun, Côn trùng, Tôm"
                />
                {formErrors.favorite_bait && <div className="invalid-feedback">{formErrors.favorite_bait}</div>}
              </div>

              <div className="form-group">
                <label>URL ảnh *</label>
                <input
                  type="url"
                  value={editingFish.image_url}
                  onChange={(e) => handleEditInputChange('image_url', e.target.value)}
                  className={`form-control ${formErrors.image_url ? 'is-invalid' : ''}`}
                  placeholder="Nhập URL ảnh cá"
                />
                {formErrors.image_url && <div className="invalid-feedback">{formErrors.image_url}</div>}
              </div>

              <div className="form-group">
                <label>Thông tin bổ sung *</label>
                <textarea
                  value={editingFish.info}
                  onChange={(e) => handleEditInputChange('info', e.target.value)}
                  className={`form-control ${formErrors.info ? 'is-invalid' : ''}`}
                  placeholder="Thông tin về giá trị dinh dưỡng, ẩm thực, v.v."
                  rows="3"
                />
                {formErrors.info && <div className="invalid-feedback">{formErrors.info}</div>}
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingFish(null);
                  }}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}