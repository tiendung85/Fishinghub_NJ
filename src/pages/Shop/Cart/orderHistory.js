import React, { useEffect, useState } from "react";
import { Container, Table, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";

function OrderHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [detailsMap, setDetailsMap] = useState({});
  const [products, setProducts] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) return navigate("/login");

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `http://localhost:9999/orders?userId=${user.id}&_sort=id&_order=desc`
        );
        const data = await res.json();
        setOrders(data);

        const resProducts = await fetch("http://localhost:9999/shop");
        const productList = await resProducts.json();
        setProducts(productList);

        const detailsData = {};
        for (const order of data) {
          const resDetails = await fetch(
            `http://localhost:9999/orderDetails?orderId=${order.id}`
          );
          const orderDetails = await resDetails.json();
          detailsData[order.id] = orderDetails;
        }
        setDetailsMap(detailsData);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const getStatusName = (statusId) => {
    switch (statusId) {
      case 1:
        return "Chờ xác nhận";
      case 2:
        return "Đã xác nhận";
      case 3:
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  useEffect(() => {
    if (!user) return navigate("/login");

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `http://localhost:9999/orders?userId=${user.id}&_sort=id&_order=desc`
        );
        const data = await res.json();
        setOrders(data);

        const detailsData = {};
        for (const order of data) {
          const resDetails = await fetch(
            `http://localhost:9999/orderDetails?orderId=${order.id}`
          );
          const orderDetails = await resDetails.json();
          detailsData[order.id] = orderDetails;
        }
        setDetailsMap(detailsData);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const resOrders = await fetch(
          `http://localhost:9999/orders?_sort=id&_order=desc`
        );
        const ordersData = await resOrders.json();
        setOrders(ordersData);

        const resProducts = await fetch("http://localhost:9999/shop");
        const productsData = await resProducts.json();
        setProducts(productsData);

        const detailsMapTemp = {};
        for (const order of ordersData) {
          const resDetails = await fetch(
            `http://localhost:9999/orderDetails?orderId=${order.id}`
          );
          const orderDetails = await resDetails.json();
          detailsMapTemp[order.id] = orderDetails;
        }
        setDetailsMap(detailsMapTemp);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchAll();
  }, []);

  const handleCancel = async (orderId) => {
    const res = await fetch(`http://localhost:9999/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statusId: 5 }),
    });

    if (res.ok) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, statusId: 5 } : order
        )
      );
      alert("Đơn hàng đã được hủy.");
    } else {
      alert("Hủy đơn hàng thất bại.");
    }
  };

  return (
    <>
      <Container className="mt-5 pt-5">
        <h2 className="mb-4">📦 Lịch sử đơn hàng</h2>

        {orders.length === 0 ? (
          <Alert variant="info">Bạn chưa có đơn hàng nào gần đây.</Alert>
        ) : (
          orders.map((order, index) => (
            <div key={order.id} className="mb-5">
              <h5 className="mb-2">Mã đơn hàng: #{order.id}</h5>
              <p>
                <strong>Ngày đặt:</strong>{" "}
                {new Date(order.orderDate).toLocaleString()}
              </p>
              <p>
                <strong>Trạng thái:</strong> {getStatusName(order.statusId)}
              </p>

              <Table bordered hover responsive className="mt-3">
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>

                <tbody>
                  {detailsMap[order.id]?.map((item, idx) => {
                    const product = products.find(
                      (p) => p.id === item.productId
                    );
                    return (
                      <tr key={item.id}>
                        <td>{idx + 1}</td>
                        <td>{product?.name || "Không tìm thấy"}</td>
                        <td>{item.quantity}</td>
                        <td>{item.unitPrice.toLocaleString()} VND</td>
                        <td>
                          {(item.quantity * item.unitPrice).toLocaleString()}{" "}
                          VND
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>

              <div className="text-end mt-2">
                <h5>
                  Tổng tiền:{" "}
                  <span className="text-primary">
                    {order.totalAmount.toLocaleString()} VND
                  </span>
                </h5>
                {order.statusId === 1 && (
                  <Button
                    variant="danger"
                    className="mt-2"
                    onClick={() => handleCancel(order.id)}
                  >
                    Hủy đơn hàng
                  </Button>
                )}

                <Button
                  variant="info"
                  className="mt-2 ms-2"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowModal(true);
                  }}
                >
                  Xem chi tiết
                </Button>
              </div>

              <hr className="my-4" />
            </div>
          ))
        )}
      </Container>

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
              <p>
                <strong>Mã đơn hàng:</strong> #{selectedOrder.id}
              </p>
              <p>
                <strong>Ngày đặt:</strong>{" "}
                {new Date(selectedOrder.orderDate).toLocaleString()}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                {getStatusName(selectedOrder.statusId)}
              </p>
              <p>
                <strong>Người mua:</strong> {user.username}
              </p>
            </div>

            <hr />

            <h5 className="mb-3">🛍️ Sản phẩm</h5>
            {detailsMap[selectedOrder.id]?.map((item, idx) => {
              const product = products.find((p) => p.id === item.productId);
              if (!product) return null;

              return (
                <div
                  key={item.id}
                  className="mb-3 p-3 border rounded-4 shadow-sm bg-light"
                >
                  <div className="d-flex">
                    <img
                      src={product.image || "https://via.placeholder.com/100"}
                      alt={product.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                      className="rounded-4 me-3"
                    />
                    <div>
                      <h6 className="fw-bold">{product.name}</h6>
                      <p className="mb-1">
                        <small>{product.description}</small>
                      </p>
                      <p className="mb-1">
                        Số lượng: <strong>{item.quantity}</strong>
                      </p>
                      <p className="mb-1">
                        Đơn giá:{" "}
                        <strong>{item.unitPrice.toLocaleString()} VND</strong>
                      </p>
                      <p className="mb-0 text-primary">
                        Thành tiền:{" "}
                        <strong>
                          {(item.quantity * item.unitPrice).toLocaleString()}{" "}
                          VND
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

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default OrderHistory;
