import React, { useEffect, useState } from "react";
import { Table, Button, Badge, Modal, Row, Col, Form, InputGroup, Card, Pagination } from "react-bootstrap";

export default function EventsList() {
    const [events, setEvents] = useState([]);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [search, setSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filter, setFilter] = useState({
        status: "",
        type: "",
        location: "",
        fromDate: "",
        toDate: "",
        approved: ""
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage, setEventsPerPage] = useState(10);

    useEffect(() => {
        fetch("http://localhost:9999/events")
            .then(res => res.json())
            .then(data => setEvents(data));
    }, []);

    // Filter logic
    let filteredEvents = events.filter(event => {
        const matchesSearch = event.title?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filter.status ? event.status === filter.status : true;
        const matchesType = filter.type ? event.type === filter.type : true;
        const matchesLocation = filter.location
            ? event.location?.toLowerCase().includes(filter.location.toLowerCase())
            : true;
        const matchesFromDate = filter.fromDate ? new Date(event.startDate) >= new Date(filter.fromDate) : true;
        const matchesToDate = filter.toDate ? new Date(event.endDate) <= new Date(filter.toDate) : true;
        const matchesApproved = filter.approved ? event.approved === filter.approved : true;
        return matchesSearch && matchesStatus && matchesType && matchesLocation && matchesFromDate && matchesToDate && matchesApproved;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
    const startIdx = (currentPage - 1) * eventsPerPage;
    const endIdx = startIdx + eventsPerPage;
    const paginatedEvents = filteredEvents.slice(startIdx, endIdx);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleEventsPerPageChange = (e) => {
        setEventsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleApprove = async (id) => {
        await fetch(`http://localhost:9999/events/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ approved: "approved" }),
        });
        setEvents(events =>
            events.map(event =>
                event.id === id ? { ...event, approved: "approved" } : event
            )
        );
    };

    const handleReject = async (id) => {
        await fetch(`http://localhost:9999/events/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ approved: "rejected" }),
        });
        setEvents(events =>
            events.map(event =>
                event.id === id ? { ...event, approved: "rejected" } : event
            )
        );
    };

    const handleShowDetail = (event) => {
        setSelectedEvent(event);
        setShowDetail(true);
    };

    return (
        <div className="main-content" style={{ padding: 0, margin: 0 }}>
            <h2 className="mb-2" style={{ marginTop: 0 }}>Quản lý sự kiện</h2>
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
                            <Form.Select
                                value={eventsPerPage}
                                onChange={handleEventsPerPageChange}
                                style={{ width: 100, marginRight: 12 }}
                                size="sm"
                            >
                                <option value={5}>5 / trang</option>
                                <option value={10}>10 / trang</option>
                                <option value={20}>20 / trang</option>
                                <option value={50}>50 / trang</option>
                            </Form.Select>
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
                    <Table striped bordered hover responsive className="align-middle text-center">
                        <thead className="table-light">
                            <tr>
                                <th>Tên sự kiện</th>
                                <th>Thời gian</th>
                                <th>Địa điểm</th>
                                <th>Trạng thái</th>
                                <th>Duyệt</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedEvents.map(event => (
                                <tr key={event.id}>
                                    <td className="text-start">
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
                                    </td>
                                    <td>
                                        <div>{new Date(event.startDate).toLocaleDateString("vi-VN")}</div>
                                        <div className="text-muted small">
                                            {new Date(event.startDate).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - {new Date(event.endDate).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                                        </div>
                                    </td>
                                    <td>{event.location}</td>
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
                                                onClick={() => handleShowDetail(event)}
                                            >
                                                Xem
                                            </Button>
                                            {event.approved === "pending" && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline-success"
                                                        onClick={() => handleApprove(event.id)}
                                                    >
                                                        Duyệt
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline-danger"
                                                        onClick={() => handleReject(event.id)}
                                                    >
                                                        Từ chối
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {/* Pagination */}
                    <div className="d-flex justify-content-center align-items-center mt-3">
                        <Pagination>
                            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                            {Array.from({ length: totalPages }, (_, i) => (
                                <Pagination.Item
                                    key={i + 1}
                                    active={currentPage === i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                        </Pagination>
                        <span className="ms-3" style={{ fontSize: 14 }}>
                            Trang {currentPage}/{totalPages || 1}
                        </span>
                    </div>
                </Card.Body>
            </Card>
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
        </div>
    );
}