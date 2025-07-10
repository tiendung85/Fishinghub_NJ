import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/Auth/AuthContext'; // ✅ adjust path if needed
import '../assets/styles/Header.css';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const { user, logout } = useAuth(); // ✅ auth state from context
  const [cartCount, setCartCount] = useState(0); // ✅ cart count state

  // 🔄 Load cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const total = storedCart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    };

    // Run once on mount
    updateCartCount();

    // ✅ Listen to both localStorage & custom event
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    logout(); // ✅ clear user
    navigate("/login");
  };

  const getLinkClass = (path) =>
    `fw-semibold mx-2 pb-1 ${currentPath === path
      ? "text-primary border-bottom border-2 border-primary"
      : "text-secondary"
    }`;

  return (
    <Navbar bg="white" expand="md" fixed="top" className="shadow-sm py-2">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="text-primary d-flex align-items-center gap-2"
          style={{ fontFamily: 'Pacifico', fontSize: '2.2rem', letterSpacing: '2px' }}
        >
          <span role="img" aria-label="fish" style={{ fontSize: '2.2rem' }}>🎣</span>
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

          <div className="d-flex align-items-center">
            {user ? (
              <>
                <span className="me-3 fw-semibold text-secondary">
                  Xin chào, {user.username || user.name || "người dùng"}
                </span>

                {/* ✅ Giỏ hàng with item count */}


                <Button
                  variant="outline-danger"
                  className="rounded-pill px-4 fw-semibold shadow-sm"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </Button>

                <Button
                  as={Link}
                  to="/cart"
                  variant="outline-success"
                  className="rounded-pill ms-2 px-4 fw-semibold shadow-sm" // 👈 added ms-2 here
                  style={{ borderWidth: 2 }}
                >
                  🛒 Giỏ hàng ({cartCount})
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-primary"
                  className="rounded-pill me-2 px-4 fw-semibold shadow-sm"
                  style={{ borderWidth: 2 }}
                >
                  Đăng nhập
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="primary"
                  className="rounded-pill px-4 fw-semibold shadow-sm"
                  style={{ borderWidth: 2 }}
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