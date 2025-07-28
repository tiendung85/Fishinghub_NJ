import React, { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Row, Col, Form } from "react-bootstrap";

function OrderAdmin() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [detailsMap, setDetailsMap] = useState({});
  const [users, setUsers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [products, setProducts] = useState([]);

  const [searchUser, setSearchUser] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      const [ordersRes, usersRes, statusRes, productRes] = await Promise.all([
        fetch("http://localhost:9999/orders?_sort=id&_order=desc"),
        fetch("http://localhost:9999/users"),
        fetch("http://localhost:9999/orderStatus"),
        fetch("http://localhost:9999/shop"),
      ]);
      const [ordersData, usersData, statusData, productData] = await Promise.all([
        ordersRes.json(),
        usersRes.json(),
        statusRes.json(),
        productRes.json(),
      ]);
      setOrders(ordersData);
      setUsers(usersData);
      setStatuses(statusData);
      setProducts(productData);

      const map = {};
      for (const order of ordersData) {
        const res = await fetch(`http://localhost:9999/orderDetails?orderId=${order.id}`);
        map[order.id] = await res.json();
      }
      setDetailsMap(map);
    };

    fetchAll();
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    if (searchUser.trim() !== "") {
      filtered = filtered.filter((order) =>
        getUserName(order.userId).toLowerCase().includes(searchUser.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => String(order.statusId) === selectedStatus);
    }

    setFilteredOrders(filtered);
  }, [orders, searchUser, selectedStatus]);

  const getUserName = (id) => users.find((u) => u.id === id)?.username || "N/A";
  const getStatusName = (id) =>
    statuses.find((s) => String(s.id) === String(id))?.name || "Không xác định";

  const nextStatusId = (currentId) => {
    if (currentId === 1) return 2;
    if (currentId === 2) return 3;
    return currentId;
  };

  const updateStatus = async (orderId, currentStatusId) => {
    const newStatusId = nextStatusId(currentStatusId);
    if (newStatusId === currentStatusId) return;

    await fetch(`http://localhost:9999/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statusId: newStatusId }),
    });

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, statusId: newStatusId } : o))
    );
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <Container className="mt-5 pt-5">
      <h2 className="mb-4">📦 Quản lý đơn hàng</h2>

      {/* Bộ lọc */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            placeholder="🔍 Tìm theo tên người mua..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Khách hàng</th>
            <th>Ngày đặt</th>
            <th>Trạng thái</th>
            <th>Tổng tiền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{getUserName(order.userId)}</td>
              <td>{new Date(order.orderDate).toLocaleString()}</td>
              <td>
                <Button
                  variant={
                    order.statusId === 1
                      ? "warning"
                      : order.statusId === 2
                      ? "success"
                      : "secondary"
                  }
                  size="sm"
                  onClick={() => updateStatus(order.id, order.statusId)}
                  disabled={order.statusId === 3}
                >
                  {getStatusName(order.statusId)}
                </Button>
              </td>
              <td>{order.totalAmount.toLocaleString()} VND</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => handleViewDetails(order)}
                >
                  Xem chi tiết
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal xem chi tiết */}
      {selectedOrder && (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết đơn hàng #{selectedOrder.id}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <h5>🧾 Thông tin đơn hàng</h5>
              <p><strong>Mã đơn hàng:</strong> #{selectedOrder.id}</p>
              <p><strong>Ngày đặt:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
              <p><strong>Trạng thái:</strong> {getStatusName(selectedOrder.statusId)}</p>
              <p><strong>Người mua:</strong> {getUserName(selectedOrder.userId)}</p>
            </div>

            <hr />
            <h5 className="mb-3">🛍️ Sản phẩm</h5>
            {detailsMap[selectedOrder.id]?.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              if (!product) return null;

              return (
                <div key={item.id} className="mb-3 p-3 border rounded-4 shadow-sm bg-light">
                  <div className="d-flex">
                    <img
                      src={product.image || "https://via.placeholder.com/100"}
                      alt={product.name}
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      className="rounded-4 me-3"
                    />
                    <div>
                      <h6 className="fw-bold">{product.name}</h6>
                      <p className="mb-1"><small>{product.description}</small></p>
                      <p className="mb-1">Số lượng: <strong>{item.quantity}</strong></p>
                      <p className="mb-1">Đơn giá: <strong>{item.unitPrice.toLocaleString()} VND</strong></p>
                      <p className="mb-0 text-primary">
                        Thành tiền:{" "}
                        <strong>
                          {(item.quantity * item.unitPrice).toLocaleString()} VND
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <hr />
            <h5 className="text-end mt-4">
              Tổng cộng:{" "}
              <span className="text-success">
                {selectedOrder.totalAmount.toLocaleString()} VND
              </span>
            </h5>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
}

export default OrderAdmin;
