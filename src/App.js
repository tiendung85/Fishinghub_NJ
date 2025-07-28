import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home/HomePage';
import NewFeed from './pages/NewFeed/NewFeedPage';
import Event from './pages/Event/EventPage';
import Shop from './pages/Shop/ShopPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import DashboardAdmin from './dashboards/Admin/DashboardAdmin';
import AdminUsers from './dashboards/Admin/Users';
import AdminProducts from './dashboards/Admin/Products';
import AdminPosts from './dashboards/Admin/Posts';
import AdminKnowledge from './dashboards/Admin/Knowledge';
import { AuthProvider } from './pages/Auth/AuthContext';
import ProfilePage from './pages/Profile/ProfilePage';
import KnowLedgePage from './pages/Knowledge/KnowLedgePage';
import EventCreateForm from './pages/Event/EventCreateForm';
import EventRegisterForm from './pages/Event/EventRegisterForm';
import EventParticipants from './pages/Event/EventParticipants';
import EventsList from './dashboards/Admin/Events';
import EventManager from './pages/Event/EventManager';
import EventCreateNotification from './pages/Event/EventCreateNotification';
import EventEditForm from './pages/Event/EventEditForm';
import DashboardOwner from './dashboards/FishingOwner/DashboardOwner';
import OrderHistory from './pages/Shop/Cart/orderHistory';
import Cart from './pages/Shop/Cart/cart';
import OrderAdmin from './dashboards/Admin/Orders';
import  RegisteredEvents from './pages/Event/RegisteredEvents'


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
            <Route path="managerevent" element={<EventsList />} />
            <Route path="orders" element={<OrderAdmin />} />
          </Route>
          
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
                  <Route path="/knowledge" element={<KnowLedgePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<ProfilePage />} />
                   <Route path="/eventform" element={<EventCreateForm />} />
                  <Route path="/eventregister/:id" element={<EventRegisterForm />} />
                   <Route path="/eventsmanager" element={<EventManager />} />
                  <Route path="/eventcreatenotification" element={<EventCreateNotification />} />
                  <Route path="/dashboardowner" element={<DashboardOwner />} />
                  <Route path="/eventedit/:id" element={<EventEditForm />} />
                  <Route path="/events/:id/participants" element={<EventParticipants />} />
                   <Route path="/cart" element={<Cart />} />
                  <Route path="/orderHistory" element={<OrderHistory />} />
                  <Route path="/registeredevents" element={<RegisteredEvents />} />
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