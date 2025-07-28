import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Badge,
  Spinner,
  OverlayTrigger,
  Tooltip,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import {
  FaTrash,
  FaCheckCircle,
  FaEye,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";

const API_URL = "http://localhost:9999";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailImage, setDetailImage] = useState(null);
  const [detailVideo, setDetailVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/posts`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        const userIds = [...new Set(data.map((p) => p.userId))];
        Promise.all(
          userIds.map((id) =>
            fetch(`${API_URL}/users?id=${id}`).then((res) => res.json())
          )
        ).then((usersArr) => {
          const userMap = {};
          usersArr.forEach((arr) => {
            if (arr[0]) userMap[arr[0].id] = arr[0];
          });
          setUsers(userMap);
          setLoading(false);
        });
      });
  }, []);

  const filteredPosts = posts.filter((post) => {
    const username = users[post.userId]?.username?.toLowerCase() || "";
    const matchName = username.includes(searchTerm.toLowerCase());
    const matchStatus =
      statusFilter === "all" || post.status === statusFilter || (!post.status && statusFilter === "Chờ duyệt");
    return matchName && matchStatus;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      const imgRes = await fetch(`${API_URL}/images?postId=${id}`);
      const imgData = await imgRes.json();
      for (const img of imgData) {
        await fetch(`${API_URL}/images/${img.id}`, { method: "DELETE" });
      }
      const vidRes = await fetch(`${API_URL}/videos?postId=${id}`);
      const vidData = await vidRes.json();
      for (const vid of vidData) {
        await fetch(`${API_URL}/videos/${vid.id}`, { method: "DELETE" });
      }
      await fetch(`${API_URL}/posts/${id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setShowDetail(false);
      setSelectedPost(null);
      setDetailImage(null);
      setDetailVideo(null);
    }
  };

  const handleApprove = async (id) => {
    await fetch(`${API_URL}/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Đã duyệt" })
    });
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Đã duyệt" } : p))
    );
    const post = posts.find((p) => p.id === id);
    if (post) {
      await fetch(`${API_URL}/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: post.userId,
          type: "post_approved",
          postId: post.id,
          content: "Bài viết của bạn đã được duyệt.",
          createdAt: new Date().toISOString(),
          read: false,
        }),
      });
    }
  };

  const handleReject = async (id) => {
    await fetch(`${API_URL}/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Từ chối" })
    });
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Từ chối" } : p))
    );
    const post = posts.find((p) => p.id === id);
    if (post) {
      await fetch(`${API_URL}/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: post.userId,
          type: "post_rejected",
          postId: post.id,
          content: "Bài viết của bạn đã bị từ chối.",
          createdAt: new Date().toISOString(),
          read: false,
        }),
      });
    }
  };

  const handleDetail = async (post) => {
    setSelectedPost(post);
    setShowDetail(true);
    const imgRes = await fetch(`${API_URL}/images?postId=${post.id}`);
    const imgData = await imgRes.json();
    setDetailImage(
      imgData[0]?.imagePath
        ? `${API_URL}/images/${imgData[0].imagePath}`
        : null
    );
    const vidRes = await fetch(`${API_URL}/videos?postId=${post.id}`);
    const vidData = await vidRes.json();
    setDetailVideo(
      vidData[0]?.videoPath
        ? process.env.PUBLIC_URL + "/videos/" + vidData[0].videoPath
        : null
    );
  };

  useEffect(() => {
    if (!showDetail) {
      setDetailImage(null);
      setDetailVideo(null);
    }
  }, [showDetail]);

  const renderStatus = (status) => {
    if (status === "Đã duyệt")
      return <Badge bg="success" className="px-2 py-1"><FaCheckCircle className="mb-1" /> Đã duyệt</Badge>;
    if (status === "Từ chối")
      return <Badge bg="danger" className="px-2 py-1"><FaTimesCircle className="mb-1" /> Từ chối</Badge>;
    return <Badge bg="warning" text="dark" className="px-2 py-1"><FaHourglassHalf className="mb-1" /> Chờ duyệt</Badge>;
  };

  return (
    <div className="main-content" style={{ minHeight: "100vh", padding: "0 24px 24px 24px", marginTop: 0 }}>
      <h2 className="mb-3 fw-bold" style={{ color: "#3989CE", marginTop: 30 }}>Quản lý bài viết</h2>

      {/* Bộ lọc */}
      <Row className="mb-3">
        <Col md={6} className="mb-2">
          <Form.Control
            placeholder="Tìm kiếm theo tên người đăng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={6} className="mb-2">
          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Từ chối">Từ chối</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Bảng bài viết */}
      <div className="rounded shadow-sm bg-white p-3">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Table hover responsive className="align-middle" style={{ borderRadius: 12, overflow: "hidden" }}>
            <thead style={{ background: "#e3f0fa" }}>
              <tr>
                <th>ID</th>
                <th>Chủ đề</th>
                <th>Tên người đăng</th>
                <th>Thời gian đăng</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>{post.topic}</td>
                  <td>{users[post.userId]?.username || post.userId}</td>
                  <td>{post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}</td>
                  <td>{renderStatus(post.status)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button variant="outline-primary" size="sm" onClick={() => handleDetail(post)}><FaEye /></Button>
                      {post.status !== "Đã duyệt" && (
                        <Button variant="outline-success" size="sm" onClick={() => handleApprove(post.id)}><FaCheckCircle /></Button>
                      )}
                      {(!post.status || post.status === "Chờ duyệt") && (
                        <Button variant="outline-warning" size="sm" onClick={() => handleReject(post.id)}><FaTimesCircle /></Button>
                      )}
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(post.id)}><FaTrash /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

     {/* Modal xem chi tiết */}
      <Modal
        show={showDetail}
        onHide={() => setShowDetail(false)}
        centered
        dialogClassName="custom-detail-modal"
      >
        <Modal.Header closeButton style={{ borderBottom: "none", background: "#f3f6fa" }}>
          <Modal.Title style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FaEye className="mb-1 me-2 text-primary" />
            <span style={{ fontWeight: 700, fontSize: 20 }}>Chi tiết bài viết</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "#f8fafc", borderRadius: 16 }}>
          {selectedPost && (
            <div className="detail-content">
              <div className="mb-3">
                <span className="fw-bold text-secondary">ID:</span> {selectedPost.id}
              </div>
              <div className="mb-2">
                <span className="fw-bold text-secondary">Chủ đề:</span> {selectedPost.topic}
              </div>
              <div className="mb-2">
                <span className="fw-bold text-secondary">Tiêu đề:</span> {selectedPost.title}
              </div>
              <div className="mb-2">
                <span className="fw-bold text-secondary">Nội dung:</span>
                <div className="p-2 rounded" style={{ background: "#fff", minHeight: 40 }}>
                  {selectedPost.content}
                </div>
              </div>
              <div className="mb-2">
                <span className="fw-bold text-secondary">Người đăng:</span>{" "}
                {users[selectedPost.userId]?.username || selectedPost.userId}
              </div>
              <div className="mb-2">
                <span className="fw-bold text-secondary">Thời gian đăng:</span>{" "}
                {selectedPost.createdAt
                  ? new Date(selectedPost.createdAt).toLocaleString()
                  : ""}
              </div>
              <div className="mb-2">
                <span className="fw-bold text-secondary">Trạng thái:</span> {renderStatus(selectedPost.status)}
              </div>
              {detailImage && (
                <div className="mb-3">
                  <span className="fw-bold text-secondary">Hình ảnh:</span>
                  <div className="d-flex justify-content-center mt-2">
                    <img
                      src={detailImage}
                      alt="post"
                      style={{
                        width: '100%', // Đổi từ maxWidth: 320 sang width: '100%'
                        maxHeight: 220,
                        borderRadius: 16,
                        boxShadow: "0 4px 16px rgba(60,60,60,0.12)",
                        border: "3px solid #e3f0fa",
                        background: "#fff",
                        transition: "transform 0.3s",
                        objectFit: "cover"
                      }}
                      className="img-fluid hover-zoom"
                    />
                  </div>
                </div>
              )}
              {detailVideo && (
                <div className="mb-2">
                  <span className="fw-bold text-secondary">Video:</span>
                  <div className="d-flex justify-content-center mt-2">
                    <video
                      src={detailVideo}
                      controls
                      style={{
                        width: '100%', // Đổi từ maxWidth: 320 sang width: '100%'
                        maxHeight: 220,
                        borderRadius: 16,
                        background: "#000",
                        boxShadow: "0 4px 16px rgba(60,60,60,0.12)",
                        border: "3px solid #e3f0fa",
                        transition: "transform 0.3s",
                        objectFit: "cover"
                      }}
                      className="hover-zoom"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>

      <style>
        {`
          .custom-detail-modal .modal-content {
            border-radius: 18px;
            box-shadow: 0 8px 32px rgba(60,60,60,0.18);
            animation: fadeInUp 0.35s cubic-bezier(.39,.575,.565,1) both;
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(40px);}
            100% { opacity: 1; transform: translateY(0);}
          }
          .hover-zoom:hover {
            transform: scale(1.04);
            box-shadow: 0 8px 32px rgba(60,60,60,0.22);
          }
          .detail-content {
            font-size: 16px;
            color: #222;
          }
        `}
      </style>
    </div>
  );
}
