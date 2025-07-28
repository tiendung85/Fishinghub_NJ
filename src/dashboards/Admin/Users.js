import React, { useState, useEffect } from 'react';
import { useAuth } from '../../pages/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Modal, Form, Alert, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaSearch } from 'react-icons/fa';
import '../../assets/styles/users.css';

function Users() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    location: '',
    role: 1
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user || user.role !== 3) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:9999/users');
      const data = await response.json();
      setUsers(data);
      filterUsers(data, searchTerm, roleFilter);
    } catch (err) {
      setError('Không thể tải danh sách người dùng. Vui lòng thử lại.');
    }
  };

  const filterUsers = (usersList, search, role) => {
    let filtered = usersList;
    
    if (search) {
      filtered = filtered.filter(u => 
        u.username.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (role) {
      filtered = filtered.filter(u => u.role === parseInt(role));
    }
    
    setFilteredUsers(filtered);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterUsers(users, term, roleFilter);
  };

  const handleRoleFilter = (e) => {
    const role = e.target.value;
    setRoleFilter(role);
    filterUsers(users, searchTerm, role);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      gender: user.gender || '',
      dateOfBirth: user.dateOfBirth || '',
      location: user.location || '',
      role: user.role || 1
    });
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditSubmit = async (e) => {
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

    // Check email uniqueness
    try {
      const res = await fetch(`http://localhost:9999/users?email=${formData.email}`);
      const usersData = await res.json();
      const emailExists = usersData.some(u => u.email === formData.email && u.id !== selectedUser.id);
      if (emailExists) {
        setError('Email đã được sử dụng bởi người dùng khác!');
        return;
      }

      const response = await fetch(`http://localhost:9999/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: selectedUser.id })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        setUsers(updatedUsers);
        filterUsers(updatedUsers, searchTerm, roleFilter);
        setSuccess('Cập nhật thông tin người dùng thành công!');
        setShowEditModal(false);
      } else {
        setError('Cập nhật thông tin thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng kiểm tra kết nối và thử lại.');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:9999/users/${selectedUser.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const updatedUsers = users.filter(u => u.id !== selectedUser.id);
        setUsers(updatedUsers);
        filterUsers(updatedUsers, searchTerm, roleFilter);
        setSuccess('Xóa người dùng thành công!');
        setShowDeleteModal(false);
      } else {
        setError('Xóa người dùng thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng kiểm tra kết nối và thử lại.');
    }
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4" style={{color: '#3989CE'}}>Quản lý người dùng</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <FormControl
              placeholder="Tìm kiếm theo tên người dùng"
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select value={roleFilter} onChange={handleRoleFilter}>
            <option value="">Tất cả vai trò</option>
            <option value={1}>Người dùng</option>
            <option value={2}>Chủ cửa hàng</option>
            <option value={3}>Admin</option>
          </Form.Select>
        </Col>
      </Row>
      <Table striped bordered hover responsive className="user-table">
        <thead>
          <tr>
            <th>Tên người dùng</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Giới tính</th>
            <th>Ngày sinh</th>
            <th>Địa điểm</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(u => (
            <tr key={u.id}>
              <td className="username">{u.username}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td>{u.gender === 'male' ? 'Nam' : u.gender === 'female' ? 'Nữ' : 'Khác'}</td>
              <td>{u.dateOfBirth}</td>
              <td>{u.location}</td>
              <td>{u.role === 1 ? 'Người dùng' : u.role === 2 ? 'Chủ cửa hàng' : 'Admin'}</td>
              <td>
                <Button
                  variant="link"
                  onClick={() => handleEdit(u)}
                  title="Sửa"
                  className="me-2"
                >
                  <FaEdit size={12} />
                </Button>
                <Button
                  variant="link"
                  onClick={() => handleDelete(u)}
                  title="Xóa"
                >
                  <FaTrashAlt size={12} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa thông tin người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
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
            <Form.Group className="mb-3">
              <Form.Label className="form-label-spacing">Vai trò</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value={1}>Người dùng</option>
                <option value={2}>Chủ cửa hàng</option>
                <option value={3}>Admin</option>
              </Form.Select>
            </Form.Group>
            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" style={{ background: '#3989CE', borderColor: '#3989CE' }}>
                Lưu
              </Button>
              <Button variant="outline-secondary" onClick={() => setShowEditModal(false)}>
                Hủy
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete User Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xóa người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa người dùng <strong>{selectedUser?.username}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Users;