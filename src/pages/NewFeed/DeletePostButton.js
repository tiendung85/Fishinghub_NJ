import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";

const API_URL = "http://localhost:9999";

const DeletePostButton = ({ postId, onDeleted }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

const handleDelete = async () => {
  setLoading(true);
  try {
    // Xóa bài viết
    await fetch(`${API_URL}/posts/${postId}`, { method: "DELETE" });

    // Xóa hoặc ngắt liên kết ảnh liên quan
    const imageRes = await fetch(`${API_URL}/images?postId=${postId}`);
    const images = await imageRes.json();
    for (const img of images) {
      await fetch(`${API_URL}/images/${img.id}`, { method: "DELETE" });
     
    }

    // Xóa hoặc ngắt liên kết video liên quan
    const videoRes = await fetch(`${API_URL}/videos?postId=${postId}`);
    const videos = await videoRes.json();
    for (const vid of videos) {
      await fetch(`${API_URL}/videos/${vid.id}`, { method: "DELETE" });
      
    }
  } catch (error) {
    console.error("Lỗi khi xóa bài viết và media:", error);
  }
  setLoading(false);
  setShowConfirm(false);
  if (onDeleted) onDeleted();
};

  return (
    <>
      <Button
        variant="link"
        size="sm"
        className="p-0"
        onClick={() => setShowConfirm(true)}
        title="Xóa bài viết"
        style={{ color: "#6c757d" }}
      >
        <FaTrashAlt size={12} />
      </Button>
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa bài viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa bài viết này không?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? "Đang xóa..." : "Xóa"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeletePostButton;