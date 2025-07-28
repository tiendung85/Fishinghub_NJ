import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/Auth/AuthContext'; 
import '../assets/styles/Header.css';
import NotificationBell from "../pages/NewFeed/NotificationBell";
import { FaBell, FaShoppingCart } from "react-icons/fa";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const { user, logout } = useAuth(); 
  const [cartCount, setCartCount] = useState(0); 

  useEffect(() => {
    const updateCartCount = () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const total = storedCart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    };

    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getLinkClass = (path) =>
    `fw-semibold mx-2 pb-1 ${currentPath === path
      ? "text-primary border-bottom border-2 border-primary"
      : "text-secondary"
    }`;

  return (
    <Navbar bg="white" expand="lg" fixed="top" className="shadow-sm py-2">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2"
          style={{
            fontFamily: 'Segoe UI, SegoeUI,Arial, sans-serif',
            fontSize: '2.2rem',
            letterSpacing: '2px',
            color: '#3989CE',
            fontWeight: 700
          }}
        >
          <span role="img" aria-label="fish" style={{ fontSize: '2.2rem' }}>🐟</span>
          FishingHub
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto ms-3">
            <Nav.Link as={Link} to="/" className={getLinkClass("/")}>Trang chủ</Nav.Link>
            <Nav.Link as={Link} to="/shop" className={getLinkClass("/shop")}>Sản phẩm</Nav.Link>
            <Nav.Link as={Link} to="/event" className={getLinkClass("/event")}>Sự kiện</Nav.Link>
            <Nav.Link as={Link} to="/newfeed" className={getLinkClass("/newfeed")}>Bài viết</Nav.Link>
            <Nav.Link as={Link} to="/knowledge" className={getLinkClass("/knowledge")}>Kiến thức</Nav.Link>
          </Nav>
          <div className="d-flex align-items-center gap-2">
            {user && (
              <>
                <span className="icon-btn position-relative" style={{ padding: 0 }}>
                  <NotificationBell currentUser={user} />
                </span>
                <Button
                  as={Link}
                  to="/cart"
                  variant="link"
                  className="icon-btn position-relative"
                  style={{ border: "none", boxShadow: "none", padding: 0 }}
                >
                  <FaShoppingCart size={22} color="#3989CE" style={{ transform: "translateY(2px)" }} />
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </Button>
                <Nav.Link
                  as={Link}
                  to="/profile"
                  className="mx-2 fw-semibold text-secondary text-decoration-none"
                >
                  Xin chào, {user.username || user.name || "người dùng"}
                </Nav.Link>
                <Button
                  variant="outline-primary"
                  className="rounded-pill px-4 fw-semibold shadow-sm header-btn"
                  onClick={handleLogout}
                  style={{ borderColor: "#3989CE", color: "#3989CE" }}
                >
                  Đăng xuất
                </Button>
              </>
            )}
            {!user && (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-primary"
                  className="rounded-pill me-2 px-4 fw-semibold shadow-sm header-btn"
                  style={{ borderColor: "#3989CE", color: "#3989CE" }}
                >
                  Đăng nhập
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="primary"
                  className="rounded-pill px-4 fw-semibold shadow-sm header-btn"
                  style={{ background: "#3989CE", borderColor: "#3989CE" }}
                >
                  Đăng ký
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;