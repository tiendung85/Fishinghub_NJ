import React, { useEffect, useState } from "react";
import { RiBookmarkLine, RiBookmarkFill } from "react-icons/ri";

const API_URL = "http://localhost:9999";

const SavePostButton = ({ postId, currentUser, refreshPosts }) => {
  const [saved, setSaved] = useState(false);
  const [saveId, setSaveId] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setSaved(false);
      setSaveId(null);
      return;
    }
    fetch(`${API_URL}/savedPosts?userId=${currentUser.id}&postId=${postId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setSaved(true);
          setSaveId(data[0].id);
        } else {
          setSaved(false);
          setSaveId(null);
        }
      });
  }, [postId, currentUser]);

  const handleSave = async () => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để lưu bài viết.");
      return;
    }
    if (!saved) {
      // Lưu bài viết
      await fetch(`${API_URL}/savedPosts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          postId,
          savedAt: new Date().toISOString(),
        }),
      });
    } else if (saveId) {
      // Bỏ lưu bài viết
      await fetch(`${API_URL}/savedPosts/${saveId}`, { method: "DELETE" });
    }
    // Luôn reload trạng thái lưu sau khi thao tác
    fetch(`${API_URL}/savedPosts?userId=${currentUser.id}&postId=${postId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setSaved(true);
          setSaveId(data[0].id);
        } else {
          setSaved(false);
          setSaveId(null);
        }
      });
    if (refreshPosts) refreshPosts();
  };

  return (
    <span
      title={saved ? "Bỏ lưu bài viết" : "Lưu bài viết"}
      style={{ cursor: "pointer", fontSize: 20, color: saved ? "#f7b731" : "#6c757d" }}
      onClick={handleSave}
      className="ms-2"
    >
      {saved ? <RiBookmarkFill /> : <RiBookmarkLine />}
    </span>
  );
};

export default SavePostButton;