import React, { useState, useEffect } from 'react';

import { Row, Col, Card, Button, Form, InputGroup, Offcanvas } from 'react-bootstrap';

export default function KnowledgePage() {
    const [fishes, setFishes] = useState([]);
    const [expandedFishIds, setExpandedFishIds] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [availableBaits, setAvailableBaits] = useState([]);
    const [selectedBaits, setSelectedBaits] = useState([]);

    const API_URL = "http://localhost:9999";

   useEffect(() => {
    const fetchFishes = async () => {
        try {
            const response = await fetch(`${API_URL}/knowledgeFish`);
            const data = await response.json();
            setFishes(data);

          
            const allBaits = new Set();
            data.forEach(fish => {
                if (fish.favorite_bait) {
                    const baits = fish.favorite_bait.split(',').map(bait => bait.trim());
                    baits.forEach(bait => {
                        if (bait.endsWith('.')) bait = bait.slice(0, -1);
                        allBaits.add(bait);
                    });
                }
            });
            setAvailableBaits(Array.from(allBaits).sort());
        } catch (error) {
            console.error("Error fetching fish data:", error);
        }
    };

    fetchFishes();
}, []);


    const toggleFishInfo = (id) => {
        setExpandedFishIds((prev) =>
            prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
        );
    };

    const handleBaitToggle = (bait) => {
        setSelectedBaits(prev => 
            prev.includes(bait) 
                ? prev.filter(b => b !== bait) 
                : [...prev, bait]
        );
    };

    // Filter fishes based on search query and selected baits
    const filteredFishes = fishes.filter(fish => {
        // Filter by search query
        const matchesSearch = fish.name.toLowerCase().includes(searchQuery.toLowerCase());

        // If no baits are selected, only apply search filter
        if (selectedBaits.length === 0) {
            return matchesSearch;
        }

        // Filter by selected baits
        const fishBaits = fish.favorite_bait.split(',').map(bait => bait.trim());
        const matchesBaits = selectedBaits.some(selectedBait => 
            fishBaits.some(fishBait => 
                fishBait.includes(selectedBait) || 
                (fishBait.endsWith('.') && fishBait.slice(0, -1).includes(selectedBait))
            )
        );

        // Return true if matches both search and bait filters
        return matchesSearch && matchesBaits;
    });

    return (
        <div className="container main-content">
            <h1 className="text-center text-primary mb-4">
                Kiến thức về các loài cá nước ngọt Việt Nam
            </h1>

            {/* Filter and Search Bar */}
            <div className="mb-4">
                <div className="d-flex mb-2">
                    <Button 
                        variant="primary" 
                        className="me-2" 
                        onClick={() => setShowFilter(true)}
                        style={{ width: '100px' }}
                    >
                        <i className="bi bi-funnel-fill me-1"></i> Lọc
                    </Button>

                    <InputGroup className="shadow-sm flex-grow-1">
                        <InputGroup.Text id="search-addon" className="bg-primary text-white">
                            <i className="bi bi-search"></i>
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Tìm kiếm theo tên cá..."
                            aria-label="Search"
                            aria-describedby="search-addon"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="py-2"
                        />
                        {searchQuery && (
                            <Button 
                                variant="outline-secondary" 
                                onClick={() => setSearchQuery('')}
                            >
                                <i className="bi bi-x-lg"></i>
                            </Button>
                        )}
                    </InputGroup>
                </div>

                {/* Filter Offcanvas */}
                <Offcanvas 
                    show={showFilter} 
                    onHide={() => setShowFilter(false)} 
                    placement="start"
                    style={{ width: '200px', maxWidth: '50%' }}
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Lọc theo mồi yêu thích</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <div className="mb-3">
                            <Button 
                                variant="outline-secondary" 
                                size="sm" 
                                onClick={() => setSelectedBaits([])}
                                className="mb-2"
                            >
                                Bỏ chọn tất cả
                            </Button>
                            {selectedBaits.length > 0 && (
                                <div className="mb-2">
                                    <small className="text-muted">
                                        Đã chọn: {selectedBaits.length} loại mồi
                                    </small>
                                </div>
                            )}
                        </div>
                        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            {availableBaits.map((bait, index) => (
                                <Form.Check 
                                    key={index}
                                    type="checkbox"
                                    id={`bait-${index}`}
                                    label={bait}
                                    checked={selectedBaits.includes(bait)}
                                    onChange={() => handleBaitToggle(bait)}
                                    className="mb-2"
                                />
                            ))}
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>

                {filteredFishes.length === 0 && (searchQuery || selectedBaits.length > 0) && (
                    <div className="text-center text-muted mt-2">
                        Không tìm thấy cá nào phù hợp với điều kiện tìm kiếm
                    </div>
                )}
                <div className="d-flex justify-content-between align-items-center mt-2">
                    {selectedBaits.length > 0 && (
                        <div className="text-muted">
                            <small>Đang lọc: {selectedBaits.join(', ')}</small>
                        </div>
                    )}
                    <div className={`text-muted ${selectedBaits.length > 0 ? 'text-end' : 'w-100 text-end'}`}>
                        Hiển thị {filteredFishes.length} / {fishes.length} loài cá
                    </div>
                </div>
            </div>

            <Row>
                {filteredFishes.map((fish) => {
                    const isExpanded = expandedFishIds.includes(fish.id);
                    return (
                        <Col key={fish.id} xs={12} sm={6} md={4} lg={3}>
                            <Card className="mb-4 shadow-sm">
                                {!isExpanded ? (
                                    <>
                                        <Card.Img
                                            variant="top"
                                            src={fish.image_url}
                                            alt={fish.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/not-found.jpg';
                                            }}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                        <Card.Body className="text-center">
                                            <Card.Title>
                                                {searchQuery ? (
                                                    <>
                                                        {fish.name.split(new RegExp(`(${searchQuery})`, 'i')).map((part, i) => 
                                                            part.toLowerCase() === searchQuery.toLowerCase() ? 
                                                                <span key={i} style={{ backgroundColor: "#FFF9C4" }}>{part}</span> : 
                                                                <span key={i}>{part}</span>
                                                        )}
                                                    </>
                                                ) : (
                                                    fish.name
                                                )}
                                            </Card.Title>
                                        </Card.Body>
                                    </>
                                ) : (
                                    <Card.Body>
                                        <Card.Title>
                                            {searchQuery ? (
                                                <>
                                                    {fish.name.split(new RegExp(`(${searchQuery})`, 'i')).map((part, i) => 
                                                        part.toLowerCase() === searchQuery.toLowerCase() ? 
                                                            <span key={i} style={{ backgroundColor: "#FFF9C4" }}>{part}</span> : 
                                                            <span key={i}>{part}</span>
                                                    )}
                                                </>
                                            ) : (
                                                fish.name
                                            )}
                                        </Card.Title>
                                        <Card.Text>
                                            <strong>Đặc điểm:</strong> {fish.characteristics.appearance}
                                            <br />
                                            <strong>Kích cỡ:</strong> {fish.characteristics.size}
                                            <br />
                                            <strong>Tập tính:</strong> {fish.behavior}
                                            <br />
                                            <strong>Mồi yêu thích:</strong> {fish.favorite_bait}
                                            <br />
                                            <strong>Thông tin:</strong> {fish.info}
                                        </Card.Text>
                                    </Card.Body>
                                )}
                                <Card.Footer className="text-center">
                                    <Button variant="primary" onClick={() => toggleFishInfo(fish.id)}>
                                        Infor
                                    </Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
}