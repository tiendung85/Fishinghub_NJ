import React, { useEffect, useState } from "react";
import { useParams, Link, NavLink } from "react-router-dom";
import { Container, Card, Table, Button, Form, Row, Col, InputGroup, Nav } from "react-bootstrap";

export default function EventParticipants() {
    const { id } = useParams();
    const [participants, setParticipants] = useState([]);
    const [eventTitle, setEventTitle] = useState("");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    useEffect(() => {
        fetch(`http://localhost:9999/events/${id}`)
            .then(res => res.json())
            .then(event => setEventTitle(event.title));

        fetch(`http://localhost:9999/registrations?eventId=${id}`)
            .then(res => res.json())
            .then(data => setParticipants(data));
    }, [id]);

    const filtered = participants.filter(
        p =>
            (p.name && p.name.toLowerCase().includes(search.toLowerCase())) ||
            (p.email && p.email.toLowerCase().includes(search.toLowerCase())) ||
            (p.phone && p.phone.toLowerCase().includes(search.toLowerCase()))
    );

    const totalPages = Math.ceil(filtered.length / perPage);
    const startIdx = (currentPage - 1) * perPage;
    const endIdx = startIdx + perPage;
    const paginated = filtered.slice(startIdx, endIdx);

    const handlePageChange = (page) => setCurrentPage(page);
    const handlePerPageChange = (e) => {
        setPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    return (
        <Container fluid className="py-4 main-content">
            <Row>
                <Col
                    md={2}
                    className="bg-white border-end min-vh-100 p-0 shadow-sm"
                    style={{ boxShadow: "2px 0 5px rgba(0,0,0,0.05)" }}
                >
                    <Nav className="flex-column p-3">
                        <Nav.Link
                            href="/dashboardowner"
                            style={{
                                color: "#black",
                                fontWeight: 600,
                                padding: "10px 15px",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "#EBEBEB",
                                textDecoration: "none",
                            }}
                        >
                            <i className="ri-home-line me-2" style={{ fontSize: "18px" }}></i>
                            Dashboard
                        </Nav.Link>
                        <Nav.Link
                            href="#"
                            style={{
                                color: "#6c757d",
                                fontWeight: 500,
                                padding: "10px 15px",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                transition: "all 0.2s ease",
                                textDecoration: "none",
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.backgroundColor = "#f1f3f5";
                                e.currentTarget.style.color = "#0d6efd";
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = "#6c757d";
                            }}
                        >
                            <i className="ri-calendar-line me-2" style={{ fontSize: "18px" }}></i>
                            Quản lý đặt chỗ
                        </Nav.Link>
                        <Nav.Link
                            href="#"
                            style={{
                                color: "#6c757d",
                                fontWeight: 500,
                                padding: "10px 15px",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                transition: "all 0.2s ease",
                                textDecoration: "none",
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.backgroundColor = "#f1f3f5";
                                e.currentTarget.style.color = "#0d6efd";
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = "#6c757d";
                            }}
                        >
                            <i className="ri-team-line me-2" style={{ fontSize: "18px" }}></i>
                            Quản lý khách hàng
                        </Nav.Link>
                        <NavLink
                            to="/eventsmanager"
                            style={({ isActive }) => ({
                                color: isActive ? "#0d6efd" : "#6c757d",
                                fontWeight: isActive ? 600 : 500,
                                backgroundColor: isActive ? "#e7f1ff" : "transparent",
                                padding: "10px 15px",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                textDecoration: "none",
                                transition: "all 0.2s ease",
                            })}
                        >
                            <i className="ri-calendar-event-line me-2" style={{ fontSize: "18px" }}></i>
                            Quản lý sự kiện
                        </NavLink>
                        <Nav.Link
                            href="#"
                            style={{
                                color: "#6c757d",
                                fontWeight: 500,
                                padding: "10px 15px",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                transition: "all 0.2s ease",
                                textDecoration: "none",
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.backgroundColor = "#f1f3f5";
                                e.currentTarget.style.color = "#0d6efd";
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = "#6c757d";
                            }}
                        >
                            <i className="ri-file-chart-line me-2" style={{ fontSize: "18px" }}></i>
                            Báo cáo
                        </Nav.Link>
                        <Nav.Link
                            href="#"
                            style={{
                                color: "#6c757d",
                                fontWeight: 500,
                                padding: "10px 15px",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                transition: "all 0.2s ease",
                                textDecoration: "none",
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.backgroundColor = "#f1f3f5";
                                e.currentTarget.style.color = "#0d6efd";
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = "#6c757d";
                            }}
                        >
                            <i className="ri-settings-line me-2" style={{ fontSize: "18px" }}></i>
                            Cài đặt
                        </Nav.Link>
                    </Nav>
                </Col>
                <Col md={10}>
                    <Card>
                        <Card.Body>
                            <h4 className="mb-4">Danh sách người tham gia: {eventTitle}</h4>
                            <Row className="mb-3">
                                <Col md={4}>
                                    <InputGroup>
                                        <Form.Control
                                            placeholder="Tìm kiếm theo tên, email, SĐT..."
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                        />
                                    </InputGroup>
                                </Col>
                                <Col md="auto" className="d-flex align-items-center">
                                    <Button as={Link} to="/eventsmanager" variant="secondary" size="sm">
                                        Quay lại
                                    </Button>
                                </Col>
                            </Row>
                            <Table striped bordered hover responsive className="align-middle text-center" style={{ background: "#fff", borderRadius: 12, overflow: "hidden" }}>
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ minWidth: 40 }}>#</th>
                                        <th style={{ minWidth: 160 }}>Họ tên</th>
                                        <th style={{ minWidth: 160 }}>Email</th>
                                        <th style={{ minWidth: 120 }}>Số điện thoại</th>
                                        <th style={{ minWidth: 60 }}>Tuổi</th>
                                        <th style={{ minWidth: 80 }}>Giới tính</th>
                                        <th style={{ minWidth: 160 }}>Ngày đăng ký</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginated.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-muted">Chưa có người tham gia</td>
                                        </tr>
                                    ) : (
                                        paginated.map((user, idx) => (
                                            <tr key={user.id || idx}>
                                                <td>{startIdx + idx + 1}</td>
                                                <td className="text-start">{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phone}</td>
                                                <td>{user.age}</td>
                                                <td>{user.gender}</td>
                                                <td>{new Date(user.registeredAt).toLocaleString("vi-VN")}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                            <Row className="align-items-center justify-content-between mt-3">
                                <Col md="auto" className="mb-2 mb-md-0">
                                    <span>
                                        Hiển thị {filtered.length === 0 ? 0 : startIdx + 1}-{Math.min(endIdx, filtered.length)} của {filtered.length} người tham gia
                                    </span>
                                </Col>
                                <Col md="auto" className="mb-2 mb-md-0">
                                    <nav>
                                        <ul className="pagination mb-0">
                                            {Array.from({ length: totalPages }, (_, i) => (
                                                <li key={i + 1} className={`page-item${currentPage === i + 1 ? " active" : ""}`}>
                                                    <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                                                        {i + 1}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </nav>
                                </Col>
                                <Col md="auto">
                                    <div className="d-flex align-items-center">
                                        <span className="me-2">Hiển thị:</span>
                                        <div className="position-relative">
                                            <select className="form-select w-auto" value={perPage} onChange={handlePerPageChange}>
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                                <option value="30">30</option>
                                            </select>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}