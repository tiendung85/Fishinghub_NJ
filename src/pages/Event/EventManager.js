import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    Nav, Container, Row, Col, Card, Table, Button, Form, Badge, InputGroup, Modal
} from "react-bootstrap";

export default function EventManager() {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filter, setFilter] = useState({
        status: "",
        type: "",
        location: "",
        fromDate: "",
        toDate: "",
        approved: "" // thêm dòng này
    });
    const [showDetail, setShowDetail] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage, setEventsPerPage] = useState(10); // hoặc 9, 20 tùy ý

    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:9999/events")
            .then(res => res.json())
            .then(data => setEvents(data));
    }, []);

    // Filter logic
    let filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filter.status ? event.status === filter.status : true;
        const matchesType = filter.type ? event.type === filter.type : true;
        const matchesLocation = filter.location
            ? event.location.toLowerCase().includes(filter.location.toLowerCase())
            : true;
        const matchesFromDate = filter.fromDate ? new Date(event.startDate) >= new Date(filter.fromDate) : true;
        const matchesToDate = filter.toDate ? new Date(event.endDate) <= new Date(filter.toDate) : true;
        const matchesApproved = filter.approved ? event.approved === filter.approved : true; // thêm dòng này
        return matchesSearch && matchesStatus && matchesType && matchesLocation && matchesFromDate && matchesToDate && matchesApproved;
    });

    // Phân trang
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
    const startIdx = (currentPage - 1) * eventsPerPage;
    const endIdx = startIdx + eventsPerPage;
    const paginatedEvents = filteredEvents.slice(startIdx, endIdx);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) {
            await fetch(`http://localhost:9999/events/${id}`, { method: "DELETE" });
            setEvents(events =>
                events.filter(event => event.id !== id)
            );
        }
    };

    // Khi đổi trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Khi đổi số sự kiện/trang
    const handleEventsPerPageChange = (e) => {
        setEventsPerPage(Number(e.target.value));
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
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = "#f1f3f5";
                                e.currentTarget.style.color = "#0d6efd";
                            }}
                            onMouseOut={(e) => {
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
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = "#f1f3f5";
                                e.currentTarget.style.color = "#0d6efd";
                            }}
                            onMouseOut={(e) => {
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
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = "#f1f3f5";
                                e.currentTarget.style.color = "#0d6efd";
                            }}
                            onMouseOut={(e) => {
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
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = "#f1f3f5";
                                e.currentTarget.style.color = "#0d6efd";
                            }}
                            onMouseOut={(e) => {
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
                    <h2 className="mb-4">Danh sách sự kiện</h2>
                    <Card className="mb-4">
                        <Card.Body>
                            <Row className="align-items-center mb-3">
                                <Col md={4}>
                                    <InputGroup>
                                        <Form.Control
                                            placeholder="Tìm kiếm sự kiện..."
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                        />
                                        <Button variant="outline-secondary" onClick={() => setShowFilters(f => !f)}>
                                            Bộ lọc
                                        </Button>
                                    </InputGroup>
                                </Col>
                                <Col md={{ span: 8 }} className="d-flex justify-content-end align-items-center">
                                    <Button
                                        variant="dark"
                                        size="sm"
                                        style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}
                                        onClick={() => setFilter({
                                            status: "",
                                            type: "",
                                            location: "",
                                            fromDate: "",
                                            toDate: "",
                                            approved: ""
                                        })}
                                    >
                                        Đặt lại
                                    </Button>
                                </Col>
                            </Row>
                            {showFilters && (
                                <Row className="mb-3">
                                    <Col md={2}>
                                        <Form.Label>Trạng thái</Form.Label>
                                        <Form.Select
                                            value={filter.status}
                                            onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
                                        >
                                            <option value="">Tất cả</option>
                                            <option value="Sắp diễn ra">Sắp diễn ra</option>
                                            <option value="Đang diễn ra">Đang diễn ra</option>
                                            <option value="Đã kết thúc">Đã kết thúc</option>
                                        </Form.Select>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Label>Loại sự kiện</Form.Label>
                                        <Form.Select
                                            value={filter.type}
                                            onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}
                                        >
                                            <option value="">Tất cả</option>
                                            <option value="tournament">Giải đấu</option>
                                            <option value="workshop">Workshop</option>
                                            <option value="festival">Ngày hội</option>
                                            <option value="other">Khác</option>
                                        </Form.Select>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Label>Địa điểm</Form.Label>
                                        <Form.Control
                                            value={filter.location}
                                            onChange={e => setFilter(f => ({ ...f, location: e.target.value }))}
                                            placeholder="Nhập địa điểm"
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <Form.Label>Từ ngày</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={filter.fromDate}
                                            onChange={e => setFilter(f => ({ ...f, fromDate: e.target.value }))}
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <Form.Label>Đến ngày</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={filter.toDate}
                                            onChange={e => setFilter(f => ({ ...f, toDate: e.target.value }))}
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <Form.Label>Duyệt</Form.Label>
                                        <Form.Select
                                            value={filter.approved}
                                            onChange={e => setFilter(f => ({ ...f, approved: e.target.value }))}
                                        >
                                            <option value="">Tất cả</option>
                                            <option value="approved">Đã duyệt</option>
                                            <option value="pending">Chờ duyệt</option>
                                            <option value="rejected">Từ chối</option>
                                        </Form.Select>
                                    </Col>

                                </Row>
                            )}
                            <Table striped bordered hover responsive className="align-middle text-center" style={{ background: "#fff", borderRadius: 12, overflow: "hidden" }}>
                                <thead className="table-light">
                                    <tr>
                                        <th style={{ minWidth: 180, verticalAlign: "top" }}>Tên sự kiện</th>
                                        <th style={{ minWidth: 140, verticalAlign: "top" }}>Thời gian</th>
                                        <th style={{ minWidth: 120, verticalAlign: "top" }}>Địa điểm</th>
                                        <th style={{ minWidth: 100, verticalAlign: "top" }}>Số người tham gia</th>
                                        <th style={{ minWidth: 110, verticalAlign: "top" }}>Trạng thái</th>
                                        <th style={{ minWidth: 110, verticalAlign: "top" }}>Duyệt</th>
                                        <th style={{ minWidth: 140, verticalAlign: "top" }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedEvents.map(event => (
                                        <tr key={event.id}>
                                            <td className="text-start">
                                                <div className="d-flex align-items-center gap-2">
                                                    <img
                                                        src={event.image}
                                                        alt=""
                                                        width={44}
                                                        height={44}
                                                        className="rounded-circle border"
                                                        style={{ objectFit: "cover", background: "#f8f9fa" }}
                                                    />
                                                    <div>
                                                        <div className="fw-semibold">{event.title}</div>
                                                        <div className="text-muted small">
                                                            {event.type === "tournament"
                                                                ? "Giải đấu"
                                                                : event.type === "workshop"
                                                                    ? "Workshop"
                                                                    : event.type === "festival"
                                                                        ? "Ngày hội"
                                                                        : "Khác"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div>{new Date(event.startDate).toLocaleDateString("vi-VN")}</div>
                                                <div className="text-muted small">
                                                    {new Date(event.startDate).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - {new Date(event.endDate).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                                                </div>
                                            </td>
                                            <td>{event.location}</td>
                                            <td>
                                                <span
                                                    className="fw-semibold text-primary"
                                                    style={{ cursor: "pointer", textDecoration: "underline" }}
                                                    onClick={() => navigate(`/events/${event.id}/participants`)}
                                                >
                                                    {event.participants}
                                                </span>
                                            </td>
                                            <td>
                                                <Badge
                                                    bg={
                                                        event.status === "Sắp diễn ra"
                                                            ? "warning"
                                                            : event.status === "Đang diễn ra"
                                                                ? "success"
                                                                : "secondary"
                                                    }
                                                    className="px-3 py-2 rounded-pill"
                                                    style={{ fontSize: 14 }}
                                                >
                                                    {event.status}
                                                </Badge>
                                            </td>
                                            <td>
                                                {/* Hiển thị trạng thái duyệt */}
                                                {event.approved === "approved" && (
                                                    <Badge bg="success" className="px-3 py-2 rounded-pill" style={{ fontSize: 14 }}>
                                                        Đã duyệt
                                                    </Badge>
                                                )}
                                                {event.approved === "pending" && (
                                                    <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill" style={{ fontSize: 14 }}>
                                                        Chờ duyệt
                                                    </Badge>
                                                )}
                                                {event.approved === "rejected" && (
                                                    <Badge bg="danger" className="px-3 py-2 rounded-pill" style={{ fontSize: 14 }}>
                                                        Từ chối
                                                    </Badge>
                                                )}
                                            </td>
                                            <td>
                                                <div className="d-flex justify-content-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline-primary"
                                                        onClick={() => {
                                                            setSelectedEvent(event);
                                                            setShowDetail(true);
                                                        }}
                                                    >
                                                        Xem
                                                    </Button>
                                                    {event.approved === "pending" && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline-warning"
                                                            onClick={() => navigate(`/eventedit/${event.id}`)}
                                                        >
                                                            Sửa
                                                        </Button>
                                                    )}
                                                    {(event.approved === "pending" || event.approved === "rejected" || event.status === "Đã kết thúc") && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline-danger"
                                                            onClick={() => handleDelete(event.id)}
                                                        >
                                                            Xóa
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                    <Row className="align-items-center justify-content-between mt-3">
                        <Col md="auto" className="mb-2 mb-md-0">
                            <span>
                                Hiển thị {filteredEvents.length === 0 ? 0 : startIdx + 1}-{Math.min(endIdx, filteredEvents.length)} của {filteredEvents.length} sự kiện
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
                                    <select className="form-select w-auto" value={eventsPerPage} onChange={handleEventsPerPageChange}>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="30">30</option>
                                    </select>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Modal show={showDetail} onHide={() => setShowDetail(false)} centered size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>Chi tiết sự kiện</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedEvent && (
                                <div>
                                    <div className="mb-3 text-center">
                                        <img
                                            src={selectedEvent.image}
                                            alt={selectedEvent.title}
                                            style={{ maxWidth: 300, maxHeight: 180, borderRadius: 8 }}
                                        />
                                    </div>
                                    <h4>{selectedEvent.title}</h4>
                                    <p><b>Loại:</b> {selectedEvent.type === "tournament" ? "Giải đấu" : selectedEvent.type === "workshop" ? "Workshop" : selectedEvent.type === "festival" ? "Ngày hội" : "Khác"}</p>
                                    <p><b>Thời gian:</b> {new Date(selectedEvent.startDate).toLocaleString("vi-VN")} - {new Date(selectedEvent.endDate).toLocaleString("vi-VN")}</p>
                                    <p><b>Địa điểm:</b> {selectedEvent.location}</p>
                                    <p><b>Khu vực:</b> {selectedEvent.region === "north" ? "Miền Bắc" : selectedEvent.region === "central" ? "Miền Trung" : "Miền Nam"}</p>
                                    <p><b>Số người tham gia:</b> {selectedEvent.participants}/{selectedEvent.maxParticipants}</p>
                                    <p><b>Trạng thái:</b> {selectedEvent.status}</p>
                                    <p><b>Trạng thái duyệt:</b> {selectedEvent.approved === "approved" ? "Đã duyệt" : selectedEvent.approved === "pending" ? "Chờ duyệt" : "Từ chối"}</p>
                                    <p><b>Mô tả:</b> {selectedEvent.description}</p>
                                    {selectedEvent.hasPrize && (
                                        <p><b>Giải thưởng:</b> {selectedEvent.prizeDetail}</p>
                                    )}
                                </div>
                            )}
                        </Modal.Body>
                    </Modal>
                </Col>
            </Row>
        </Container>
    );
}