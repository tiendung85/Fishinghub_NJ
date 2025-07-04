import React, { useState } from "react";
import {
    Container, Row, Col, Card, Button, Form, InputGroup, Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const PACKAGE_LIST = [
    {
        key: "basic",
        name: "Gói Tiêu chuẩn",
        price: 500000,
        desc: [
            "Vị trí câu tiêu chuẩn",
            "Bữa trưa + nước uống",
            "Áo sự kiện",
        ],
    },
    {
        key: "premium",
        name: "Gói Cao cấp",
        price: 1000000,
        desc: [
            "Vị trí câu ưu tiên",
            "Bữa trưa + nước uống",
            "Áo sự kiện + Nón",
            "Bộ dụng cụ câu cá cơ bản",
        ],
    },
    {
        key: "vip",
        name: "Gói VIP",
        price: 1500000,
        desc: [
            "Vị trí câu VIP",
            "Bữa trưa + nước uống cao cấp",
            "Bộ quà tặng đầy đủ",
            "Hướng dẫn viên riêng",
            "Ưu tiên xếp hạng",
        ],
    },
    {
        key: "group",
        name: "Gói Nhóm (5+ người)",
        price: 400000, // 2.000.000 / 5 người
        desc: [
            "Khu vực câu riêng biệt",
            "Tiệc BBQ trưa",
            "Bộ quà tặng nhóm",
            "Giải thưởng nhóm riêng",
        ],
    },
];

const PAYMENT_METHODS = [
    { key: "bank", label: "Chuyển khoản ngân hàng" },
    { key: "ewallet", label: "Ví điện tử" },
    { key: "onsite", label: "Thanh toán tại chỗ" },
];

function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
}

