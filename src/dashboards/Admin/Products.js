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
  Modal,
} from "react-bootstrap";

export default function AdminShop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    StockQuantity: "",
  });

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
      updated = updated.filter((p) =>
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

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      fetch(`http://localhost:9999/shop/${id}`, { method: "DELETE" })
        .then(() => {
          setProducts(products.filter((p) => p.id !== id));
        })
        .catch((err) => console.error("Error deleting product:", err));
    }
  };

  const handleShowModal = (product = null) => {
    setEditProduct(product);
    setForm(
      product
        ? {
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            StockQuantity: product.StockQuantity,
          }
        : {
            name: "",
            description: "",
            price: "",
            image: "",
            StockQuantity: "",
          }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditProduct(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const price = Number(form.price);
    const stock = Number(form.StockQuantity);

    if (!form.name || form.name.trim() === "") {
      alert("Vui lòng nhập tên sản phẩm!");
      return;
    }
    if (isNaN(price) || price <= 0) {
      alert("Giá sản phẩm phải lớn hơn 0 đồng!");
      return;
    }
    if (isNaN(stock) || stock < 0) {
      alert("Số lượng sản phẩm phải lớn hơn hoặc bằng 0!");
      return;
    }

    if (editProduct) {
      // Sửa sản phẩm
      fetch(`http://localhost:9999/shop/${editProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editProduct,
          ...form,
          price,
          StockQuantity: stock,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setProducts(
            products.map((p) => (p.id === editProduct.id ? data : p))
          );
          handleCloseModal();
        });
    } else {
      // Thêm sản phẩm
      fetch("http://localhost:9999/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price,
          StockQuantity: stock,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setProducts([...products, data]);
          handleCloseModal();
        });
    }
  };

  return (
    <Container className="pt-5 mt-5">
   
      <Row className="mb-4 gx-3">
        <Col xs={12} md={9} className="mb-2">
          <Form.Control
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="shadow-sm rounded-pill px-4 py-3 fs-5"
            style={{ height: "56px" }}
          />
        </Col>
        <Col xs={12} md={3} className="mb-2 d-flex justify-content-end">
          <Form.Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="rounded-pill py-3 px-3 fs-5 shadow-sm me-2"
          >
            <option value="default">Sản phẩm nổi bật</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="name-asc">Tên A-Z</option>
          </Form.Select>
          <Button
            variant="success"
            className="rounded-pill fw-semibold"
            onClick={() => handleShowModal()}
          >
            Thêm sản phẩm
          </Button>
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
                  <Card.Text
                    className="text-muted mb-3"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {product.description}
                  </Card.Text>
                  <div className="mt-auto">
                    <p className="mb-1 fw-semibold text-primary">
                      Giá: {product.price?.toLocaleString()} VND
                    </p>
                    <p
                      className="mb-3 text-secondary"
                      style={{ fontSize: "0.85rem" }}
                    >
                      Còn lại: {product.StockQuantity}
                    </p>
                    <Button
                      variant="warning"
                      className="w-100 rounded-pill fw-semibold shadow-sm mb-2"
                      onClick={() => handleShowModal(product)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="danger"
                      className="w-100 rounded-pill fw-semibold shadow-sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      Xóa sản phẩm
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal Thêm/Sửa sản phẩm */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                name="description"
                value={form.description}
                onChange={handleFormChange}
                as="textarea"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Giá</Form.Label>
              <Form.Control
                name="price"
                type="number"
                value={form.price}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ảnh (URL)</Form.Label>
              <Form.Control
                name="image"
                value={form.image}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số lượng</Form.Label>
              <Form.Control
                name="StockQuantity"
                type="number"
                value={form.StockQuantity}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              {editProduct ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
