import React, { useState, useEffect } from "react";
import {
    Container, Row, Col, Card, Button, Form, InputGroup, Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext"; 

export default function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate(); 
    const { user } = useAuth(); 
    const [event, setEvent] = useState(null);
    const [terms, setTerms] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        age: "",
        gender: "Nam"
    });
    const [isRegistered, setIsRegistered] = useState(false);
    const isValidPhoneNumber = (phone) => {
    
    const regex = /^(0|\+84)[0-9]{9}$/;
    return regex.test(phone);
};

const isValidAge = (age) => {
    return Number(age) >= 18;
};

    useEffect(() => {
        fetch(`http://localhost:9999/events/${id}`)
            .then(res => res.json())
            .then(data => setEvent(data));

        if (user) {
            fetch(`http://localhost:9999/registrations?eventId=${id}&userId=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.length > 0) {
                        setIsRegistered(true);
                        // Set lại form bằng thông tin đã đăng ký
                        setForm({
                            name: data[0].name || "",
                            phone: data[0].phone || "",
                            email: data[0].email || "",
                            age: data[0].age || "",
                            gender: data[0].gender || "Nam"
                        });
                    } else {
                        setIsRegistered(false);
                        // Nếu chưa đăng ký thì có thể set form về mặc định hoặc giữ nguyên
                    }
                });
        }
    }, [id, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
        navigate("/login");
        return;
    }

    if (!terms) {
        setShowAlert(true);
        return;
    }

    if (!isValidPhoneNumber(form.phone)) {
        alert("Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng Việt Nam (bắt đầu bằng 0 và có 10 chữ số).");
        return;
    }

    if (!isValidAge(form.age)) {
        alert("Tuổi phải từ 18 trở lên để tham gia sự kiện.");
        return;
    }

    
    const registration = {
        eventId: event.id,
        userId: user.id,
        ...form,
        registeredAt: new Date().toISOString()
    };

    await fetch("http://localhost:9999/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registration)
    });

    await fetch(`http://localhost:9999/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participants: Number(event.participants) + 1 })
    });

    const updated = await fetch(`http://localhost:9999/events/${event.id}`)
        .then(res => res.json());
    setEvent(updated);
    setIsRegistered(true);
    alert("Đăng ký thành công!");
};


    const handleCancel = async () => {
       
        const res = await fetch(`http://localhost:9999/registrations?eventId=${event.id}&userId=${user.id}`);
        const data = await res.json();
        if (data.length > 0) {
           
            await fetch(`http://localhost:9999/registrations/${data[0].id}`, { method: "DELETE" });
           
            await fetch(`http://localhost:9999/events/${event.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ participants: Number(event.participants) - 1 })
            });
            
            await fetch(`http://localhost:9999/events/${event.id}`)
                .then(res => res.json())
                .then(data => setEvent(data));
            setIsRegistered(false);
            alert("Đã hủy đăng ký!");
        }
    };

    return (
        <Container className="py-4 main-content">
            <Row>
                <Col lg={5} className="mb-4">
                    <Card>
                        {event && (
                            <>
                                <Card.Img variant="top" src={event.image} style={{ height: 250, objectFit: "cover" }} />
                                <Card.Body>
                                    <Card.Title>{event.title}</Card.Title>
                                    <Card.Text>
                                        <b>Thời gian:</b> {event.startDate} -{event.endDate}<br />
                                        <b>Địa điểm:</b> {event.location}<br />
                                        <b>Số lượng:</b> {event.participants}/{event.maxParticipants} người đã đăng ký<br />
                                        <b>Trạng thái:</b> {event.status}<br />
                                    </Card.Text>
                                    <hr />
                                    <b>Mô tả sự kiện</b>
                                    <div className="text-muted" style={{ fontSize: 15 }}>
                                        {event.description}
                                    </div>
                                    <hr />
                                    <b>Giải thưởng</b>
                                    {event.hasPrize && event.prizeDetail ? (
                                        <div className="mb-2">{event.prizeDetail}</div>
                                    ) : (
                                        <div className="mb-2 text-muted">Không có giải thưởng</div>
                                    )}
                                    
                                </Card.Body>
                            </>
                        )}
                    </Card>
                </Col>
                <Col lg={7}>
                    <Card>
                        <Card.Body>
                            <h2 className="mb-4">Đăng ký tham gia</h2>
                            {showAlert && (
                                <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                                    Vui lòng đồng ý với điều khoản và điều kiện để tiếp tục.
                                </Alert>
                            )}
                            <Form onSubmit={handleSubmit}>
                                <h5 className="mb-3">Thông tin cá nhân</h5>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Họ và tên <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Số điện thoại <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                required
                                                type="tel"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                required
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tuổi</Form.Label>
                                            <Form.Control
                                                type="number"
                                                min={1}
                                                name="age"
                                                value={form.age}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Giới tính</Form.Label>
                                            <div>
                                                <Form.Check
                                                    inline
                                                    label="Nam"
                                                    name="gender"
                                                    type="radio"
                                                    value="Nam"
                                                    checked={form.gender === "Nam"}
                                                    onChange={handleChange}
                                                />
                                                <Form.Check
                                                    inline
                                                    label="Nữ"
                                                    name="gender"
                                                    type="radio"
                                                    value="Nữ"
                                                    checked={form.gender === "Nữ"}
                                                    onChange={handleChange}
                                                />
                                                <Form.Check
                                                    inline
                                                    label="Khác"
                                                    name="gender"
                                                    type="radio"
                                                    value="Khác"
                                                    checked={form.gender === "Khác"}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="my-3">
                                    <Form.Check
                                        type="checkbox"
                                        label={<>Tôi đã đọc và đồng ý với <a href="#">Điều khoản và Điều kiện</a> của sự kiện.</>}
                                        checked={terms}
                                        onChange={e => setTerms(e.target.checked)}
                                    />
                                </Form.Group>
                                <div className="d-flex justify-content-end">
                                    {isRegistered ? (
                                        <Button variant="danger" size="lg" onClick={handleCancel}>
                                            Hủy đăng ký
                                        </Button>
                                    ) : (
                                        <Button type="submit" variant="primary" size="lg">
                                            Đăng ký tham gia
                                        </Button>
                                    )}
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}