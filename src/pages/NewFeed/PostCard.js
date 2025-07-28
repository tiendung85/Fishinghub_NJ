import React, { useEffect, useState } from "react";
import { Card, Image, Modal, Form, Button } from "react-bootstrap";
import { RiHeartLine, RiHeartFill, RiChat3Line } from "react-icons/ri";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import EditPostForm from "./EditPostForm";
import EditCommentForm from "./EditCommentForm";
import DeletePostButton from "./DeletePostButton";
import DeleteCommentButton from "./DeleteCommentButton";
import SavePostButton from "./SavePostButton";

const API_URL = "http://localhost:9999";

const getUserById = async (userId) => {
  const res = await fetch(`${API_URL}/users?id=${encodeURIComponent(userId)}`);
  const users = await res.json();
  return users[0];
};

const getImageByPostId = async (postId) => {
  const res = await fetch(`${API_URL}/images?postId=${postId}`);
  const images = await res.json();
  return images[0]?.imagePath
    ? `${API_URL}/images/${images[0].imagePath}`
    : null;
};

const getVideoByPostId = async (postId) => {
  const res = await fetch(`${API_URL}/videos?postId=${postId}`);
  const videos = await res.json();
  return videos[0]?.videoPath
    ? process.env.PUBLIC_URL + "/videos/" + videos[0].videoPath
    : null;
};

