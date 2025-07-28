// AdminShop.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Spinner,
  Modal,
} from "react-bootstrap";

export default function AdminShop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      fetch(`http://localhost:9999/shop/${id}`, { method: "DELETE" })
        .then(() => setProducts(products.filter((p) => p.id !== id)))
        .catch((err) => console.error("Error deleting:", err));
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
      alert("Số lượng phải lớn hơn hoặc bằng 0!");
      return;
    }

    if (editProduct) {
      fetch(`http://localhost:9999/shop/${editProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editProduct, ...form, price, StockQuantity: stock }),
      })
        .then((res) => res.json())
        .then((data) => {
          setProducts(products.map((p) => (p.id === editProduct.id ? data : p)));
          handleCloseModal();
        });
    } else {
      fetch("http://localhost:9999/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price, StockQuantity: stock }),
      })
        .then((res) => res.json())
        .then((data) => {
          setProducts([...products, data]);
          handleCloseModal();
        });
    }
  };

  const handleShowDetailModal = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="pt-5 mt-5">
      <h2 className="mb-4">📦 Quản lý sản phẩm</h2>

      <div className="d-flex justify-content-between mb-3">
        <Form.Control
          type="text"
          placeholder="Tìm theo tên sản phẩm..."
          className="w-50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="success" onClick={() => handleShowModal()}>
          ➕ Thêm sản phẩm
        </Button>
      </div>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.price.toLocaleString()} VND</td>
                <td>{product.StockQuantity}</td>
                <td>
                  <div className="d-flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => handleShowDetailModal(product)}
                    >
                      👁 Xem
                    </Button>
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => handleShowModal(product)}
                    >
                      ✏️ Sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(product.id)}
                    >
                      ❌ Xóa
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal thêm/sửa */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control name="description" value={form.description} onChange={handleFormChange} as="textarea" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Giá</Form.Label>
              <Form.Control name="price" type="number" value={form.price} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ảnh (URL)</Form.Label>
              <Form.Control name="image" value={form.image} onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số lượng</Form.Label>
              <Form.Control name="StockQuantity" type="number" value={form.StockQuantity} onChange={handleFormChange} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
            <Button variant="primary" type="submit">{editProduct ? "Lưu thay đổi" : "Thêm mới"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal xem chi tiết */}
      <Modal show={showDetailModal} onHide={handleCloseDetailModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>🔍 Chi tiết sản phẩm</Modal.Title>
        </Modal.Header>
        {selectedProduct && (
          <Modal.Body>
            <div className="text-center mb-3">
              <img
                src={selectedProduct.image || "https://via.placeholder.com/300"}
                alt={selectedProduct.name}
                style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "12px" }}
              />
            </div>
            <h5 className="fw-bold">{selectedProduct.name}</h5>
            <p className="text-muted">{selectedProduct.description}</p>
            <p>💰 <strong>Giá:</strong> {Number(selectedProduct.price).toLocaleString()} VND</p>
            <p>📦 <strong>Số lượng tồn kho:</strong> {selectedProduct.StockQuantity}</p>
          </Modal.Body>
        )}
      </Modal>
    </Container>
  );
}
