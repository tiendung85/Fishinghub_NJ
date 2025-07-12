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
  const [sidebarOpen, setSidebarOpen] = useState(true);


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
            transition: all 0.3s ease;
            overflow-y: auto;
            box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1000;
            width: ${sidebarOpen ? '250px' : '70px'};
          }
          .sidebar.collapsed {
            width: 70px;
          }
          .sidebar.collapsed .nav-link-text,
          .sidebar.collapsed .user-info-text {
            display: none;
          }
          .nav-link {
            color: #d1d5db !important;
            padding: 12px 20px;
            border-radius: 0 25px 25px 0;
            transition: all 0.3s ease;
            margin: 5px 10px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .nav-link:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff !important;
            transform: translateX(5px);
          }
          .nav-link.active {
            background: #3b82f6 !important;
            color: #ffffff !important;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          }
          .content-area {
            background: #f3f4f6;
            min-height: 100vh;
            animation: fadeIn 0.5s ease-in;
            padding: 0 30px 30px 30px;
            margin-left: ${sidebarOpen ? '250px' : '70px'};
            transition: margin-left 0.3s ease;
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
            position: absolute;
            top: 15px;
            right: -15px;
            z-index: 1000;
            background: #3b82f6;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            transition: transform 0.3s ease;
          }
          .toggle-btn:hover {
            background: #2563eb;
            transform: rotate(90deg);
          }
          @media (max-width: 768px) {
            .sidebar {
              position: fixed;
              z-index: 1000;
              width: 250px;
              transform: translateX(${sidebarOpen ? '0' : '-100%'});
            }
            .content-area {
              margin-left: 0 !important;
            }
          }
        `}
      </style>
      <Container fluid className="p-0">
        <div
          className={`sidebar ${!sidebarOpen ? "collapsed" : ""}`}
        >
          <Button
            className="toggle-btn d-md-none"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
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
            <Nav.Link
              className="nav-link mt-auto border-top"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              <span className="nav-link-text">Logout</span>
            </Nav.Link>
          </Nav>
        </div>
        
        {/* Content Area */}
        <div className="content-area">
          <Outlet />
        </div>
      </Container>
    </>
  );
}

export default DashboardAdmin;
