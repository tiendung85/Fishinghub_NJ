import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Form, InputGroup, Button, Offcanvas } from 'react-bootstrap';
import '../../assets/styles/KnowledgePage.css';

export default function Knowledge() {
  const [fishData, setFishData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [selectedBaits, setSelectedBaits] = useState([]);
  const [allBaits, setAllBaits] = useState([]);

  useEffect(() => {
    fetchFishData();
  }, []);

  const fetchFishData = async () => {
    try {
      const response = await fetch('http://localhost:9999/knowledgeFish');
      if (!response.ok) {
        throw new Error('Failed to fetch fish data');
      }
      const data = await response.json();
      setFishData(data);
      // Lấy danh sách mồi duy nhất
      const baitSet = new Set();
      data.forEach(fish => {
        fish.favorite_bait.split(',').forEach(b => baitSet.add(b.trim()));
      });
      setAllBaits(Array.from(baitSet));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Lọc cá theo tên và mồi
  const filteredFish = fishData.filter(fish => {
    const matchName = fish.name.toLowerCase().includes(search.toLowerCase());
    if (selectedBaits.length === 0) return matchName;
    // Kiểm tra nếu cá có ít nhất 1 mồi được chọn
    const fishBaits = fish.favorite_bait.split(',').map(b => b.trim());
    return matchName && selectedBaits.some(bait => fishBaits.includes(bait));
  });

  const handleBaitChange = (bait) => {
    setSelectedBaits(prev =>
      prev.includes(bait)
        ? prev.filter(b => b !== bait)
        : [...prev, bait]
    );
  };

  if (loading) {
    return (
      <div className="main-content">
        <Container>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Đang tải dữ liệu cá...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <Container>
          <div className="text-center py-5">
            <div className="alert alert-danger" role="alert">
              <h4>Lỗi khi tải dữ liệu</h4>
              <p>{error}</p>
              <p>Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="main-content knowledge-no-extra-padding">
      <Container className="py-4">
        <div className="text-center mb-3">
          <h1 className="display-4 text-primary mb-2">🎣 Kiến Thức Cá Nước Ngọt</h1>
          <p className="lead text-muted mb-3">
            Khám phá thông tin chi tiết về các loài cá nước ngọt Việt Nam
          </p>
        </div>

        {/* SearchBar & Filter */}
        <div className="d-flex justify-content-center mb-4 knowledge-searchbar-row position-relative">
          <Button
            variant="outline-primary"
            className="me-2 knowledge-filter-btn"
            onClick={() => setShowFilterSidebar(true)}
            style={{ minWidth: 90 }}
          >
            <i className="bi bi-funnel-fill me-1"></i>Lọc
          </Button>
          <InputGroup style={{maxWidth: 900, flex: 1}}>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm theo tên cá..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Tìm kiếm theo tên cá"
            />
            {search && (
              <Button variant="outline-secondary" onClick={() => setSearch('')}>X</Button>
            )}
          </InputGroup>
          <div className="knowledge-count-info">
            Hiển thị {filteredFish.length}/{fishData.length} cá
          </div>
        </div>

        {/* Filter Sidebar */}
        <Offcanvas show={showFilterSidebar} onHide={() => setShowFilterSidebar(false)} placement="start">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Lọc theo loại mồi</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form>
              {allBaits.map((bait, idx) => (
                <Form.Check
                  key={bait}
                  type="checkbox"
                  id={`bait-${idx}`}
                  label={bait}
                  checked={selectedBaits.includes(bait)}
                  onChange={() => handleBaitChange(bait)}
                  className="mb-2"
                />
              ))}
            </Form>
            <Button
              variant="outline-secondary"
              className="mt-3 w-100"
              onClick={() => setSelectedBaits([])}
              disabled={selectedBaits.length === 0}
            >
              Bỏ chọn tất cả
            </Button>
          </Offcanvas.Body>
        </Offcanvas>

        <Row className="g-4">
          {filteredFish.map((fish) => (
            <Col key={fish.id} xs={12} sm={6} md={4} lg={3}>
              <FishCard fish={fish} />
            </Col>
          ))}
        </Row>

        {filteredFish.length === 0 && (
          <div className="text-center py-5">
            <div className="alert alert-info" role="alert">
              <h4>Không tìm thấy kết quả</h4>
              <p>Không có loài cá nào phù hợp với từ khóa tìm kiếm.</p>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

function FishCard({ fish }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="fish-card-container" onClick={handleCardClick}>
      <div className={`fish-card ${isFlipped ? 'flipped' : ''}`}>
        {/* Front of card: chỉ ảnh và tên cá */}
        <div className="fish-card-front">
          <div className="fish-image-container">
            <img
              src={fish.image_url}
              alt={fish.name}
              className="fish-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=Cá+Nước+Ngọt';
              }}
            />
          </div>
          <div className="fish-front-name-box">
            <div className="fish-front-name">{fish.name}</div>
            <div className="fish-front-detail">Nhấp để xem chi tiết</div>
          </div>
        </div>

        {/* Back of card: toàn bộ thông tin chi tiết */}
        <div className="fish-card-back">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-3">
              <h5 className="card-title text-center mb-3">{fish.name}</h5>
              <div className="fish-details">
                <div className="detail-section mb-3">
                  <h6 className="detail-title">📏 Kích thước:</h6>
                  <p className="detail-text">{fish.characteristics.size}</p>
                </div>
                <div className="detail-section mb-3">
                  <h6 className="detail-title">🎣 Mồi yêu thích:</h6>
                  <div className="bait-tags">
                    {fish.favorite_bait.split(', ').map((bait, index) => (
                      <Badge key={index} bg="light" text="dark" className="me-1 mb-1">
                        {bait}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="detail-section mb-3">
                  <h6 className="detail-title">🏊 Tập tính:</h6>
                  <p className="detail-text small">{fish.behavior}</p>
                </div>
                <div className="detail-section">
                  <h6 className="detail-title">ℹ️ Thông tin:</h6>
                  <p className="detail-text small">{fish.info}</p>
                </div>
              </div>
              <div className="text-center mt-3">
                <small className="text-light">Nhấp để quay lại</small>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}