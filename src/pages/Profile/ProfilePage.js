import React, { useState, useEffect } from 'react';
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import '../../assets/styles/profile.css';

function ProfilePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setFormData({
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      gender: user.gender || '',
      dateOfBirth: user.dateOfBirth || '',
      location: user.location || ''
    });
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate phone number
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      setError('Số điện thoại phải gồm đúng 10 chữ số.');
      return;
    }

    // Validate date of birth
    const today = new Date();
    const dob = new Date(formData.dateOfBirth);
    if (formData.dateOfBirth && dob >= today) {
      setError('Ngày sinh không hợp lệ. Vui lòng chọn một ngày trước hôm nay.');
      return;
    }

    // Check if email is already used by another user
    try {
      const res = await fetch(`http://localhost:9999/users?email=${formData.email}`);
      const users = await res.json();
      const emailExists = users.some(u => u.email === formData.email && u.id !== user.id);
      if (emailExists) {
        setError('Email đã được sử dụng bởi người dùng khác!');
        return;
      }

      const response = await fetch(`http://localhost:9999/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, role: user.role, id: user.id })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setSuccess('Thông tin đã được cập nhật thành công!');
        setIsEditing(false);
      } else {
        setError('Cập nhật thông tin thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng kiểm tra kết nối và thử lại.');
    }
  };

  return (
    <Container className="my-5 profile-container">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="mb-4 text-center">Thông tin cá nhân</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          {!isEditing ? (
            <div>
              <p><strong>Tên người dùng:</strong> {formData.username}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Số điện thoại:</strong> {formData.phone}</p>
              <p><strong>Giới tính:</strong> {formData.gender === 'male' ? 'Nam' : formData.gender === 'female' ? 'Nữ' : 'Khác'}</p>
              <p><strong>Ngày sinh:</strong> {formData.dateOfBirth}</p>
              <p><strong>Địa điểm:</strong> {formData.location}</p>
              <Button
                variant="primary"
                className="mt-3"
                onClick={() => setIsEditing(true)}
                style={{ background: '#3989CE', borderColor: '#3989CE' }}
              >
                Chỉnh sửa
              </Button>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-spacing">Tên người dùng</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-spacing">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-spacing">Số điện thoại</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-spacing">Giới tính</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-spacing">Ngày sinh</Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-spacing">Địa điểm</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  type="submit"
                  style={{ background: '#3989CE', borderColor: '#3989CE' }}
                >
                  Lưu
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Hủy
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProfilePage;