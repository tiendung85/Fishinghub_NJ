import { useEffect, useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

export default function RegisteredEvents() {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setError("Vui lòng đăng nhập để xem sự kiện đã đăng ký.");
      setRegisteredEvents([]);
      return;
    }

    const fetchRegisteredEvents = async () => {
      try {
        
        const registrationsResponse = await fetch(`http://localhost:9999/registrations?userId=${user.id}`);
        if (!registrationsResponse.ok) {
          throw new Error("Không thể lấy danh sách đăng ký.");
        }
        const registrations = await registrationsResponse.json();
        const eventIds = registrations.map(r => r.eventId);

        
        const eventsResponse = await fetch("http://localhost:9999/events");
        if (!eventsResponse.ok) {
          throw new Error("Không thể lấy danh sách sự kiện.");
        }
        const allEvents = await eventsResponse.json();

        
        const filteredEvents = allEvents.filter(
          event => eventIds.includes(event.id) && event.approved === "approved"
        );

        setRegisteredEvents(filteredEvents);
        setError("");
      } catch (err) {
        setError("Lỗi khi tải danh sách sự kiện đã đăng ký. Vui lòng thử lại.");
        setRegisteredEvents([]);
      }
    };

    fetchRegisteredEvents();
  }, [user]);

  return (
    <Container fluid className="main-content pb-5">
      <Container>
        <Row>
          <Col>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/" className="text-decoration-none">Trang chủ</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/events" className="text-decoration-none">Sự kiện nổi bật</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Sự kiện đã đăng ký
                </li>
              </ol>
            </nav>
          </Col>
        </Row>
        <Row className="mb-4">
          <main>
            <div>
              <Row className="align-items-center mb-4">
                <Col xs={12}>
                  <h1 className="mb-2">Sự kiện đã đăng ký</h1>
                  <p className="mb-0">
                    Danh sách các sự kiện bạn đã đăng ký tham gia
                  </p>
                </Col>
              </Row>
              {error && <Alert variant="danger">{error}</Alert>}
              {registeredEvents.length === 0 && !error && (
                <Alert variant="info">Bạn chưa đăng ký sự kiện nào.</Alert>
              )}
              <Row className="g-4 mb-4">
                {registeredEvents.map((event, idx) => (
                  <Col md={4} sm={6} xs={12} key={event.id || idx}>
                    <div className="card h-100 shadow-sm rounded-4">
                      <img
                        src={event.image}
                        className="card-img-top"
                        alt={event.title}
                        style={{
                          height: 200,
                          objectFit: "cover",
                          borderRadius: "16px 16px 0 0"
                        }}
                      />
                      <div className="card-body">
                        <div className="d-flex justify-content-between mb-2">
                          <span className="badge bg-info">{event.status}</span>
                          <span>
                            {new Date(event.startDate).toLocaleDateString("vi-VN")} - {new Date(event.endDate).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <h5 className="card-title">{event.title}</h5>
                        <div
                          className="text-muted"
                          style={{
                            fontSize: 15,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
                          }}
                        >
                          {event.description}
                        </div>
                        <div className="d-flex justify-content-between small text-muted mb-2">
                          <span><i className="ri-map-pin-line"></i> {event.location}</span>
                          <span><i className="ri-user-line"></i> {event.participants}/{event.maxParticipants}</span>
                        </div>
                        <Link
                          to={`/eventregister/${event.id}`}
                          className="btn btn-danger w-100"
                        >
                          Hủy đăng ký
                        </Link>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </main>
        </Row>
      </Container>
    </Container>
  );
}