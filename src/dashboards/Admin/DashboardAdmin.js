import React, { useEffect, useState } from "react";
import { useAuth } from "../../pages/Auth/AuthContext";
import { useNavigate, Outlet, NavLink } from "react-router-dom";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { 
  FaUsers, 
  FaBox, 
  FaNewspaper, 
  FaBook, 
  FaSignOutAlt, 
  FaUserCircle, 
  FaBars 
} from "react-icons/fa";

function DashboardAdmin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Đổi từ true sang false

  useEffect(() => {
    if (!user || user.role !== 3) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <style>
        {`
          .sidebar {
            background: linear-gradient(180deg, #1a2a44, #2c3e50);
            height: 100vh;
            transition: width 0.3s ease, transform 0.3s;
            overflow-y: auto;
            box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1040;
            width: 16.6667%;
            min-width: 200px;
            max-width: 250px;
            border-right: none; 
          }
          .sidebar.collapsed {
            width: 70px !important;
            min-width: 70px !important;
            max-width: 70px !important;
            overflow-x: hidden;
          }
          .sidebar.collapsed:hover {
            width: 220px !important;
            min-width: 200px !important;
            max-width: 250px !important;
            transition: width 0.3s;
          }
          .sidebar .nav-link {
            color: #fff !important;
            display: flex;
            align-items: center;
            font-weight: 500;
            font-size: 16px;
            padding: 12px 20px;
            transition: background 0.2s;
            gap: 14px;
            white-space: nowrap;
          }
          .sidebar .nav-link.active, .sidebar .nav-link:hover {
            background: rgba(59, 130, 246, 0.18);
            color: #fff !important;
          }
          .sidebar .nav-link svg {
            font-size: 20px;
            margin-right: 10px;
            min-width: 20px;
          }
          .sidebar .nav-link-text {
            margin-left: 4px;
            letter-spacing: 0.5px;
            display: inline;
            transition: opacity 0.2s;
          }
          .sidebar.collapsed .nav-link-text {
            display: none;
            opacity: 0;
            transition: opacity 0.2s;
          }
          .sidebar.collapsed:hover .nav-link-text {
            display: inline;
            opacity: 1;
            transition: opacity 0.2s 0.1s;
          }
          .content-area {
            min-height: 100vh;
            animation: fadeIn 0.5s ease-in;
            padding: 0 12px;
            margin-left: 16.6667%;
            width: 83.3333%;
            transition: margin-left 0.3s, width 0.3s;
          }
          .sidebar.collapsed ~ .content-area {
            margin-left: 70px !important;
            width: calc(100% - 70px) !important;
          }
          /* Luôn hiển thị sidebar trên mọi loại màn hình */
          @media (max-width: 1200px) {
            .sidebar {
              width: 200px;
              min-width: 150px;
              max-width: 200px;
              left: 0;
              transform: none !important;
            }
            .content-area {
              margin-left: 200px;
              width: calc(100% - 200px);
            }
            .sidebar.collapsed ~ .content-area {
              margin-left: 70px !important;
              width: calc(100% - 70px) !important;
            }
          }
          @media (max-width: 992px) {
            .sidebar {
              width: 160px;
              min-width: 120px;
              max-width: 160px;
              left: 0;
              transform: none !important;
            }
            .content-area {
              margin-left: 160px;
              width: calc(100% - 160px);
            }
            .sidebar.collapsed ~ .content-area {
              margin-left: 70px !important;
              width: calc(100% - 70px) !important;
            }
          }
          @media (max-width: 768px) {
            .sidebar {
              width: 120px;
              min-width: 70px;
              max-width: 120px;
              left: 0;
              transform: none !important;
              position: fixed;
              height: 100vh;
              z-index: 2000;
            }
            .sidebar.collapsed {
              width: 50px !important;
              min-width: 50px !important;
              max-width: 50px !important;
            }
            .content-area {
              margin-left: 120px !important;
              width: calc(100% - 120px) !important;
              padding: 0 6px;
            }
            .sidebar.collapsed ~ .content-area {
              margin-left: 50px !important;
              width: calc(100% - 50px) !important;
            }
          }
          @media (max-width: 576px) {
            .sidebar {
              width: 70px;
              min-width: 50px;
              max-width: 70px;
              left: 0;
              transform: none !important;
              padding-top: 60px;
            }
            .content-area {
              margin-left: 70px !important;
              width: calc(100% - 70px) !important;
              padding: 0 2px;
            }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .user-info {
            padding: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            color: #ffffff;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .user-info svg {
            width: 40px;
            height: 40px;
          }
          .toggle-btn {
            display: none !important;
          }
        `}
      </style>
      <Container fluid className="p-0">
        <Row className="g-0">
          <Col
            md={sidebarOpen ? 2 : 1}
            className={`sidebar ${!sidebarOpen ? "collapsed" : ""}`}
            style={{ padding: 0, margin: 0 }} 
          >
            <Button
              className="toggle-btn d-md-none"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
              style={{ display: "block" }}
            >
              <FaBars />
            </Button>
            <Nav className="flex-column">
              <div className="user-info">
                <FaUserCircle />
                <div className="user-info-text">
                  <h6 className="mb-0">{user?.username || "Admin"}</h6>
                  <small>{user?.email || "Guest"}</small>
                </div>
              </div>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <FaUsers />
                <span className="nav-link-text">Users</span>
              </NavLink>
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <FaBox />
                <span className="nav-link-text">Products</span>
              </NavLink>
              <NavLink
                to="/admin/posts"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <FaNewspaper />
                <span className="nav-link-text">Posts</span>
              </NavLink>
              <NavLink
                to="/admin/knowledge"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                
                <FaBook />
                <span className="nav-link-text">Knowledge</span>
              </NavLink>
               <NavLink
                to="/admin/managerevent"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                
                <FaBook />
                <span className="nav-link-text">Events</span>
              </NavLink>
               <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                
                <FaBook />
                <span className="nav-link-text">Orders</span>
              </NavLink>



              <Nav.Link
                className="nav-link mt-auto border-top"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                <span className="nav-link-text">Logout</span>
              </Nav.Link>
            </Nav>
          </Col>
          <Col
            md={sidebarOpen ? 10 : 11}
            className="content-area"
            style={{
              marginLeft: sidebarOpen
                ? window.innerWidth <= 768
                  ? 0
                  : "16.6667%"
                : window.innerWidth <= 768
                ? 0
                : "70px",
              width: sidebarOpen
                ? window.innerWidth <= 768
                  ? "100%"
                  : "83.3333%"
                : window.innerWidth <= 768
                ? "100%"
                : "calc(100% - 70px)",
              transition: "margin-left 0.3s, width 0.3s",
              padding: window.innerWidth <= 576 ? "0 2px" : window.innerWidth <= 768 ? "0 6px" : "0 12px"
            }}
          >
            <Outlet />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default DashboardAdmin;