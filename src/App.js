import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/HomePage';
import NewFeed from './pages/NewFeed/NewFeedPage';
import Event from './pages/Event/EventPage';
import Shop from './pages/Shop/ShopPage';
import Knowledge from './pages/Knowledge/KnowledgePage';


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
        {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
