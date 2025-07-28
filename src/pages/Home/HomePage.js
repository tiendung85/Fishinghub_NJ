import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="main-content">
            {/* Hero Section - Removed py-5 to eliminate gap */}
            <section className="hero-section bg-primary text-white">
                <div className="container">
                    <div className="row align-items-center" style={{ minHeight: '500px' }}>
                        <div className="col-lg-6">
                            <h1 className="display-4 fw-bold mb-4">Chào mừng đến với FishingHub</h1>
                            <p className="lead mb-4">
                                Điểm đến hoàn hảo cho những người đam mê câu cá! Khám phá thế giới câu cá cùng chúng tôi.
                            </p>
                            <div className="d-flex gap-3">
                                <button 
                                    className="btn btn-light btn-lg"
                                    onClick={() => handleNavigation('/login')}
                                >
                                    Đăng nhập ngay
                                </button>
                                <button 
                                    className="btn btn-outline-light btn-lg"
                                    onClick={() => handleNavigation('/register')}
                                >
                                    Đăng kí 
                                </button>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <img 
                                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                                alt="Fishing" 
                                className="img-fluid rounded-3 shadow"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto text-center">
                            <h2 className="display-5 fw-bold mb-4">Về FishingHub</h2>
                            <p className="lead text-muted mb-5">
                                FishingHub là cộng đồng câu cá hàng đầu Việt Nam, nơi kết nối những người yêu thích câu cá 
                                từ khắp mọi miền đất nước. Chúng tôi cung cấp mọi thứ bạn cần để trở thành một câu thủ giỏi.
                            </p>
                        </div>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body text-center p-4">
                                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                                        <i className="bi bi-people-fill fs-4"></i>
                                    </div>
                                    <h5 className="card-title">Cộng đồng lớn</h5>
                                    <p className="card-text text-muted">
                                        Hơn 50,000 thành viên đam mê câu cá trên toàn quốc
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body text-center p-4">
                                    <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                                        <i className="bi bi-trophy-fill fs-4"></i>
                                    </div>
                                    <h5 className="card-title">Chuyên nghiệp</h5>
                                    <p className="card-text text-muted">
                                        Đội ngũ chuyên gia giàu kinh nghiệm hướng dẫn tận tình
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body text-center p-4">
                                    <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                                        <i className="bi bi-star-fill fs-4"></i>
                                    </div>
                                    <h5 className="card-title">Chất lượng</h5>
                                    <p className="card-text text-muted">
                                        Sản phẩm và dịch vụ đạt chuẩn quốc tế
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section py-5 bg-light">
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center mb-5">
                            <h2 className="display-5 fw-bold">Dịch vụ của chúng tôi</h2>
                            <p className="lead text-muted">Khám phá những dịch vụ tuyệt vời mà FishingHub mang đến</p>
                        </div>
                    </div>
                    <div className="row g-4">
                        {/* Shop Section */}
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="row g-0">
                                    <div className="col-md-6">
                                        <img 
                                            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                                            alt="Fishing Equipment" 
                                            className="img-fluid rounded-start h-100 object-fit-cover"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card-body p-4">
                                            <h5 className="card-title text-primary">🛒 Cửa hàng</h5>
                                            <p className="card-text">
                                                Hàng ngàn sản phẩm câu cá chất lượng cao từ các thương hiệu uy tín.
                                            </p>
                                            <ul className="list-unstyled">
                                                <li>• Cần câu chuyên nghiệp</li>
                                                <li>• Mồi câu đa dạng</li>
                                                <li>• Phụ kiện cao cấp</li>
                                            </ul>
                                            <button 
                                                className="btn btn-primary"
                                                onClick={() => handleNavigation('/shop')}
                                            >
                                                Mua sắm ngay
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Knowledge Section */}
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="row g-0">
                                    <div className="col-md-6">
                                        <img 
                                            src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                                            alt="Fishing Knowledge" 
                                            className="img-fluid rounded-start h-100 object-fit-cover"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card-body p-4">
                                            <h5 className="card-title text-success">📚 Kiến thức</h5>
                                            <p className="card-text">
                                                Kho tài liệu phong phú về kỹ thuật câu cá từ cơ bản đến nâng cao.
                                            </p>
                                            <ul className="list-unstyled">
                                                <li>• Hướng dẫn chi tiết</li>
                                                <li>• Video tutorials</li>
                                                <li>• Mẹo hay từ chuyên gia</li>
                                            </ul>
                                            <button 
                                                className="btn btn-success"
                                                onClick={() => handleNavigation('/knowledge')}
                                            >
                                                Học ngay
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* News Section */}
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="row g-0">
                                    <div className="col-md-6">
                                        <img 
                                            src="https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                                            alt="Fishing News" 
                                            className="img-fluid rounded-start h-100 object-fit-cover"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card-body p-4">
                                            <h5 className="card-title text-info">📰 Tin tức</h5>
                                            <p className="card-text">
                                                Cập nhật tin tức mới nhất về thế giới câu cá và cộng đồng.
                                            </p>
                                            <ul className="list-unstyled">
                                                <li>• Tin tức hàng ngày</li>
                                                <li>• Chia sẻ kinh nghiệm</li>
                                                <li>• Thành tích câu thủ</li>
                                            </ul>
                                            <button 
                                                className="btn btn-info"
                                                onClick={() => handleNavigation('/newfeed')}
                                            >
                                                Xem tin tức
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Events Section */}
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="row g-0">
                                    <div className="col-md-6">
                                        <img 
                                            src="https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                                            alt="Fishing Events" 
                                            className="img-fluid rounded-start h-100 object-fit-cover"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card-body p-4">
                                            <h5 className="card-title text-warning">🎉 Sự kiện</h5>
                                            <p className="card-text">
                                                Tham gia các sự kiện câu cá hấp dẫn và giải đấu thú vị.
                                            </p>
                                            <ul className="list-unstyled">
                                                <li>• Giải đấu câu cá</li>
                                                <li>• Workshop kỹ thuật</li>
                                                <li>• Gặp gỡ cộng đồng</li>
                                            </ul>
                                            <button 
                                                className="btn btn-warning"
                                                onClick={() => handleNavigation('/event')}
                                            >
                                                Tham gia ngay
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="stats-section py-5 bg-primary text-white">
                <div className="container">
                    <div className="row text-center">
                        <div className="col-md-3 mb-4">
                            <div className="stat-item">
                                <h2 className="display-4 fw-bold">50K+</h2>
                                <p className="fs-5">Thành viên</p>
                            </div>
                        </div>
                        <div className="col-md-3 mb-4">
                            <div className="stat-item">
                                <h2 className="display-4 fw-bold">1000+</h2>
                                <p className="fs-5">Sản phẩm</p>
                            </div>
                        </div>
                        <div className="col-md-3 mb-4">
                            <div className="stat-item">
                                <h2 className="display-4 fw-bold">500+</h2>
                                <p className="fs-5">Bài viết</p>
                            </div>
                        </div>
                        <div className="col-md-3 mb-4">
                            <div className="stat-item">
                                <h2 className="display-4 fw-bold">100+</h2>
                                <p className="fs-5">Sự kiện</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section py-5 bg-light">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto text-center">
                            <h2 className="display-5 fw-bold mb-4">Sẵn sàng bắt đầu hành trình câu cá?</h2>
                            <p className="lead text-muted mb-4">
                                Tham gia cộng đồng FishingHub ngay hôm nay để khám phá thế giới câu cá tuyệt vời!
                            </p>
                            <div className="d-flex justify-content-center gap-3">
                                <button 
                                    className="btn btn-primary btn-lg"
                                    onClick={() => handleNavigation('/register')}
                                >
                                    Đăng ký ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Add Bootstrap Icons CDN */}
            <link 
                rel="stylesheet" 
                href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
            />
        </div>
    );
}