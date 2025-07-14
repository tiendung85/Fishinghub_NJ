import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home/HomePage';
import NewFeed from './pages/NewFeed/NewFeedPage';
import Event from './pages/Event/EventPage';
import Shop from './pages/Shop/ShopPage';
import Knowledge from './pages/Knowledge/KnowledgePage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import DashboardAdmin from './dashboards/Admin/DashboardAdmin';
import AdminUsers from './dashboards/Admin/Users';
import AdminProducts from './dashboards/Admin/Products';
import AdminPosts from './dashboards/Admin/Posts';
import AdminKnowledge from './dashboards/Admin/Knowledge';
import { AuthProvider } from './pages/Auth/AuthContext';
import OrderAdmin from './dashboards/Admin/Orders';
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Admin routes without Header and Footer */}
          <Route path="/admin" element={<DashboardAdmin />}>
         
            <Route path="users" element={<AdminUsers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="knowledge" element={<AdminKnowledge />} />
            <Route path="/admin/orders" element={<OrderAdmin />} />
          </Route>
          {/* Other routes with Header and Footer */}
          <Route
            path="*"
            element={
              <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <Header />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/newfeed" element={<NewFeed />} />
                  <Route path="/event" element={<Event />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/knowledge" element={<Knowledge />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
                <Footer />
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;