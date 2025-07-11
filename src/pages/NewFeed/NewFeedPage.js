import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import {
  RiArrowRightSLine,
  RiAddLine,
} from "react-icons/ri";
import PostCard from "./PostCard";
import CreatePostForm from "./CreatePostForm";
import { useAuth } from "../Auth/AuthContext";

const API_URL = "http://localhost:9999";


const getAllPosts = async () => {
  const res = await fetch(`${API_URL}/posts?status=Đã duyệt`);
  return res.json();
};

const getSavedPosts = async (userId) => {
  const res = await fetch(`${API_URL}/savedPosts?userId=${userId}`);
  const saved = await res.json();
  if (!saved.length) return [];
  const postIds = saved.map((s) => s.postId);
  const postsRes = await fetch(
    `${API_URL}/posts?${postIds.map((id) => `id=${id}`).join("&")}&status=Đã duyệt`
  );
  return postsRes.json();
};

const getMyPosts = async (userId) => {
  const res = await fetch(`${API_URL}/posts?userId=${userId}`);
  const all = await res.json();
  return all.filter(post => post.status === "Đã duyệt");
};

const searchPostsByTopic = async (topic) => {
  const res = await fetch(
    `${API_URL}/posts?topic_like=${encodeURIComponent(topic.toLowerCase())}&status=Đã duyệt`
  );
  const data = await res.json();
  return data.filter(post => post.topic.toLowerCase().includes(topic.toLowerCase()));
};



const NewFeedPage = () => {
  const { user: currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [searchTopic, setSearchTopic] = useState("");
  const [searchInput, setSearchInput] = useState(""); 
  const [tab, setTab] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchPosts = useCallback(async () => {
    let result;
    if (tab === "saved" && currentUser) {
      result = await getSavedPosts(currentUser.id); 
    } else if (tab === "my" && currentUser) {
      result = await getMyPosts(currentUser.id); 
    } else if (searchTopic.trim() !== "") {
      result = await searchPostsByTopic(searchTopic);
    } else {
      result = await getAllPosts();
    }
    setPosts(result);
  }, [tab, currentUser, searchTopic]);

  useEffect(() => {
    fetchPosts();
  }, [searchTopic, tab, fetchPosts]);

  useEffect(() => {
    setSearchInput("");
    setSearchTopic("");
  }, [tab]);



  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-bottom">
        <Container className="py-3" style={{ marginTop: "80px" }}>
          <div className="d-flex align-items-center text-muted">
            <a href="/" className="text-muted text-decoration-none">
              Trang Chủ
            </a>
            <RiArrowRightSLine className="mx-2" />
            <span className="text-primary fw-semibold">Bảng Tin</span>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-4">
       <Row className="mb-4 align-items-center">
  <Col md={8}>
    <h1 className="h3 fw-bold">Bảng Tin Cộng Đồng</h1>
    <p className="text-muted">
      Chia sẻ kinh nghiệm, tin tức và thảo luận về câu cá
    </p>
  </Col>
  <Col md={4}>
    <div className="d-flex gap-2">
      {/* Form tìm kiếm */}
      <Form
        className="d-flex flex-grow-1"
        onSubmit={(e) => {
          e.preventDefault();
          setSearchTopic(searchInput);
        }}
      >
        <Form.Control
          type="text"
          placeholder="Tìm kiếm bài viết theo chủ đề..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        
      </Form>

      {/* Nút tạo bài viết mới */}
      <Button
        variant="success"
        onClick={() => setShowCreateForm(true)}
        className="d-flex align-items-center"
        style={{ whiteSpace: "nowrap" }}
      >
        <RiAddLine /> Tạo Bài Viết Mới
      </Button>
    </div>
  </Col>
</Row>


        <div className="bg-white rounded shadow-sm mb-4 p-2 d-flex gap-2">
          <Button
            variant={tab === "all" ? "primary" : "light"}
            onClick={() => setTab("all")}
          >
            Tất Cả Bài Viết
          </Button>
          <Button
            variant={tab === "saved" ? "primary" : "light"}
            onClick={() => setTab("saved")}
          >
            Đã Lưu
          </Button>
          <Button
            variant={tab === "my" ? "primary" : "light"}
            onClick={() => setTab("my")}
          >
            Bài Viết Của Tôi
          </Button>
        </div>

        {/* Posts List */}
        <div className="d-flex flex-column gap-4">
          {posts.length === 0 ? (
            <p className="text-center text-muted">Không có bài viết nào.</p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={ post.id}
                post={post}
                currentUser={currentUser}
                refreshPosts={fetchPosts}
              />
            ))
          )}
        </div>

        {showCreateForm && (
          <Modal show={showCreateForm} onHide={() => setShowCreateForm(false)} centered>
            <Modal.Body>
              <CreatePostForm
                currentUser={currentUser}
                onPostCreated={() => {
                  setShowCreateForm(false);
                  fetchPosts();
                }}
                onCancel={() => setShowCreateForm(false)}
              />
            </Modal.Body>
          </Modal>
        )}
      </Container>
    </div>
  );
};

export default NewFeedPage;
