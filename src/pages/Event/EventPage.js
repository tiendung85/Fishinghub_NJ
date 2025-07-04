import { Container, Row, Breadcrumb, Col } from "react-bootstrap";

const events = [
    {
        image: "https://readdy.ai/api/search-image?query=fishing%2520tournament%2520event%2520at%2520a%2520beautiful%2520lake%252C%2520many%2520participants%2520with%2520fishing%2520rods%252C%2520tents%2520and%2520banners%2520set%2520up%252C%2520sunny%2520day%252C%2520vibrant%2520atmosphere%252C%2520high%2520quality%2520photography&width=400&height=240&seq=event1&orientation=landscape",
        status: "Sắp diễn ra",
        date: "17/05/2025",
        title: "Giải đấu câu cá Hồ Tây 2025",
        description: "Tham gia giải đấu câu cá lớn nhất miền Bắc với tổng giải thưởng lên đến 50 triệu đồng và nhiều phần quà hấp dẫn.",
        location: "Hồ Tây, Hà Nội",
        participants: "120/150 người"
    },
    {
        image: "https://readdy.ai/api/search-image?query=fishing%2520tournament%2520event%2520at%2520a%2520beautiful%2520lake%252C%2520many%2520participants%2520with%2520fishing%2520rods%252C%2520tents%2520and%2520banners%2520set%2520up%252C%2520sunny%2520day%252C%2520vibrant%2520atmosphere%252C%2520high%2520quality%2520photography&width=400&height=240&seq=event1&orientation=landscape",
        status: "Sắp diễn ra",
        date: "17/05/2025",
        title: "Giải đấu câu cá Hồ Tây 2025",
        description: "Tham gia giải đấu câu cá lớn nhất miền Bắc với tổng giải thưởng lên đến 50 triệu đồng và nhiều phần quà hấp dẫn.",
        location: "Hồ Tây, Hà Nội",
        participants: "120/150 người"
    },
    {
        image: "https://readdy.ai/api/search-image?query=fishing%2520tournament%2520event%2520at%2520a%2520beautiful%2520lake%252C%2520many%2520participants%2520with%2520fishing%2520rods%252C%2520tents%2520and%2520banners%2520set%2520up%252C%2520sunny%2520day%252C%2520vibrant%2520atmosphere%252C%2520high%2520quality%2520photography&width=400&height=240&seq=event1&orientation=landscape",
        status: "Sắp diễn ra",
        date: "17/05/2025",
        title: "Giải đấu câu cá Hồ Tây 2025",
        description: "Tham gia giải đấu câu cá lớn nhất miền Bắc với tổng giải thưởng lên đến 50 triệu đồng và nhiều phần quà hấp dẫn.",
        location: "Hồ Tây, Hà Nội",
        participants: "120/150 người"
    },
    // ...thêm các sự kiện khác...
];
// const events = [
//     {
//         image: "...",
//         status: "Sắp diễn ra",         // Trạng thái
//         date: "17/05/2025",            // Ngày diễn ra
//         title: "Giải đấu câu cá Hồ Tây 2025",
//         description: "...",
//         location: "Hồ Tây, Hà Nội",
//         region: "north",               // "north" | "central" | "south"
//         participants: 120,             // Số người đã đăng ký
//         maxParticipants: 150,          // Số người tối đa
//         type: "tournament",            // "tournament" | "workshop" | "festival" | "other"
//         fee: 0,                        // 0: miễn phí, >0: có phí
//         hasPrize: true,                // Có giải thưởng không
//         forBeginner: true,             // Phù hợp cho người mới không
//         forFamily: false               // Phù hợp cho gia đình không
//     },
//     // ...các sự kiện khác
// ];
export default function NewFeed() {
    return (
        <Container fluid className="main-content pb-5">
            <Container>
                <Row>
                    <Col>
                        <nav aria-label="breadcrumb" >
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
                <Row className=" mb-4 ">
                    <main>
                        <div>
                            <Row className="align-items-center mb-4">
                                <Col xs={12} md={8}>
                                    <h1 className="mb-2">Sự kiện nổi bật</h1>
                                    <p className="mb-0">
                                        Tất cả các sự kiện câu cá đang diễn ra và sắp tới
                                    </p>
                                </Col>
                                <Col xs={12} md={4}>
                                    <div className="d-flex justify-content-end align-items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm sự kiện..."
                                            className="form-control"
                                            style={{ maxWidth: 180 }}
                                        />
                                        <a href="/eventform" className="btn btn-primary d-flex align-items-center gap-1">
                                            <i className="ri-add-line"></i>
                                            <span>Tạo sự kiện</span>
                                        </a>
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
                                            <a href="#">
                                                <i className="ri-refresh-line"></i>
                                                <span>Đặt lại bộ lọc</span>
                                            </a>
                                        </Col>
                                    </Row>
                                    <Row className="g-3 mb-3">
                                        <Col md={3} xs={12}>
                                            <label htmlFor="statusSelect" className="form-label">Trạng thái</label>
                                            <select id="statusSelect" className="form-select">
                                                <option value="">Tất cả</option>
                                                <option value="upcoming">Sắp diễn ra</option>
                                                <option value="ongoing">Đang diễn ra</option>
                                                <option value="completed">Đã kết thúc</option>
                                            </select>
                                        </Col>
                                        <Col md={3} xs={12}>
                                            <label htmlFor="regionSelect" className="form-label">Khu vực</label>
                                            <select id="regionSelect" className="form-select">
                                                <option value="">Tất cả</option>
                                                <option value="north">Miền Bắc</option>
                                                <option value="central">Miền Trung</option>
                                                <option value="south">Miền Nam</option>
                                            </select>
                                        </Col>
                                        <Col md={3} xs={12}>
                                            <label htmlFor="fromDate" className="form-label">Từ ngày</label>
                                            <input id="fromDate" type="date" className="form-control" />
                                        </Col>
                                        <Col md={3} xs={12}>
                                            <label htmlFor="toDate" className="form-label">Đến ngày</label>
                                            <input id="toDate" type="date" className="form-control" />
                                        </Col>
                                    </Row>
                                    <Row className="g-3 mb-3">
                                        <Col md={3} xs={12}>
                                            <label className="form-label mb-2">Loại sự kiện</label>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="type-tournament" />
                                                <label className="form-check-label" htmlFor="type-tournament">Giải đấu</label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="type-workshop" />
                                                <label className="form-check-label" htmlFor="type-workshop">Workshop</label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="type-festival" />
                                                <label className="form-check-label" htmlFor="type-festival">Ngày hội</label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="type-other" />
                                                <label className="form-check-label" htmlFor="type-other">Khác</label>
                                            </div>
                                        </Col>
                                        <Col md={3} xs={12}>
                                            <label className="form-label mb-2">Phí tham gia</label>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="fee-free" />
                                                <label className="form-check-label" htmlFor="fee-free">Miễn phí</label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="fee-paid" />
                                                <label className="form-check-label" htmlFor="fee-paid">Có phí</label>
                                            </div>
                                        </Col>
                                        <Col md={3} xs={12}>
                                            <label className="form-label mb-2">Tùy chọn khác</label>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="option-available" defaultChecked />
                                                <label className="form-check-label" htmlFor="option-available">Còn chỗ đăng ký</label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="option-prize" />
                                                <label className="form-check-label" htmlFor="option-prize">Có giải thưởng</label>
                                            </div>

                                        </Col>

                                        <Col md={3} xs={12}>
                                            <label ></label>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="option-available" />
                                                <label className="form-check-label" htmlFor="option-beginner">Phù hợp cho người mới</label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="option-family" />
                                                <label className="form-check-label" htmlFor="option-family">Phù hợp cho gia đình</label>
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
                                        <select className="form-select w-auto">
                                            <option value="newest">Mới nhất</option>
                                            <option value="popular">Phổ biến nhất</option>
                                            <option value="upcoming">Sắp diễn ra</option>
                                            <option value="price-low">Phí tham gia: Thấp đến cao</option>
                                            <option value="price-high">Phí tham gia: Cao đến thấp</option>
                                        </select>
                                        <i className="ri-arrow-down-s-line position-absolute end-0 top-50 translate-middle-y me-3"></i>
                                    </div>
                                </Col>
                            </Row>



                            <Row className="g-4 mb-4">
                                {/* Giả sử bạn có mảng events */}
                                {events.map((event, idx) => (
                                    <Col md={4} sm={6} xs={12} key={idx}>
                                        <div className="card h-100 shadow-sm rounded-4">
                                            <img src={event.image} className="card-img-top" alt={event.title} />
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="badge bg-info">{event.status}</span>
                                                    <span>{event.date}</span>
                                                </div>
                                                <h5 className="card-title">{event.title}</h5>
                                                <p className="card-text">{event.description}</p>
                                                <div className="d-flex justify-content-between small text-muted mb-2">
                                                    <span><i className="ri-map-pin-line"></i> {event.location}</span>
                                                    <span><i className="ri-user-line"></i> {event.participants}</span>
                                                </div>
                                                <a href="/eventregister" className="btn btn-primary w-100">Đăng ký tham gia</a>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>

                            <Row className="align-items-center justify-content-between mt-4">
                                <Col md="auto" className="mb-2 mb-md-0">
                                    <span>Hiển thị 1-9 của 42 sự kiện</span>
                                </Col>
                                <Col md="auto" className="mb-2 mb-md-0">
                                    <nav>
                                        <ul className="pagination mb-0">

                                            <li className="page-item"><button className="page-link">1</button></li>
                                            <li className="page-item"><button className="page-link">2</button></li>
                                            <li className="page-item"><button className="page-link">3</button></li>
                                            <li className="page-item"><button className="page-link">4</button></li>
                                            <li className="page-item"><button className="page-link">5</button></li>

                                        </ul>
                                    </nav>
                                </Col>
                                <Col md="auto">
                                    <div className="d-flex align-items-center">
                                        <span className="me-2">Hiển thị:</span>
                                        <div className="position-relative">
                                            <select className="form-select w-auto">
                                                <option value="9">9</option>
                                                <option value="18">18</option>
                                                <option value="27">27</option>
                                                <option value="36">36</option>
                                            </select>
                                            <i className="ri-arrow-down-s-line position-absolute end-0 top-50 translate-middle-y me-3"></i>
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