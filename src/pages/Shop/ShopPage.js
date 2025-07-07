import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert, Spinner, Stack } from "react-bootstrap";
import { useAuth } from "../Auth/AuthContext"; 

export default function Shop() {
  const { user, logout } = useAuth(); // ✅ useAuth from context
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch product list once
  useEffect(() => {
    fetch("http://localhost:9999/shop")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Handle add to cart (check login here only)
  const handleBuyClick = (product) => {
    if (!user) {
      alert("Bạn cần đăng nhập để mua sản phẩm.");
      navigate("/login");
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = existingCart.findIndex((item) => item.id === product.id);

    if (index >= 0) {
      existingCart[index].quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert("Đã thêm vào giỏ hàng!");
  };

  return (
    <Container className="mt-4">
      <Stack direction="horizontal" gap={2} className="mb-3 justify-content-end">
        {user ? (
          <>
            <span>Xin chào, {user.username}</span>
            <Button variant="outline-danger" size="sm" onClick={logout}>
              Đăng xuất
            </Button>
          </>
        ) : (
          <Button variant="outline-primary" size="sm" onClick={() => navigate("/login")}>
            Đăng nhập
          </Button>
        )}
      </Stack>

      <h1 className="text-center mb-4">🛍️ Shop</h1>
      <h4 className="mb-4 text-muted">Sản phẩm nổi bật</h4>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" />
        </div>
      ) : products.length === 0 ? (
        <Alert variant="warning">Không có sản phẩm nào.</Alert>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {products.map((product) => (
            <Col key={product.id}>
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.name}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text style={{ fontSize: "0.9rem" }}>
                    {product.description}
                  </Card.Text>
                  <Card.Text>
                    <strong>Giá:</strong> {product.price.toLocaleString()} VND
                    <br />
                    <strong>Còn lại:</strong> {product.StockQuantity}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="bg-white border-top-0">
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => handleBuyClick(product)}
                  >
                    Mua
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
