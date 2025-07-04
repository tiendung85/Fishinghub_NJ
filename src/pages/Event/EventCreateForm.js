import React, { useState, useRef } from "react";
import {
    Container, Row, Col, Card, Button, Form, InputGroup, Alert,
} from "react-bootstrap";


const EVENT_TYPES = [
    { value: "freshwater", label: "Câu cá nước ngọt" },
    { value: "saltwater", label: "Câu cá biển" },
    { value: "competition", label: "Thi đấu câu cá" },
    { value: "workshop", label: "Hội thảo câu cá" },
    { value: "other", label: "Khác" },
];

export default function EventRegisterForm() {
    const [form, setForm] = useState({
        eventName: "",
        eventType: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        maxParticipants: "",
        fee: "",
        beginnerFriendly: false,
        hasPrizes: false,
        prizesDescription: "",
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [showAlert, setShowAlert] = useState("");
    const fileInputRef = useRef();

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        if (name === "hasPrizes" && !checked) {
            setForm((prev) => ({ ...prev, prizesDescription: "" }));
        }
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 5 * 1024 * 1024) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target.result);
            reader.readAsDataURL(file);
        } else {
            setShowAlert("Chỉ chấp nhận ảnh PNG/JPG/JPEG dưới 5MB.");
        }
    };

    // Drag & drop image
    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length) {
            handleImageChange({ target: { files: e.dataTransfer.files } });
        }
    };

    // Validate form
    const validateForm = () => {
        if (
            !form.eventName.trim() ||
            !form.eventType ||
            !form.location.trim() ||
            !form.startDate ||
            !form.endDate ||
            !form.description.trim()
        ) {
            setShowAlert("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return false;
        }
        return true;
    };

    // Submit event
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        alert("Sự kiện đã được đăng thành công!");
        window.location.href =
            "https://readdy.ai/home/d77ab814-4933-427e-8880-1b4163804cda/f326a028-e9a1-4933-b6f6-406cafca6437";
    };

    return (
        <Container className="py-4 main-content" style={{ maxWidth: 900 }}>
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <div className="text-center">
                        <h2 >Tạo sự kiện mới</h2>
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
                        {/* Thông tin cơ bản */}
                        <h5 className="mt-4 mb-3">Thông tin cơ bản</h5>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>
                                        Tên sự kiện <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        name="eventName"
                                        value={form.eventName}
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
                                        name="eventType"
                                        value={form.eventType}
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
                            <Col md={12}>
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
                        {/* Chi tiết sự kiện */}
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
                                    <Form.Label>Phí tham gia</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="number"
                                            name="fee"
                                            min={0}
                                            value={form.fee}
                                            onChange={handleChange}
                                        />
                                        <InputGroup.Text>VNĐ</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* Hình ảnh minh họa */}
                        <Row className="mb-3">
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Hình ảnh minh họa</Form.Label>
                                    <div
                                        className="border rounded p-3 text-center"
                                        style={{
                                            borderStyle: imagePreview ? "solid" : "dashed",
                                            borderColor: "#ced4da",
                                            background: "#fafbfc",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => fileInputRef.current.click()}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={handleDrop}
                                    >
                                        {imagePreview ? (
                                            <div className="position-relative d-inline-block">
                                                <img
                                                    src={imagePreview}
                                                    alt="preview"
                                                    style={{
                                                        maxWidth: 300,
                                                        maxHeight: 180,
                                                        borderRadius: 8,
                                                    }}
                                                />
                                                <Button
                                                    variant="light"
                                                    size="sm"
                                                    className="position-absolute top-0 end-0 m-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setImage(null);
                                                        setImagePreview("");
                                                    }}
                                                >
                                                    <i className="ri-close-line" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div>
                                                <i className="ri-image-add-line" style={{ fontSize: 32, color: "#adb5bd" }} />
                                                <div className="mt-2">Kéo & thả hoặc <span className="text-primary">chọn file</span></div>
                                                <div className="text-muted" style={{ fontSize: 13 }}>
                                                    PNG, JPG hoặc JPEG (tối đa 5MB)
                                                </div>
                                            </div>
                                        )}
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            className="d-none"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* Tùy chọn bổ sung */}
                        <h5 className="mt-4 mb-3">Tùy chọn bổ sung</h5>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Check
                                    type="checkbox"
                                    label="Phù hợp cho người mới"
                                    name="beginnerFriendly"
                                    checked={form.beginnerFriendly}
                                    onChange={handleChange}
                                />
                                <div className="text-muted" style={{ fontSize: 13, marginLeft: 28 }}>
                                    Sự kiện này thân thiện với những người mới bắt đầu câu cá
                                </div>
                            </Col>
                            <Col md={6}>
                                <Form.Check
                                    type="checkbox"
                                    label="Có giải thưởng"
                                    name="hasPrizes"
                                    checked={form.hasPrizes}
                                    onChange={handleChange}
                                />
                                <div className="text-muted" style={{ fontSize: 13, marginLeft: 28 }}>
                                    Sự kiện này có giải thưởng cho người tham gia
                                </div>
                            </Col>
                        </Row>
                        {form.hasPrizes && (
                            <Row className="mb-3">
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label>Chi tiết giải thưởng</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="prizesDescription"
                                            value={form.prizesDescription}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        )}
                        <div className="d-flex justify-content-end gap-2 pt-3 border-top mt-4">
                            <Button
                                variant="outline-secondary"
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