import React from "react";
import { Container, Row, Col, Card, Button, Table, Nav } from "react-bootstrap";

export default function DashboardOwner() {
    return (
        <Container fluid className="bg-light min-vh-100 py-3 main-content">
            <Row>
                {/* Sidebar */}
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

                        <Nav.Link
                            href="/eventsmanager"
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
                            <i className="ri-calendar-event-line me-2" style={{ fontSize: "18px" }}></i>
                            Quản lý sự kiện
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


                {/* Main Content */}
                <Col md={10} className="px-4">

                    {/* Dashboard Cards */}
                    <Row className="mb-4">
                        <Col md={3}>
                            <Card>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="bg-primary bg-opacity-10 text-primary rounded p-2">
                                            <i className="ri-money-dollar-circle-line fs-4"></i>
                                        </div>
                                        <Button variant="link" className="text-secondary p-0">
                                            <i className="ri-more-2-fill"></i>
                                        </Button>
                                    </div>
                                    <div className="fs-4 fw-semibold">12.5M đ</div>
                                    <div className="text-muted">Doanh thu hôm nay</div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="bg-success bg-opacity-10 text-success rounded p-2">
                                            <i className="ri-team-line fs-4"></i>
                                        </div>
                                        <Button variant="link" className="text-secondary p-0">
                                            <i className="ri-more-2-fill"></i>
                                        </Button>
                                    </div>
                                    <div className="fs-4 fw-semibold">85</div>
                                    <div className="text-muted">Khách trong ngày</div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="bg-primary bg-opacity-10 text-primary rounded p-2">
                                            <i className="ri-ticket-2-line fs-4"></i>
                                        </div>
                                        <Button variant="link" className="text-secondary p-0">
                                            <i className="ri-more-2-fill"></i>
                                        </Button>
                                    </div>
                                    <div className="fs-4 fw-semibold">156</div>
                                    <div className="text-muted">Vé đã bán</div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="bg-warning bg-opacity-10 text-warning rounded p-2">
                                            <i className="ri-map-pin-line fs-4"></i>
                                        </div>
                                        <Button variant="link" className="text-secondary p-0">
                                            <i className="ri-more-2-fill"></i>
                                        </Button>
                                    </div>
                                    <div className="fs-4 fw-semibold">24</div>
                                    <div className="text-muted">Chỗ còn trống</div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Charts (Placeholder) */}
                    <Row className="mb-4">
                        <Col md={8}>
                            <Card>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5>Doanh thu theo tuần</h5>
                                        <div>
                                            <Button size="sm" variant="outline-secondary" className="me-2">Tuần</Button>
                                            <Button size="sm" variant="primary">Tháng</Button>
                                        </div>
                                    </div>
                                    <div style={{ width: "100%", height: 300, background: "#f8f9fa", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {/* Thay bằng chart thực tế nếu dùng thư viện chart */}
                                        <span className="text-muted">[Biểu đồ doanh thu]</span>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5>Phân loại vé</h5>
                                        <Button variant="link" className="text-secondary p-0">
                                            <i className="ri-more-2-fill"></i>
                                        </Button>
                                    </div>
                                    <div style={{ width: "100%", height: 300, background: "#f8f9fa", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {/* Thay bằng chart thực tế nếu dùng thư viện chart */}
                                        <span className="text-muted">[Biểu đồ phân loại vé]</span>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Table */}
                    <Card>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5>Đặt chỗ mới nhất</h5>
                                <Button variant="link" className="text-primary p-0">Xem tất cả</Button>
                            </div>
                            <div style={{ overflowX: "auto" }}>
                                <Table striped hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Khách hàng</th>
                                            <th>Số điện thoại</th>
                                            <th>Thời gian</th>
                                            <th>Vị trí</th>
                                            <th>Trạng thái</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="rounded-circle bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center me-2" style={{ width: 32, height: 32 }}>
                                                        <i className="ri-user-line"></i>
                                                    </div>
                                                    <div>
                                                        <div className="fw-medium">Trần Minh Tuấn</div>
                                                        <div className="text-muted" style={{ fontSize: 12 }}>ID: #12345</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>0912 345 678</td>
                                            <td>
                                                <div>07:30 - 11:30</div>
                                                <div className="text-muted" style={{ fontSize: 12 }}>07/07/2025</div>
                                            </td>
                                            <td>Vị trí A12</td>
                                            <td>
                                                <span className="badge bg-success bg-opacity-25 text-success">Đã thanh toán</span>
                                            </td>
                                            <td>
                                                <Button variant="link" className="text-secondary p-0">
                                                    <i className="ri-more-2-fill"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="rounded-circle bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center me-2" style={{ width: 32, height: 32 }}>
                                                        <i className="ri-user-line"></i>
                                                    </div>
                                                    <div>
                                                        <div className="fw-medium">Lê Thị Hương</div>
                                                        <div className="text-muted" style={{ fontSize: 12 }}>ID: #12346</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>0987 654 321</td>
                                            <td>
                                                <div>13:00 - 17:00</div>
                                                <div className="text-muted" style={{ fontSize: 12 }}>07/07/2025</div>
                                            </td>
                                            <td>Vị trí B08</td>
                                            <td>
                                                <span className="badge bg-warning bg-opacity-25 text-warning">Chờ thanh toán</span>
                                            </td>
                                            <td>
                                                <Button variant="link" className="text-secondary p-0">
                                                    <i className="ri-more-2-fill"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}