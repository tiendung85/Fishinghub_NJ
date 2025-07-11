import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../Auth/AuthContext";

const API_URL = "http://localhost:9999";

const CreatePostForm = ({ onPostCreated, onCancel }) => {
  const { user: currentUser } = useAuth();
  const [newPost, setNewPost] = useState({
    topic: "",
    title: "",
    content: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [error, setError] = useState("");

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setError("");
    if (!currentUser) {
      setError("Bạn cần đăng nhập để tạo bài viết.");
      return;
    }
    if (!newPost.topic || !newPost.title || !newPost.content) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    
    const postData = {
      userId: currentUser.id || currentUser.userId,
      topic: newPost.topic,
      title: newPost.title,
      content: newPost.content,
      createdAt: new Date().toISOString(),
      status: "Chờ duyệt" // <-- Sửa lại thành "Chờ duyệt"
    };

    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData)
    });
    const createdPost = await response.json();
    const postId = createdPost.id; 

    // Xử lý upload ảnh
    if (imageFile) {
     
      const imagePath = imageFile.name;
      await fetch(`${API_URL}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
    
          postId,      
          imagePath
        })
      });
    }

    // Xử lý upload video
    if (videoFile) {
      const videoPath = videoFile.name; 
      await fetch(`${API_URL}/videos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        
          postId,        
          videoPath
        })
      });
    }

    setNewPost({ topic: "", title: "", content: "" });
    setImageFile(null);
    setVideoFile(null);
    alert("Bài viết của bạn đang được duyệt. Vui lòng chờ admin phê duyệt.");
    if (onPostCreated) onPostCreated();
  };

  return (
    <div className="mb-4">
      <h5 className="mb-3">Tạo bài viết mới</h5>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleCreatePost}>
        <Form.Group className="mb-2">
          <Form.Label>Chủ đề</Form.Label>
          <Form.Control
            value={newPost.topic}
            onChange={e => setNewPost({ ...newPost, topic: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Tiêu đề</Form.Label>
          <Form.Control
            value={newPost.title}
            onChange={e => setNewPost({ ...newPost, title: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Nội dung</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={newPost.content}
            onChange={e => setNewPost({ ...newPost, content: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Ảnh (tùy chọn)</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files[0])}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Video (tùy chọn)</Form.Label>
          <Form.Control
            type="file"
            accept="video/*"
            onChange={e => setVideoFile(e.target.files[0])}
          />
        </Form.Group>
        <div className="d-flex gap-2 mt-2">
          <Button type="submit" variant="success">Đăng bài</Button>
          <Button variant="secondary" onClick={onCancel}>Hủy</Button>
        </div>
      </Form>
    </div>
  );
};

export default CreatePostForm;