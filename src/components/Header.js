import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../assets/styles/Header.css'; 

function Header() {
   const location = useLocation();
  const currentPath = location.pathname;

  const getLinkClass = (path) => {
    return `fw-semibold mx-2 pb-1 ${
      currentPath === path
        ? "text-primary border-bottom border-2 border-primary"
        : "text-secondary"
    }`;
  };
  return (
    <Navbar bg="white" expand="md" fixed="top" className="shadow-sm py-2">
      <Container>
        {/* Logo */}
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
          {/* Navigation */}
          <Nav className="me-auto ms-3">
      <Nav.Link as={Link} to="/" className={getLinkClass("/")}>
        Trang chủ
      </Nav.Link>
      <Nav.Link as={Link} to="/shop" className={getLinkClass("/shop")}>
        Sản phẩm
      </Nav.Link>
      <Nav.Link as={Link} to="/event" className={getLinkClass("/event")}>
        Sự kiện
      </Nav.Link>
      <Nav.Link as={Link} to="/newfeed" className={getLinkClass("/newfeed")}>
        Bài viết
      </Nav.Link>
      <Nav.Link as={Link} to="/knowledge" className={getLinkClass("/knowledge")}>
        Kiến thức
      </Nav.Link>
    </Nav>

          {/* Auth Buttons */}
          <div className="d-flex align-items-center">
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
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;