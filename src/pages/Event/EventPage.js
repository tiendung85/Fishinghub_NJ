import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

export default function EventPage() {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage, setEventsPerPage] = useState(9);
    const [filter, setFilter] = useState({
        status: "",
        region: "",
        type: ""
    });
    const [sort, setSort] = useState("newest");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [onlyPrize, setOnlyPrize] = useState(false);
    const [registeredEventIds, setRegisteredEventIds] = useState([]);

    const { user } = useAuth();

    useEffect(() => {
        fetch("http://localhost:9999/events")
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(() => setEvents([]));
    }, []);

    useEffect(() => {
        if (user) {
            fetch(`http://localhost:9999/registrations?userId=${user.id}`)
                .then(res => res.json())
                .then(data => setRegisteredEventIds(data.map(r => r.eventId)));
        } else {
            setRegisteredEventIds([]);
        }
    }, [user]);

    let filteredEvents = events
        .filter(event => event.approved === "approved")
        .filter(event =>
            (event.title && event.title.toLowerCase().includes(search.toLowerCase())) ||
            (event.description && event.description.toLowerCase().includes(search.toLowerCase()))
        );

    if (filter.status) filteredEvents = filteredEvents.filter(e => e.status === filter.status);
    if (filter.region) filteredEvents = filteredEvents.filter(e => e.region === filter.region);
    if (filter.type) filteredEvents = filteredEvents.filter(e => e.type === filter.type);

    if (fromDate) {
        filteredEvents = filteredEvents.filter(e => new Date(e.startDate) >= new Date(fromDate));
    }
    if (toDate) {
        filteredEvents = filteredEvents.filter(e => new Date(e.endDate) <= new Date(toDate));
    }
    if (onlyAvailable) {
        filteredEvents = filteredEvents.filter(
            e => e.participants < e.maxParticipants && e.status === "Sắp diễn ra"
        );
    }
    if (onlyPrize) {
        filteredEvents = filteredEvents.filter(e => e.hasPrize === true);
    }

    filteredEvents = [...filteredEvents].sort((a, b) => {
        if (sort === "newest") return new Date(b.startDate) - new Date(a.startDate);
        if (sort === "upcoming") {
            const statusOrder = {
                "Sắp diễn ra": 0,
                "Đang diễn ra": 1,
                "Đã kết thúc": 2
            };
            const sa = statusOrder[a.status] ?? 99;
            const sb = statusOrder[b.status] ?? 99;
            if (sa !== sb) return sa - sb;
            return new Date(a.startDate) - new Date(b.startDate);
        }
        if (sort === "most-popular") {
            const statusOrder = {
                "Sắp diễn ra": 0,
                "Đang diễn ra": 1,
                "Đã kết thúc": 2
            };
            const sa = statusOrder[a.status] ?? 99;
            const sb = statusOrder[b.status] ?? 99;
            if (sa !== sb) return sa - sb;
            return Number(b.participants) - Number(a.participants);
        }
        return 0;
    });

    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
    const startIdx = (currentPage - 1) * eventsPerPage;
    const endIdx = startIdx + eventsPerPage;
    const paginatedEvents = filteredEvents.slice(startIdx, endIdx);

    const handleEventsPerPageChange = (e) => {
        setEventsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
    };

    const handleResetFilter = () => {
        setFilter({
            status: "",
            region: "",
            type: "",
        });
        setFromDate("");
        setToDate("");
        setSearch("");
        setOnlyAvailable(false);
        setOnlyPrize(false);
        setCurrentPage(1);
    };

    return (
        <Container fluid className="main-content pb-5">
            <Container>
                <Row>
                    <Col>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#" className="text-decoration-none">Trang chủ</a>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    Sự kiện nổi bật
                                </li>
                            </ol>
                        </nav>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row className="mb-4">
                    <main>
                        <div>
                            <Row className="align-items-center mb-4">
                                <Col xs={12} md={6}>
                                    <h1 className="mb-2">Sự kiện nổi bật</h1>
                                    <p className="mb-0">
                                        Tất cả các sự kiện câu cá đang diễn ra và sắp tới
                                    </p>
                                </Col>
                                <Col xs={12} md={6}>
                                    <div className="d-flex justify-content-end align-items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm sự kiện..."
                                            className="form-control"
                                            style={{ maxWidth: 180 }}
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                        />
                                        {user && (
                                            <>
                                                {user.role === 2 && (
                                                    <>
                                                        <Link to="/eventform" className="btn btn-primary d-flex align-items-center gap-1">
                                                            <i className="ri-add-line"></i>
                                                            <span>Tạo sự kiện</span>
                                                        </Link>
                                                        <Link to="/eventsmanager" className="btn btn-secondary d-flex align-items-center gap-1">
                                                            <i className="bi bi-speedometer2"></i>
                                                            <span>Danh sách sự kiện</span>
                                                        </Link>
                                                    </>
                                                )}
                                                {(user.role === 1 || user.role === 2) && (
                                                    <Link to="/registeredevents" className="btn btn-info d-flex align-items-center gap-1">
                                                        <i className="ri-calendar-check-line"></i>
                                                        <span>Xem sự kiện đã đăng ký</span>
                                                    </Link>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
                                    <Row>
                                        <Col xs={12} md={4}>
                                            <h6>Bộ lọc</h6>
                                        </Col>
                                        <Col xs={12} md={8} className="text-end">
                                            <a href="#" onClick={handleResetFilter}>
                                                <i className="ri-refresh-line"></i>
                                                <span>Đặt lại bộ lọc</span>
                                            </a>
                                        </Col>
                                    </Row>
                                    <Row className="g-3 mb-3">
                                        <Col md={3} xs={12}>
                                            <label htmlFor="statusSelect" className="form-label">Trạng thái</label>
                                            <select name="status" className="form-select" value={filter.status} onChange={handleFilterChange}>
                                                <option value="">Tất cả</option>
                                                <option value="Sắp diễn ra">Sắp diễn ra</option>
                                                <option value="Đang diễn ra">Đang diễn ra</option>
                                                <option value="Đã kết thúc">Đã kết thúc</option>
                                            </select>
                                        </Col>
                                        <Col md={3} xs={12}>
                                            <label htmlFor="regionSelect" className="form-label">Khu vực</label>
                                            <select name="region" className="form-select" value={filter.region} onChange={handleFilterChange}>
                                                <option value="">Tất cả</option>
                                                <option value="north">Miền Bắc</option>
                                                <option value="central">Miền Trung</option>
                                                <option value="south">Miền Nam</option>
                                            </select>
                                        </Col>
                                        <Col md={3} xs={12}>
                                            <label htmlFor="fromDate" className="form-label">Từ ngày</label>
                                            <input
                                                id="fromDate"
                                                type="date"
                                                className="form-control"
                                                value={fromDate}
                                                onChange={e => setFromDate(e.target.value)}
                                            />
                                        </Col>
                                        <Col md={3} xs={12}>
                                            <label htmlFor="toDate" className="form-label">Đến ngày</label>
                                            <input
                                                id="toDate"
                                                type="date"
                                                className="form-control"
                                                value={toDate}
                                                onChange={e => setToDate(e.target.value)}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="g-3 mb-3">
                                        <Col md={3} xs={12}>
                                            <label className="form-label mb-2">Loại sự kiện</label>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="type"
                                                    id="type-all"
                                                    value=""
                                                    checked={filter.type === ""}
                                                    onChange={handleFilterChange}
                                                />
                                                <label className="form-check-label" htmlFor="type-all">Tất cả</label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="type"
                                                    id="type-tournament"
                                                    value="tournament"
                                                    checked={filter.type === "tournament"}
                                                    onChange={handleFilterChange}
                                                />
                                                <label className="form-check-label" htmlFor="type-tournament">Giải đấu</label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="type"
                                                    id="type-workshop"
                                                    value="workshop"
                                                    checked={filter.type === "workshop"}
                                                    onChange={handleFilterChange}
                                                />
                                                <label className="form-check-label" htmlFor="type-workshop">Workshop</label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="type"
                                                    id="type-festival"
                                                    value="festival"
                                                    checked={filter.type === "festival"}
                                                    onChange={handleFilterChange}
                                                />
                                                <label className="form-check-label" htmlFor="type-festival">Ngày hội</label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="type"
                                                    id="type-other"
                                                    value="other"
                                                    checked={filter.type === "other"}
                                                    onChange={handleFilterChange}
                                                />
                                                <label className="form-check-label" htmlFor="type-other">Khác</label>
                                            </div>
                                        </Col>
                                        <Col md={3} xs={12}>
                                            <label className="form-label mb-2">Tùy chọn khác</label>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="option-available"
                                                    checked={onlyAvailable}
                                                    onChange={e => setOnlyAvailable(e.target.checked)}
                                                />
                                                <label className="form-check-label" htmlFor="option-available">Còn chỗ đăng ký</label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="option-prize"
                                                    checked={onlyPrize}
                                                    onChange={e => setOnlyPrize(e.target.checked)}
                                                />
                                                <label className="form-check-label" htmlFor="option-prize">Có giải thưởng</label>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Row>

                            <Row className="align-items-center mb-3">
                                <Col xs={12} md="auto">
                                    <span className="fw-semibold me-2">Sắp xếp theo:</span>
                                </Col>
                                <Col xs={12} md={4}>
                                    <div className="position-relative">
                                        <select className="form-select w-auto" value={sort} onChange={handleSortChange}>
                                            <option value="newest">Mới nhất</option>
                                            <option value="upcoming">Sắp diễn ra</option>
                                            <option value="most-popular">Nổi bật nhất</option>
                                        </select>
                                        <i className="ri-arrow-down-s-line position-absolute end-0 top-50 translate-middle-y me-3"></i>
                                    </div>
                                </Col>
                            </Row>

                            <Row className="g-4 mb-4">
                                {paginatedEvents.map((event, idx) => (
                                    <Col md={4} sm={6} xs={12} key={event.id || idx}>
                                        <div className="card h-100 shadow-sm rounded-4">
                                            <img
                                                src={event.image}
                                                className="card-img-top"
                                                alt={event.title}
                                                style={{
                                                    height: 200,
                                                    objectFit: "cover",
                                                    borderRadius: "16px 16px 0 0"
                                                }}
                                            />
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="badge bg-info">{event.status}</span>
                                                    <span>
                                                        {new Date(event.startDate).toLocaleDateString("vi-VN")} - {new Date(event.endDate).toLocaleDateString("vi-VN")}
                                                    </span>
                                                </div>
                                                <h5 className="card-title">{event.title}</h5>
                                                <div
                                                    className="text-muted"
                                                    style={{
                                                        fontSize: 15,
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: "hidden"
                                                    }}
                                                >
                                                    {event.description}
                                                </div>
                                                <div className="d-flex justify-content-between small text-muted mb-2">
                                                    <span><i className="ri-map-pin-line"></i> {event.location}</span>
                                                    <span><i className="ri-user-line"></i> {event.participants}/{event.maxParticipants}</span>
                                                </div>
                                                {user && registeredEventIds.includes(event.id) ? (
                                                    <Link
                                                        to={`/eventregister/${event.id}`}
                                                        className="btn btn-danger w-100"
                                                    >
                                                        Hủy đăng ký
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        to={`/eventregister/${event.id}`}
                                                        className="btn btn-primary w-100"
                                                    >
                                                        Đăng ký tham gia
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>

                            <Row className="align-items-center justify-content-between mt-4">
                                <Col md="auto" className="mb-2 mb-md-0">
                                    <span>
                                        Hiển thị {startIdx + 1}-{Math.min(endIdx, filteredEvents.length)} của {filteredEvents.length} sự kiện
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
                                                <option value="9">9</option>
                                                <option value="18">18</option>
                                                <option value="27">27</option>
                                                <option value="36">36</option>
                                            </select>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </main>
                </Row>
            </Container>
        </Container>
    );
}