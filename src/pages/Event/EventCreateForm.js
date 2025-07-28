import React, { useState, useRef } from "react";
import {
    Container, Row, Col, Card, Button, Form, InputGroup, Alert,
} from "react-bootstrap";
import { useAuth } from "../Auth/AuthContext";

const EVENT_TYPES = [
    { value: "tournament", label: "Giải đấu" },
    { value: "workshop", label: "Workshop" },
    { value: "festival", label: "Ngày hội" },
    { value: "other", label: "Khác" },
];

export default function EventCreateForm({ initialData = null, isEdit = false }) {
    const { user } = useAuth();

    // Hooks phải đặt ở đây, không đặt trong if
    const [form, setForm] = useState(initialData || {
        title: "",
        type: "",
        location: "",
        region: "",
        startDate: "",
        endDate: "",
        description: "",
        maxParticipants: "",
        hasPrize: false,
        prizeDetail: "",
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [showAlert, setShowAlert] = useState("");
    const [imagePath, setImagePath] = useState("");
    const fileInputRef = useRef();

    
    React.useEffect(() => {
        if (initialData) setForm(initialData);
    }, [initialData]);

    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        if (name === "hasPrize" &&
            !checked) {
            setForm((prev) => ({ ...prev, prizeDetail: "" }));
        }
    };

    
   const validateForm = () => {
    if (
        !form.title.trim() ||
        !form.type ||
        !form.location.trim() ||
        !form.region ||
        !form.startDate ||
        !form.endDate ||
        !form.description.trim()
    ) {
        setShowAlert("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return false;
    }

    const now = new Date();
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);

    if (start < now) {
        setShowAlert("Ngày bắt đầu phải từ thời điểm hiện tại trở đi!");
        return false;
    }

    if (end <= start) {
        setShowAlert("Ngày kết thúc phải sau ngày bắt đầu!");
        return false;
    }

    return true;
};

   
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        
        const newEvent = {
            ...form,
            image: imagePath,
            status: "Sắp diễn ra",
            participants: 0,
            maxParticipants: Number(form.maxParticipants) || 0,
            userId: user.id, 
            approved: "pending", 
            ...(form.hasPrize ? { prizeDetail: form.prizeDetail } : {}),
        };

        try {
            const res = isEdit
                ? await fetch(`http://localhost:9999/events/${initialData.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newEvent),
                })
                : await fetch("http://localhost:9999/events", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newEvent),
                });

            if (res.ok) {
                alert("Sự kiện đã được đăng thành công!");
                setForm({
                    title: "",
                    type: "",
                    location: "",
                    region: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                    maxParticipants: "",
                    hasPrize: false,
                    prizeDetail: "",
                });
                setImage(null);
                setImagePreview("");
                setImagePath("");
                setShowAlert("");
            } else {
                setShowAlert("Lỗi khi lưu sự kiện!");
            }
        } catch (err) {
            setShowAlert("Không thể kết nối tới server!");
        }
    };

   
    if (!user) {
        return (
            <Container className="py-5 text-center">
                <Alert variant="warning">
                    Bạn cần đăng nhập để tạo sự kiện.
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="py-4 main-content" style={{ maxWidth: 900 }}>
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <div className="text-center">
                        <h4 className="mb-3 text-center fw-normal text-primary">Tạo sự kiện mới</h4>
                    </div>
                    <Form onSubmit={handleSubmit}>
                        {showAlert && (
                            <Alert
                                variant="danger"
                                onClose={() => setShowAlert("")}
                                dismissible
                            >
                                {showAlert}
                            </Alert>
                        )}
                        
                        <h5 className="mt-4 mb-3">Thông tin cơ bản</h5>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>
                                        Tên sự kiện <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>
                                        Loại sự kiện <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Select
                                        name="type"
                                        value={form.type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Chọn loại sự kiện</option>
                                        {EVENT_TYPES.map((t) => (
                                            <option key={t.value} value={t.value}>
                                                {t.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>
                                        Địa điểm <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        name="location"
                                        value={form.location}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>
                                        Khu vực <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Select
                                        name="region"
                                        value={form.region}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Chọn khu vực</option>
                                        <option value="north">Miền Bắc</option>
                                        <option value="central">Miền Trung</option>
                                        <option value="south">Miền Nam</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>
                                        Ngày bắt đầu <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        name="startDate"
                                        value={form.startDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>
                                        Ngày kết thúc <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        name="endDate"
                                        value={form.endDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <h5 className="mt-4 mb-3">Chi tiết sự kiện</h5>
                        <Row className="mb-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>
                                        Mô tả <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Giới hạn người tham gia</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="number"
                                            name="maxParticipants"
                                            min={1}
                                            value={form.maxParticipants}
                                            onChange={handleChange}
                                        />
                                        <InputGroup.Text>người</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Link hình ảnh minh họa <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="url"
                                        placeholder="Nhập link ảnh (https://...)"
                                        value={imagePath}
                                        onChange={e => setImagePath(e.target.value)}
                                        required
                                    />
                                    {imagePath && (
                                        <div className="mt-2 text-center">
                                            <img
                                                src={imagePath}
                                                alt="preview"
                                                style={{ maxWidth: 300, maxHeight: 180, borderRadius: 8 }}
                                            />
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                       
                        <h5 className="mt-4 mb-3">Tùy chọn bổ sung</h5>
                        <Row className="mb-3">
                            <Col md={4}>
                                <Form.Check
                                    type="checkbox"
                                    label="Có giải thưởng"
                                    name="hasPrize"
                                    checked={form.hasPrize}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                        {form.hasPrize && (
                            <Row className="mb-3">
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label>Chi tiết giải thưởng</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="prizeDetail"
                                            value={form.prizeDetail}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        )}
                        <div className="d-flex justify-content-end gap-2 pt-3 border-top mt-4">
                            <Button
                                variant="outline-secondary"
                                type="button"
                                onClick={() => window.history.back()}
                            >
                                Quay lại
                            </Button>
                            <Button type="submit" variant="primary">
                                Đăng sự kiện
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}