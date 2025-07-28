import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const API_URL = "http://localhost:9999";

const EditCommentForm = ({ comment, onSave, onCancel }) => {
  const [content, setContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch(`${API_URL}/postComments/${comment.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setLoading(false);
    if (onSave) onSave();
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-2">
      <Form.Group>
        <Form.Control
          as="textarea"
          rows={2}
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={loading}
        />
      </Form.Group>
      <div className="mt-2 d-flex gap-2 justify-content-end">
        <Button variant="secondary" size="sm" onClick={onCancel} disabled={loading}>
          Hủy
        </Button>
        <Button type="submit" variant="primary" size="sm" disabled={loading || !content.trim()}>
          Lưu
        </Button>
      </div>
    </Form>
  );
};

export default EditCommentForm;