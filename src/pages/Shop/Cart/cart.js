import React, { useEffect, useState } from "react";
import { Container, Table, Button, Alert } from "react-bootstrap";

function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    calculateTotal(storedCart);
  }, []);

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

  const handleRemove = (id) => {
    const updatedCart = [...cart];
    const index = updatedCart.findIndex((item) => item.id === id);

    if (index >= 0) {
      if (updatedCart[index].quantity > 1) {
        updatedCart[index].quantity -= 1;
      } else {
        updatedCart.splice(index, 1); // remove item entirely if quantity is 1
      }

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      calculateTotal(updatedCart);

      // Notify other components like Header
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">🛒 Giỏ hàng của bạn</h1>

      {cart.length === 0 ? (
        <Alert variant="info">Giỏ hàng đang trống.</Alert>
      ) : (
        <>
          <Table bordered hover responsive>
            <thead className="table-primary">
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
              {cart.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.price.toLocaleString()} VND</td>
                  <td>{item.quantity}</td>
                  <td>{(item.price * item.quantity).toLocaleString()} VND</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemove(item.id)}
                    >
                      Xoá
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h4 className="text-end">
            Tổng cộng:{" "}
            <span className="text-primary">{total.toLocaleString()} VND</span>
          </h4>
        </>
      )}
    </Container>
  );
}

export default Cart;
