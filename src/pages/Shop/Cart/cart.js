import React, { useEffect, useState } from "react";
import { Container, Table, Button, Alert, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";

export default function Car() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);

  const fetchCart = async () => {
    if (!user) return;
    const res = await fetch(
      `http://localhost:9999/shoppingCart?userId=${user.id}`
    );
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
      if (!selectedItems.includes(item.id)) return acc;
      const product = products.find((p) => p.id === item.productId);
      return acc + (product ? product.price * item.quantity : 0);
    }, 0);
    setTotal(sum);
  }, [cartItems, products, selectedItems]);

  const updateQuantity = async (item, change) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return;

    const newQuantity = item.quantity + change;

    if (newQuantity > product.StockQuantity) {
      alert("Không thể thêm nữa! Vượt quá số lượng tồn kho.");
      return;
    }

    if (newQuantity <= 0) {
      await fetch(`http://localhost:9999/shoppingCart/${item.id}`, {
        method: "DELETE",
      });
    } else {
      await fetch(`http://localhost:9999/shoppingCart/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
    }

    fetchCart();
  };

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCheckout = async () => {
    const itemsToCheckout = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    if (!itemsToCheckout.length)
      return alert("Vui lòng chọn sản phẩm để thanh toán.");

    const newOrder = {
      userId: user.id,
      orderDate: new Date().toISOString(),
      statusId: 1,
      totalAmount: itemsToCheckout.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.productId);
        return sum + (product?.price || 0) * item.quantity;
      }, 0),
    };

    const orderRes = await fetch("http://localhost:9999/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    });

    const createdOrder = await orderRes.json();
    const orderId = createdOrder.id;

    for (const item of itemsToCheckout) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;

      await fetch("http://localhost:9999/orderDetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: createdOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.price,
        }),
      });
   
      await fetch(`http://localhost:9999/shop/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          StockQuantity: product.StockQuantity - item.quantity,
          SoldQuantity: (product.SoldQuantity || 0) + item.quantity,
        }),
      });

      await fetch(`http://localhost:9999/shoppingCart/${item.id}`, {
        method: "DELETE",
      });
    }

    alert("Đơn hàng đã được gửi, đang chờ xác nhận.");
    navigate("/orderHistory");
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">🛒 Giỏ hàng</h1>
      {cartItems.length === 0 ? (
        <Alert variant="info">Giỏ hàng của bạn đang trống.</Alert>
      ) : (
        <>
          <Table bordered hover responsive className="align-middle">
            <thead className="table-primary text-center">
              <tr>
                <th>Chọn</th>
                <th>#</th>
                <th>Sản phẩm</th>
                <th>Giá (VND)</th>
                <th>Số lượng</th>
                <th>Thành tiền (VND)</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => {
                const product = products.find((p) => p.id === item.productId);
                return (
                  <tr key={item.id}>
                    <td className="text-center">
                      <Form.Check
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                      />
                    </td>
                    <td className="text-center">{index + 1}</td>
                    <td>
                      <strong>{product?.name}</strong>
                      <div
                        className="text-muted"
                        style={{ fontSize: "0.85rem" }}
                      >
                        Còn lại: {product?.StockQuantity}
                      </div>
                    </td>

                    <td className="text-center">
                      {product?.price.toLocaleString()}
                    </td>
                    <td className="text-center">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => updateQuantity(item, -1)}
                      >
                        -
                      </Button>{" "}
                      <span className="mx-2">{item.quantity}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => updateQuantity(item, 1)}
                      >
                        +
                      </Button>
                    </td>
                    <td className="text-center">
                      {(product?.price * item.quantity).toLocaleString()}
                    </td>
                    <td className="text-center">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => updateQuantity(item, -item.quantity)}
                      >
                        Xoá
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <h4 className="text-end">
            Tổng cộng:{" "}
            <span className="text-primary">{total.toLocaleString()} VND</span>
          </h4>

          <div className="d-flex justify-content-end">
            <Button
              variant="success"
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
            >
              Thanh Toán
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}