export default function EventDetail() {
    const [participants, setParticipants] = useState(1);
    const [selectedPackage, setSelectedPackage] = useState("basic");
    const [payment, setPayment] = useState("bank");
    const [terms, setTerms] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const pricePerPerson = PACKAGE_LIST.find(p => p.key === selectedPackage)?.price || 500000;
    const totalPrice = pricePerPerson * participants;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!terms) {
            setShowAlert(true);
            return;
        }
        alert("Đăng ký thành công! Thông tin chi tiết sẽ được gửi đến email của bạn.");
        window.location.href = "https://readdy.ai/home/d77ab814-4933-427e-8880-1b4163804cda/f326a028-e9a1-4933-b6f6-406cafca6437";
    };

    return (
        <Container className="py-4 main-content">
            <Row>
                <Col lg={5} className="mb-4">
                    <Card>
                        <Card.Img
                            variant="top"
                            src="https://readdy.ai/api/search-image?query=fishing%20tournament%20event%20at%20a%20beautiful%20lake%2C%20many%20participants%20with%20fishing%20rods%2C%20tents%20and%20banners%20set%20up%2C%20sunny%20day%2C%20vibrant%20atmosphere%2C%20high%20quality%20photography&width=600&height=400&seq=event1&orientation=landscape"
                            style={{ height: 250, objectFit: "cover" }}
                        />
                        <Card.Body>
                            <Card.Title>Giải đấu câu cá Hồ Tây 2025</Card.Title>
                            <Card.Text>
                                <b>Thời gian:</b> 17/05/2025 (07:00 - 17:00)<br />
                                <b>Địa điểm:</b> Hồ Tây, Quận Tây Hồ, Hà Nội<br />
                                <b>Số lượng:</b> 120/150 người đã đăng ký<br />
                                <b>Phí tham gia:</b> 500.000đ - 1.500.000đ (tùy gói)
                            </Card.Text>
                            <hr />
                            <b>Mô tả sự kiện</b>
                            <div className="text-muted" style={{ fontSize: 15 }}>
                                Tham gia giải đấu câu cá lớn nhất miền Bắc với tổng giải thưởng lên đến 50 triệu đồng và nhiều phần quà hấp dẫn. Sự kiện được tổ chức bởi Câu lạc bộ Câu cá Hà Nội với sự tài trợ của các thương hiệu thiết bị câu cá hàng đầu.
                            </div>
                            <hr />
                            <b>Giải thưởng</b>
                            <ul>
                                <li>Giải nhất: 20.000.000đ + Cup vàng</li>
                                <li>Giải nhì: 15.000.000đ + Cup bạc</li>
                                <li>Giải ba: 10.000.000đ + Cup đồng</li>
                                <li>5 giải khuyến khích: 1.000.000đ/giải</li>
                            </ul>
                            <hr />
                            <b>Liên hệ</b>
                            <div>Trần Văn Hùng (Ban tổ chức) - 0912 345 678<br />giaidau@caucahanoi.vn</div>
                        </Card.Body>
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
                                            <Form.Control required type="text" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Số điện thoại <span className="text-danger">*</span></Form.Label>
                                            <Form.Control required type="tel" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                                            <Form.Control required type="email" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tuổi</Form.Label>
                                            <Form.Control type="number" min={1} />
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
                                                    defaultChecked
                                                />
                                                <Form.Check
                                                    inline
                                                    label="Nữ"
                                                    name="gender"
                                                    type="radio"
                                                />
                                                <Form.Check
                                                    inline
                                                    label="Khác"
                                                    name="gender"
                                                    type="radio"
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <h5 className="mb-3">Thông tin đăng ký</h5>
                                <Form.Group className="mb-3">
                                    <Form.Label>Số lượng người tham gia <span className="text-danger">*</span></Form.Label>
                                    <InputGroup style={{ maxWidth: 200 }}>
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => setParticipants(Math.max(1, participants - 1))}
                                        >-</Button>
                                        <Form.Control
                                            value={participants}
                                            readOnly
                                            style={{ textAlign: "center" }}
                                        />
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => setParticipants(Math.min(10, participants + 1))}
                                        >+</Button>
                                    </InputGroup>
                                    <div className="text-muted" style={{ fontSize: 13 }}>
                                        (Tối đa 10 người/đăng ký)
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Chọn gói tham gia <span className="text-danger">*</span></Form.Label>
                                    <Row>
                                        {PACKAGE_LIST.map(pkg => (
                                            <Col md={6} key={pkg.key} className="mb-3">
                                                <Card
                                                    border={selectedPackage === pkg.key ? "primary" : "light"}
                                                    bg={selectedPackage === pkg.key ? "light" : ""}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => setSelectedPackage(pkg.key)}
                                                >
                                                    <Card.Body>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <b>{pkg.name}</b>
                                                            <span className="text-primary">{formatCurrency(pkg.key === "group" ? 2000000 : pkg.price)}</span>
                                                        </div>
                                                        <ul style={{ fontSize: 14, marginBottom: 0, marginTop: 10 }}>
                                                            {pkg.desc.map((d, i) => <li key={i}>{d}</li>)}
                                                        </ul>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Kinh nghiệm câu cá</Form.Label>
                                    <Form.Select>
                                        <option value="">-- Chọn mức độ kinh nghiệm --</option>
                                        <option value="beginner">Người mới bắt đầu</option>
                                        <option value="intermediate">Trung bình</option>
                                        <option value="advanced">Nâng cao</option>
                                        <option value="professional">Chuyên nghiệp</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ghi chú</Form.Label>
                                    <Form.Control as="textarea" rows={3} placeholder="Yêu cầu đặc biệt hoặc thông tin bổ sung..." />
                                </Form.Group>
                                <h5 className="mb-3">Phương thức thanh toán</h5>
                                <Row>
                                    {PAYMENT_METHODS.map(method => (
                                        <Col md={4} key={method.key}>
                                            <Form.Check
                                                type="radio"
                                                label={method.label}
                                                name="payment"
                                                checked={payment === method.key}
                                                onChange={() => setPayment(method.key)}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                                <Form.Group className="my-3">
                                    <Form.Check
                                        type="checkbox"
                                        label={<>Tôi đã đọc và đồng ý với <a href="#">Điều khoản và Điều kiện</a> của sự kiện.</>}
                                        checked={terms}
                                        onChange={e => setTerms(e.target.checked)}
                                    />
                                </Form.Group>
                                <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded mb-3">
                                    <div>
                                        <div className="text-muted" style={{ fontSize: 15 }}>Tổng tiền:</div>
                                        <div className="h4 text-primary mb-0">{formatCurrency(totalPrice)}</div>
                                    </div>
                                    <Button type="submit" variant="primary" size="lg">
                                        Xác nhận đăng ký
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}