const PostCard = ({ post, currentUser, refreshPosts }) => {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentUsers, setCommentUsers] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);

  useEffect(() => {
    if (!post) return;

    getUserById(post.userId).then(setUser);
    getImageByPostId(post.id).then(setImage);
    getVideoByPostId(post.id).then(setVideo);

    fetch(`${API_URL}/postLikes?postId=${post.id}`)
      .then((res) => res.json())
      .then((likes) => {
        setLikeCount(likes.length);
        if (currentUser?.id) {
          setLiked(likes.some((like) => String(like.userId) === String(currentUser.id)));
        } else {
          setLiked(false);
        }
      });

    fetch(`${API_URL}/postComments?postId=${post.id}`)
      .then((res) => res.json())
      .then(async (comments) => {
        setCommentCount(comments.length);
        setComments(comments);

        const userIds = [...new Set(comments.map(c => c.userId))];
        const userMap = {};
        await Promise.all(
          userIds.map(async (uid) => {
            const u = await getUserById(uid);
            if (u) userMap[uid] = u;
          })
        );
        setCommentUsers(userMap);
      });
  }, [post, currentUser?.id]);

  const handleLike = async () => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để thích bài viết.");
      return;
    }
    if (!liked) {
      await fetch(`${API_URL}/postLikes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id, userId: currentUser.id }),
      });
      setLikeCount((c) => c + 1);
      setLiked(true);

      await fetch(`${API_URL}/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: post.userId,
          type: "like",
          postId: post.id,
          fromUserId: currentUser.id,
          content: `${currentUser.username} đã thích bài viết của bạn.`,
          createdAt: new Date().toISOString(),
          read: false
        }),
      });
    } else {
      const res = await fetch(`${API_URL}/postLikes?postId=${post.id}&userId=${currentUser.id}`);
      const likes = await res.json();
      const likeToDelete = likes.find((like) => String(like.userId) === String(currentUser.id));
      if (likeToDelete) {
        await fetch(`${API_URL}/postLikes/${likeToDelete.id}`, { method: "DELETE" });
        setLikeCount((c) => c - 1);
        setLiked(false);
      }
    }
    if (refreshPosts) refreshPosts();
  };

  const handleComment = () => {
    setShowCommentBox((v) => !v);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Vui lòng đăng nhập để bình luận.");
      return;
    }
    if (!commentText.trim()) return;
    await fetch(`${API_URL}/postComments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: post.id,
        userId: currentUser.id,
        content: commentText,
        createdAt: new Date().toISOString(),
      }),
    });
    setCommentText("");
    setShowCommentBox(false);

    if (currentUser.id !== post.userId) {
      await fetch(`${API_URL}/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: post.userId,
          type: "comment",
          postId: post.id,
          fromUserId: currentUser.id,
          content: `${currentUser.username} đã bình luận bài viết của bạn.`,
          createdAt: new Date().toISOString(),
          read: false
        }),
      });
    }

    if (refreshPosts) refreshPosts();
    fetch(`${API_URL}/postComments?postId=${post.id}`)
      .then((res) => res.json())
      .then((comments) => {
        setCommentCount(comments.length);
        setComments(comments);
      });
  };

  const handleSaveEdit = () => {
    setShowEdit(false);
    if (refreshPosts) refreshPosts();
  };

  const handleCancelEdit = () => {
    setShowEdit(false);
  };

  return (
    <>
      <Card
        className="shadow-sm mx-auto"
        style={{
          width: "100%",
          maxWidth: 736,
          borderRadius: 18,
          border: "1px solid #e3e6ea",
          boxShadow: "0 2px 8px 0 rgba(60,60,60,0.04)",
          background: "#fcfcfd",
          overflowY: "auto",
        }}
      >
        <Card.Body style={{ padding: "1.1rem 1.2rem" }}>
          <div className="d-flex align-items-center mb-2">
            <Image
              src={
                user?.avatar ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(user?.username || "User")
              }
              roundedCircle
              width={36}
              height={36}
              alt="avatar"
              className="me-2"
              style={{ border: "1px solid #e3e6ea", background: "#fff" }}
            />
            <div>
              <div className="fw-semibold" style={{ fontSize: 15 }}>
                {user?.username || "Người dùng"}
              </div>
              <div className="text-muted" style={{ fontSize: 12 }}>
                {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
              </div>
            </div>
            {currentUser?.id === post.userId && (
              <>
                <Button
                  variant="link"
                  size="sm"
                  className="ms-auto me-2 p-0"
                  onClick={() => setShowEdit(true)}
                  title="Sửa bài viết"
                  style={{ color: "#6c757d" }}
                >
                  <FaEdit size={12} />
                </Button>
                <DeletePostButton postId={post.id} onDeleted={refreshPosts} />
              </>
            )}
          </div>
          {showEdit ? (
            <EditPostForm
              post={post}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          ) : (
            <>
              <div
                className="mb-1 text-primary"
                style={{ fontWeight: 500, fontSize: 14 }}
              >
                {post.topic}
              </div>
              <div className="mb-1 h6" style={{ fontWeight: 600 }}>
                {post.title}
              </div>
              <div className="mb-2" style={{ fontSize: 14 }}>
                {post.content}
              </div>
              {(image || video) && (
                <div className="mb-2 d-flex gap-2" style={{ alignItems: "center" }}>
                  {image && (
                    <Image
                      src={image}
                      alt="post"
                      fluid
                      rounded
                      style={{
                        maxHeight: 180,
                        maxWidth: "50%",
                        objectFit: "cover",
                        flex: 1,
                        cursor: "pointer",
                      }}
                      onClick={() => setShowModal(true)}
                    />
                  )}
                  {video && (
                    <div style={{ flex: 1, maxWidth: "50%" }}>
                      <video
                        src={video}
                        controls
                        style={{
                          borderRadius: 12,
                          width: "100%",
                          maxHeight: 180,
                          display: "block",
                          background: "#000"
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="d-flex align-items-center gap-3 mt-2">
                <span
                  className="d-flex align-items-center"
                  style={{
                    cursor: "pointer",
                    fontSize: 14,
                    color: liked ? "#e74c3c" : "#6c757d",
                    fontWeight: liked ? 600 : 400,
                  }}
                  onClick={handleLike}
                >
                  {liked ? (
                    <RiHeartFill className="me-1" style={{ color: "#e74c3c" }} />
                  ) : (
                    <RiHeartLine className="me-1" />
                  )}
                  {likeCount} Thích
                </span>
                <span
                  className="d-flex align-items-center text-muted"
                  style={{ cursor: "pointer", fontSize: 14 }}
                  onClick={handleComment}
                >
                  <RiChat3Line className="me-1" /> {commentCount} Bình luận
                </span>
                <SavePostButton
                  postId={post.id}
                  currentUser={currentUser}
                  refreshPosts={refreshPosts}
                />
              </div>
              {showCommentBox && (
                <Form className="mt-3" onSubmit={handleCommentSubmit}>
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Nhập bình luận..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      disabled={!currentUser}
                    />
                  </Form.Group>
                  <div className="mt-2 d-flex justify-content-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowCommentBox(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={!commentText.trim()}
                    >
                      Gửi
                    </Button>
                  </div>
                </Form>
              )}
              {comments.length > 0 && (
                <div className="mt-3">
                  {comments.map((cmt) => (
                    <div key={cmt.id} className="mb-2 border-bottom pb-2">
                      <div style={{ fontWeight: 500, fontSize: 13 }}>
                        {commentUsers[cmt.userId]?.username || "Người dùng"}
                        <span className="text-muted ms-2" style={{ fontSize: 12 }}>
                          {cmt.createdAt ? new Date(cmt.createdAt).toLocaleString() : ""}
                        </span>
                        {(currentUser?.id === cmt.userId || currentUser?.id === post.userId) && (
                          <>
                            <DeleteCommentButton
                              commentId={cmt.id}
                              onDeleted={refreshPosts}
                            />
                            {currentUser?.id === cmt.userId && (
                              <Button
                                variant="link"
                                size="sm"
                                className="ms-2 p-0"
                                onClick={() => setEditingCommentId(cmt.id)}
                                title="Sửa bình luận"
                                style={{ color: "#6c757d" }}
                              >
                                <FaEdit size={12} />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                      <div style={{ fontSize: 14 }}>
                        {editingCommentId === cmt.id ? (
                          <EditCommentForm
                            comment={cmt}
                            onSave={() => {
                              setEditingCommentId(null);
                              if (refreshPosts) refreshPosts();
                            }}
                            onCancel={() => setEditingCommentId(null)}
                          />
                        ) : (
                          cmt.content
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Body
          className="p-0 d-flex justify-content-center align-items-center"
          style={{ background: "#222" }}
        >
          <Image
            src={image}
            alt="post-large"
            fluid
            style={{ maxHeight: "80vh", maxWidth: "100%" }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PostCard;