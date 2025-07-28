import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";

const API_URL = "http://localhost:9999";

const DeleteCommentButton = ({ commentId, onDeleted }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await fetch(`${API_URL}/postComments/${commentId}`, { method: "DELETE" });
    setLoading(false);
    setShowConfirm(false);
    if (onDeleted) onDeleted();
  };

  return (
    <>
      <Button
        variant="link"
        size="sm"
        className="ms-2 p-0"
        onClick={() => setShowConfirm(true)}
        title="Xóa bình luận"
        style={{ color: "#6c757d" }}
      >
        <FaTrashAlt size={12} />
      </Button>
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa bình luận</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa bình luận này không?</Modal.Body>
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

export default DeleteCommentButton;