import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner,
  Form,
} from "react-bootstrap";
import { useAuth } from "../Auth/AuthContext";

export default function Shop() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:9999/shop")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let updated = [...products];

    if (searchTerm) {
      updated = updated.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortOption) {
      case "price-asc":
        updated.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        updated.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        updated.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(updated);
  }, [searchTerm, sortOption, products]);

  const handleBuyClick = async (product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`http://localhost:9999/shoppingCart?userId=${user.id}&productId=${product.id}`);
      const existing = await res.json();

      if (existing.length > 0) {
        const updatedItem = existing[0];
        await fetch(`http://localhost:9999/shoppingCart/${updatedItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: updatedItem.quantity + 1 }),
        });
      } else {
        await fetch("http://localhost:9999/shoppingCart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            productId: product.id,
            quantity: 1,
          }),
        });
      }

      alert("Đã thêm vào giỏ hàng!");
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (error) {
      console.error("Lỗi thêm vào giỏ:", error);
      alert("Không thể thêm vào giỏ hàng.");
    }
  };

  return (
    <Container className="pt-5 mt-5">
      <h1 className="text-center fw-bold mb-4">📦 Sản phẩm</h1>

      <Row className="mb-4 gx-3">
        <Col xs={12} md={9} className="mb-2">
          <Form.Control
            type="text"
            placeholder="🔍 Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="shadow-sm rounded-pill px-4 py-3 fs-5"
            style={{ height: "56px" }}
          />
        </Col>
        <Col xs={12} md={3} className="mb-2">
          <Form.Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="rounded-pill py-3 px-3 fs-5 shadow-sm"
          >
            <option value="default">Sản phẩm nổi bật</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="name-asc">Tên A-Z</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <Alert variant="warning">Không tìm thấy sản phẩm phù hợp.</Alert>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="gy-4 gx-4">
          {filteredProducts.map((product) => (
            <Col key={product.id}>
              <Card className="h-100 shadow-sm border-0 rounded-4 p-2 card-hover-effect">
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.name}
                  className="rounded-4"
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fw-semibold mb-2 text-dark">
                    {product.name}
                  </Card.Title>
                  <Card.Text className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
                    {product.description}
                  </Card.Text>
                  <div className="mt-auto">
                    <p className="mb-1 fw-semibold text-primary">
                      Giá: {product.price.toLocaleString()} VND
                    </p>
                    <p className="mb-3 text-secondary" style={{ fontSize: "0.85rem" }}>
                      Còn lại: {product.StockQuantity}
                    </p>
                    <Button
                      variant="primary"
                      className="w-100 rounded-pill fw-semibold shadow-sm"
                      onClick={() => handleBuyClick(product)}
                    >
                      🛒 Thêm vào giỏ
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
