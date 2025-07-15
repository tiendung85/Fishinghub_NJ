import React, { useEffect, useState } from "react";
import { Container, Table, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";

export default function Car() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchCart = async () => {
    if (!user) return;
    const res = await fetch(`http://localhost:9999/shoppingCart?userId=${user.id}`);
    const data = await res.json();
    setCartItems(data);
  };

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:9999/shop");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchCart();
    fetchProducts();
  }, []);

  useEffect(() => {
    const sum = cartItems.reduce((acc, item) => {
      const product = products.find(p => p.id === item.productId);
      return acc + (product ? product.price * item.quantity : 0);
    }, 0);
    setTotal(sum);
  }, [cartItems, products]);

  const updateQuantity = async (item, change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      await fetch(`http://localhost:9999/shoppingCart/${item.id}`, { method: "DELETE" });
    } else {
      await fetch(`http://localhost:9999/shoppingCart/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
    }
    fetchCart();
  };

  const handleCheckout = async () => {
    if (!user || cartItems.length === 0) return;

    const newOrder = {
      userId: user.id,
      orderDate: new Date().toISOString(),
      statusId: 1,
      totalAmount: total,
    };

    const orderRes = await fetch("http://localhost:9999/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    });

    if (!orderRes.ok) {
      alert("Không thể tạo đơn hàng. Vui lòng thử lại.");
      return;
    }

    const createdOrder = await orderRes.json();
    const orderId = createdOrder.id;

    for (const item of cartItems) {
      const product = products.find(p => p.id === item.productId);
      if (!product) continue;

      await fetch("http://localhost:9999/orderDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.price,
        }),
      });
    }

    for (const item of cartItems) {
      await fetch(`http://localhost:9999/shoppingCart/${item.id}`, {
        method: "DELETE",
      });
    }

    alert("Đặt hàng thành công!");
    navigate("/orderHistory");
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">🛒 Giỏ hàng</h1>
      {cartItems.length === 0 ? (
        <Alert variant="info">Giỏ hàng của bạn đang trống.</Alert>
      ) : (
        <>
          <Table bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => {
                const product = products.find(p => p.id === item.productId);
                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{product?.name}</td>
                    <td>{product?.price.toLocaleString()} VND</td>
                    <td>
                      <Button variant="outline-secondary" size="sm" onClick={() => updateQuantity(item, -1)}>-</Button>{' '}
                      {item.quantity}{' '}
                      <Button variant="outline-secondary" size="sm" onClick={() => updateQuantity(item, 1)}>+</Button>
                    </td>
                    <td>{(product?.price * item.quantity).toLocaleString()} VND</td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => updateQuantity(item, -item.quantity)}>
                        Xoá
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <h4 className="text-end">
            Tổng cộng: <span className="text-primary">{total.toLocaleString()} VND</span>
          </h4>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="outline-primary" onClick={() => navigate("/orderHistory")}>
              Xem lịch sử đơn hàng
            </Button>
            <Button variant="success" onClick={handleCheckout}>
              Thanh Toán
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}
