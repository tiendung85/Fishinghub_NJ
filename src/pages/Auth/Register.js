import React, { useState } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    gender: "male",
    dateOfBirth: "",
    location: "",
    role: 1, // Mặc định là "Người dùng"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") {
      setForm({ ...form, [name]: parseInt(value, 10) }); 
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Kiểm tra số điện thoại
    if (!/^\d{10}$/.test(form.phone)) {
      setError("Số điện thoại phải gồm đúng 10 chữ số.");
      return;
    }

    // Kiểm tra ngày sinh
    const today = new Date();
    const dob = new Date(form.dateOfBirth);
    if (!form.dateOfBirth || dob >= today) {
      setError("Ngày sinh không hợp lệ. Vui lòng chọn một ngày trước hôm nay.");
      return;
    }

    // Kiểm tra email đã tồn tại chưa
    const res = await fetch(`http://localhost:9999/users?email=${form.email}`);
    const users = await res.json();
    if (users.length > 0) {
      setError("Email đã được sử dụng!");
      return;
    }

    const response = await fetch("http://localhost:9999/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      setSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setError("Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", marginTop: "90px", padding: "20px" }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <div className="shadow rounded bg-white border p-4">
            <h3 className="mb-4 text-center">Đăng ký tài khoản</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Giới tính</Form.Label>
                <Form.Select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ngày sinh</Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Vai trò</Form.Label>
                <Form.Select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value={1}>Người dùng</option>
                  <option value={2}>Chủ hồ câu</option>
                </Form.Select>
              </Form.Group>
              <Button type="submit" className="btn btn-primary w-100 mb-2">
                Đăng ký
              </Button>
            </Form>
            <div className="mt-3 text-center">
              Đã có tài khoản? <a href="/login">Đăng nhập</a>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;