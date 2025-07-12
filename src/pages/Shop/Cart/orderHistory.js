import React, { useEffect, useState } from "react";
import { Container, Table, Button, Alert } from "react-bootstrap";
import { useAuth } from '../../Auth/AuthContext';
import { useNavigate } from "react-router-dom";

function OrderHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [detailsMap, setDetailsMap] = useState({});

  const getStatusName = (statusId) => {
    switch (statusId) {
      case 1: return "Chờ duyệt";
      case 2: return "Đã duyệt";
      case 3: return "Hoàn thành";
      case 4: return "Đã thanh toán";
      case 5: return "Đã hủy";
      default: return "Không xác định";
    }
  };

  useEffect(() => {
    if (!user) return navigate("/login");

    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:9999/orders?userId=${user.id}&_sort=id&_order=desc`);
        const data = await res.json();
        setOrders(data);

        const detailsData = {};
        for (const order of data) {
          const resDetails = await fetch(`http://localhost:9999/orderDetails?orderId=${order.id}`);
          const orderDetails = await resDetails.json();
          detailsData[order.id] = orderDetails;
        }
        setDetailsMap(detailsData);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancel = async (orderId) => {
    const res = await fetch(`http://localhost:9999/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statusId: 5 }),
    });

    if (res.ok) {
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, statusId: 5 } : order
        )
      );
      alert("Đơn hàng đã được hủy.");
    } else {
      alert("Hủy đơn hàng thất bại.");
    }
  };

  return (
    <Container className="mt-5 pt-5">
      <h2 className="mb-4">📦 Lịch sử đơn hàng</h2>

      {orders.length === 0 ? (
        <Alert variant="info">Bạn chưa có đơn hàng nào gần đây.</Alert>
      ) : (
        orders.map((order, index) => (
          <div key={order.id} className="mb-5">
            <h5 className="mb-2">Mã đơn hàng: #{order.id}</h5>
            <p><strong>Ngày đặt:</strong> {new Date(order.orderDate).toLocaleString()}</p>
            <p><strong>Trạng thái:</strong> {getStatusName(order.statusId)}</p>

            <Table bordered hover responsive className="mt-3">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>ID sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {detailsMap[order.id]?.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>{item.productId}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unitPrice.toLocaleString()} VND</td>
                    <td>{(item.quantity * item.unitPrice).toLocaleString()} VND</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="text-end mt-2">
              <h5>Tổng tiền: <span className="text-primary">{order.totalAmount.toLocaleString()} VND</span></h5>
              {order.statusId !== 5 && (
                <Button variant="danger" className="mt-2" onClick={() => handleCancel(order.id)}>
                  Hủy đơn hàng
                </Button>
              )}
            </div>

            <hr className="my-4" />
          </div>
        ))
      )}
    </Container>
  );
}

export default OrderHistory;
