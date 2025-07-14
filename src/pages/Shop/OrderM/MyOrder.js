// 📁 File: src/pages/AdminPendingOrders.jsx
import React, { useEffect, useState } from "react";
import { Container, Table, Button, Spinner, Alert } from "react-bootstrap";

export default function AdminPendingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    fetch("http://localhost:9999/orders")
      .then((res) => res.json())
      .then((data) => {
        const pending = data.filter((order) => order.status === "Chờ xác nhận");
        setOrders(pending);
      })
      .catch((err) => console.error("Lỗi lấy đơn hàng:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:9999/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchOrders();
      } else {
        alert("Cập nhật trạng thái thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };

  const handleConfirm = (id) => {
    updateOrderStatus(id, "Đã xác nhận");
  };

  const handleCancel = (id) => {
    if (window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
      updateOrderStatus(id, "Đã hủy");
    }
  };

  return (
    <Container className="pt-5 mt-5">
      <h3 className="fw-bold mb-4">📋 Đơn hàng chờ xác nhận (Admin)</h3>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : orders.length === 0 ? (
        <Alert variant="info">Không có đơn hàng nào chờ xác nhận.</Alert>
      ) : (
        <Table bordered hover responsive>
          <thead className="table-dark text-center">
            <tr>
              <th>#</th>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order.id} className="text-center align-middle">
                <td>{idx + 1}</td>
                <td>{order.customerName}</td>
                <td>
                  {order.products.map((p, i) => (
                    <div key={i}>
                      {p.name} x {p.quantity}
                    </div>
                  ))}
                </td>
                <td>{order.total.toLocaleString()} VND</td>
                <td>
                  <span className="badge bg-warning text-dark">{order.status}</span>
                </td>
                <td>
                  <Button variant="success" size="sm" className="me-2" onClick={() => handleConfirm(order.id)}>
                    ✅ Xác nhận
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleCancel(order.id)}>
                    ❌ Hủy
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}


// 📁 File: src/pages/MyOrders.jsx
import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../Auth/AuthContext";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:9999/orders")
      .then((res) => res.json())
      .then((data) => {
        const userOrders = data.filter((order) => order.userId === user.id);
        setOrders(userOrders);
      })
      .catch((err) => console.error("Lỗi lấy đơn hàng:", err))
      .finally(() => setLoading(false));
  }, [user.id]);

  return (
    <Container className="pt-5 mt-5">
      <h3 className="fw-bold mb-4">📦 Đơn hàng của tôi</h3>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : orders.length === 0 ? (
        <Alert variant="info">Bạn chưa có đơn hàng nào.</Alert>
      ) : (
        <Table bordered hover responsive>
          <thead className="table-secondary text-center">
            <tr>
              <th>#</th>
              <th>Ngày đặt</th>
              <th>Sản phẩm</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order.id} className="text-center align-middle">
                <td>{idx + 1}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>
                  {order.products.map((p, i) => (
                    <div key={i}>
                      {p.name} x {p.quantity}
                    </div>
                  ))}
                </td>
                <td>{order.total.toLocaleString()} VND</td>
                <td>
                  <span className={`badge ${getStatusColor(order.status)}`}>{order.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

function getStatusColor(status) {
  switch (status) {
    case "Chờ xác nhận":
      return "bg-warning text-dark";
    case "Đã xác nhận":
      return "bg-info text-white";
    case "Đang giao":
      return "bg-primary";
    case "Đã giao":
      return "bg-success";
    case "Đã hủy":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
}
