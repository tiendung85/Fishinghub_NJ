import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Routes, Route , BrowserRouter} from 'react-router-dom';
import Home from './pages/Home/HomePage';
import NewFeed from './pages/NewFeed/NewFeedPage';
import Event from './pages/Event/EventPage';
import Shop from './pages/Shop/ShopPage';
import Knowledge from './pages/Knowledge/KnowledgePage';
import Login from './pages/Auth/Login';

function App() {
  return (

    <BrowserRouter>
     <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/newfeed" element={<NewFeed />} />
        <Route path="/event" element={<Event />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
