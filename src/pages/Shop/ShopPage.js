import React, { useEffect, useState } from "react";
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

import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../Auth/AuthContext";

export default function Shop() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const navigate = useNavigate();

  // Fetch products and categories
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          fetch("http://localhost:9999/shop"),
          fetch("http://localhost:9999/categories"),
        ]);
        const [productData, categoryData] = await Promise.all([
          productRes.json(),
          categoryRes.json(),
        ]);
        setProducts(productData);
        setFilteredProducts(productData);
        setCategories(categoryData);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Filter + sort logic
  useEffect(() => {
    let updated = [...products];

    if (searchTerm) {
      updated = updated.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      updated = updated.filter(
        (p) => String(p.CategoryId) === String(selectedCategory)
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
  }, [searchTerm, sortOption, selectedCategory, products]);

  const handleBuyClick = async (product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:9999/shoppingCart?userId=${user.id}&productId=${product.id}`
      );
      const existing = await res.json();

      const currentQuantityInCart =
        existing.length > 0 ? existing[0].quantity : 0;
      const maxQuantity = product.StockQuantity;

      if (currentQuantityInCart >= maxQuantity) {
        alert("❌ Số lượng trong giỏ đã đạt giới hạn tồn kho.");
        return;
      }

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

      alert("🛒 Đã thêm vào giỏ hàng!");
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (error) {
      console.error("Lỗi thêm giỏ:", error);
      alert("❌ Không thể thêm vào giỏ hàng.");
    }
  };

  return (
    <Container className="pt-5 mt-5">
      <h1 className="text-center fw-bold mb-4" style={{ marginTop: "30px" }}>
        🎣 Cửa hàng dụng cụ câu cá
      </h1>

      {/* Bộ lọc */}
      <Row className="mb-4 gx-3 align-items-center">
        <Col xs={12} md={4} className="mb-2">
          <Form.Control
            type="text"
            placeholder="🔍 Tìm sản phẩm theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="shadow-sm rounded-pill px-4 py-3 fs-5"
          />
        </Col>

        <Col xs={6} md={2} className="mb-2">
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-pill py-3 px-3 fs-5 shadow-sm"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col xs={6} md={3} className="mb-2">
          <Form.Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="rounded-pill py-3 px-3 fs-5 shadow-sm"
          >
            <option value="default">Sắp xếp mặc định</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="name-asc">Tên A-Z</option>
          </Form.Select>
        </Col>

        <Col xs={12} md={3} className="mb-2 text-md-end text-center">
          <Button
            variant="outline-primary"
            className="rounded-pill px-4 fw-semibold"
            onClick={() => navigate("/orderHistory")}
          >
            📦 Lịch sử đơn hàng
          </Button>
        </Col>
      </Row>

      {/* Danh sách sản phẩm */}
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <Alert variant="warning">⚠️ Không tìm thấy sản phẩm nào phù hợp.</Alert>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
          {filteredProducts.map((product) => (
            <Col key={product.id}>
              <Card className="h-100 shadow-sm border-0 rounded-4 p-2">
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.name}
                  className="rounded-4"
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fw-bold text-dark fs-5">
                    {product.name}
                  </Card.Title>
                  <Card.Text
                    className="text-muted mb-3"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {product.description}
                  </Card.Text>

                  <div className="mt-auto">
                    <p className="mb-1 fw-semibold text-success">
                      💰 {product.price.toLocaleString()} VND
                    </p>
                    <div
                      className="d-flex justify-content-between text-secondary mb-3"
                      style={{ fontSize: "0.85rem" }}
                    >
                      <div>
                        Đã bán: <strong>{product.SoldQuantity}</strong>
                      </div>
                      <div>
                        Còn lại: <strong>{product.StockQuantity}</strong>
                      </div>
                    </div>

                    <Button
                      variant="success"
                      className="w-100 rounded-pill fw-semibold"
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
