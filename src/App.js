import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/HomePage';
import NewFeed from './pages/NewFeed/NewFeedPage';
import Event from './pages/Event/EventPage';
import Shop from './pages/Shop/ShopPage';
import Knowledge from './pages/Knowledge/KnowledgePage';
import EventCreateForm from './pages/Event/EventCreateForm';
import EventRegisterForm from './pages/Event/EventRegisterForm';
import EventManager from './pages/Event/EventManager';
import EventCreateNotification from './pages/Event/EventCreateNotification';
import Login from './pages/Auth/Login';
import DashboardOwner from './dashboards/FishingOwner/DashboardOwner';
import EventEditForm from './pages/Event/EventEditForm';
import EventParticipants from './pages/Event/EventParticipants'; // Import component

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/newfeed" element={<NewFeed />} />
        <Route path="/event" element={<Event />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="/login" element={<Login />} />
        <Route path="/eventform" element={<EventCreateForm />} />
        <Route path="/eventregister/:id" element={<EventRegisterForm />} />
        <Route path="/eventsmanager" element={<EventManager />} />
        <Route path="/eventcreatenotification" element={<EventCreateNotification />} />
        <Route path="/dashboardowner" element={<DashboardOwner />} />
        <Route path="/eventedit/:id" element={<EventEditForm />} />
        <Route path="/events/:id/participants" element={<EventParticipants />} /> {/* New route */}

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
