import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const EditPostForm = ({ post, onSave, onCancel }) => {
  const [title, setTitle] = useState(post.title);
  const [topic, setTopic] = useState(post.topic);
  const [content, setContent] = useState(post.content);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:9999/posts/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, topic, content }),
    });
    if (onSave) onSave();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Chủ đề</Form.Label>
        <Form.Control value={topic} onChange={e => setTopic(e.target.value)} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Tiêu đề</Form.Label>
        <Form.Control value={title} onChange={e => setTitle(e.target.value)} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Nội dung</Form.Label>
        <Form.Control as="textarea" rows={4} value={content} onChange={e => setContent(e.target.value)} />
      </Form.Group>
      <div className="mt-3 d-flex gap-2 justify-content-end">
        <Button variant="secondary" onClick={onCancel}>Hủy</Button>
        <Button type="submit" variant="primary">Lưu</Button>
      </div>
    </Form>
  );
};

export default EditPostForm;