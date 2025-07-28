import React, { useState } from "react";
import {
    Container, Row, Col, Card, Form, Button, Table, Badge, InputGroup
} from "react-bootstrap";

export default function EventCreateNotification() {
    const [title, setTitle] = useState("");
    const [recipient, setRecipient] = useState("all");
    const [event, setEvent] = useState("");
    const [content, setContent] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [sendTime, setSendTime] = useState("");
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Thông báo 1",
            time: "15/11/2023 10:00",
            recipient: "Tất cả người dùng",
            status: "Đã gửi",
            readRate: "80%"
        },
        {
            id: 2,
            title: "Thông báo 2",
            time: "14/11/2023 09:00",
            recipient: "Người tham gia sự kiện",
            status: "Đang chờ",
            readRate: "50%"
        }
    ]);
    const [search, setSearch] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
       
        alert("Đã gửi thông báo!");
    };

    return (
        <Container fluid className="py-4 main-content">
            <Row>
                <Col md={2}>
                    <Card className="mb-4">
                        <Card.Body>
                            <h5 className="mb-3">Menu</h5>
                            <div className="d-grid gap-2">
                                <Button variant="outline-primary" size="sm">Tổng quan</Button>
                                <Button variant="outline-primary" size="sm">Danh sách sự kiện</Button>
                                <Button variant="outline-primary" size="sm">Quản lý người tham gia</Button>
                                <Button variant="primary" size="sm">Gửi thông báo</Button>
                                <Button variant="outline-primary" size="sm">Cài đặt</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={10}>
                    <h2 className="mb-4">Gửi Thông Báo</h2>
                    <Row className="g-4">
                        <Col md={6}>
                            <Card>
                                <Card.Body>
                                    <h5 className="mb-3">Tạo Thông Báo Mới</h5>
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tiêu đề thông báo</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={title}
                                                onChange={e => setTitle(e.target.value)}
                                                placeholder="Nhập tiêu đề thông báo"
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Đối tượng nhận</Form.Label>
                                            <Form.Select
                                                value={recipient}
                                                onChange={e => setRecipient(e.target.value)}
                                            >
                                                <option value="all">Tất cả người dùng</option>
                                                <option value="participants">Người tham gia sự kiện</option>
                                                <option value="specific">Nhóm người dùng cụ thể</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Chọn sự kiện liên quan (tùy chọn)</Form.Label>
                                            <Form.Select
                                                value={event}
                                                onChange={e => setEvent(e.target.value)}
                                            >
                                                <option value="">Chọn sự kiện</option>
                                                <option value="event1">Giải đấu câu cá HN 2023</option>
                                                <option value="event2">Workshop kỹ thuật câu hiện đại</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nội dung thông báo</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                value={content}
                                                onChange={e => setContent(e.target.value)}
                                                placeholder="Nhập nội dung thông báo"
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Upload file đính kèm (nếu có)</Form.Label>
                                            <Form.Control
                                                type="file"
                                                onChange={e => setAttachment(e.target.files[0])}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Hẹn giờ gửi</Form.Label>
                                            <Form.Control
                                                type="datetime-local"
                                                value={sendTime}
                                                onChange={e => setSendTime(e.target.value)}
                                            />
                                        </Form.Group>
                                        <div className="d-flex gap-2">
                                            <Button variant="outline-secondary" type="button">
                                                Lưu nháp
                                            </Button>
                                            <Button variant="primary" type="submit">
                                                Gửi ngay
                                            </Button>
                                            <Button variant="outline-dark" type="button">
                                                Hủy
                                            </Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card>
                                <Card.Body>
                                    <h5 className="mb-3">Xem trước thông báo</h5>
                                    <div className="border rounded p-3 bg-light">
                                        <h6 className="fw-bold">{title || "Tiêu đề thông báo"}</h6>
                                        <div>{content || "Nội dung thông báo sẽ hiển thị ở đây. Bạn có thể xem trước nội dung thông báo của mình."}</div>
                                        <div className="text-muted mt-2" style={{ fontSize: 13 }}>
                                            Đối tượng nhận: {recipient === "all" ? "Tất cả người dùng" : recipient === "participants" ? "Người tham gia sự kiện" : "Nhóm người dùng cụ thể"}
                                        </div>
                                        <div className="text-muted" style={{ fontSize: 13 }}>
                                            Thời gian gửi: {sendTime ? new Date(sendTime).toLocaleString("vi-VN") : "Chưa chọn"}
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Card className="mt-4">
                        <Card.Body>
                            <h5 className="mb-3">Danh sách thông báo đã gửi</h5>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    placeholder="Tìm kiếm thông báo..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </InputGroup>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Tiêu đề</th>
                                        <th>Thời gian gửi</th>
                                        <th>Đối tượng nhận</th>
                                        <th>Trạng thái</th>
                                        <th>Tỷ lệ đã đọc</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notifications
                                        .filter(n => n.title.toLowerCase().includes(search.toLowerCase()))
                                        .map(n => (
                                            <tr key={n.id}>
                                                <td>{n.title}</td>
                                                <td>{n.time}</td>
                                                <td>{n.recipient}</td>
                                                <td>
                                                    <Badge bg={n.status === "Đã gửi" ? "success" : "warning"}>
                                                        {n.status}
                                                    </Badge>
                                                </td>
                                                <td>{n.readRate}</td>
                                                <td>
                                                    <Button variant="outline-primary" size="sm" className="me-1">
                                                        <i className="fas fa-eye"></i>
                                                    </Button>
                                                    <Button variant="outline-danger" size="sm">
                                                        <i className="fas fa-trash-alt"></i>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                    <Row className="mt-4">
                        <Col md={6}>
                            <Card>
                                <Card.Body>
                                    <h5 className="mb-3">Thống kê hiệu quả</h5>
                                    <div className="d-flex flex-column gap-2">
                                        <div className="d-flex justify-content-between">
                                            <span>Tổng số thông báo đã gửi:</span>
                                            <span className="fw-semibold">10</span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span>Tỷ lệ mở thông báo:</span>
                                            <span className="fw-semibold">75%</span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span>Tỷ lệ click link:</span>
                                            <span className="fw-semibold">30%</span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span>Thời gian phản hồi trung bình:</span>
                                            <span className="fw-semibold">2 phút</span>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}