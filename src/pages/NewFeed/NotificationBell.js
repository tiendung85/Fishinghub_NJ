import React, { useEffect, useState, useRef } from "react";
import { Dropdown, Badge, ListGroup, Spinner } from "react-bootstrap";
import { RiNotification3Line, RiNotification3Fill } from "react-icons/ri";

const API_URL = "http://localhost:9999";

function NotificationBell({ currentUser }) {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef();

  // Lấy thông báo cho user
  const fetchNotifications = async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    const res = await fetch(`${API_URL}/notifications?userId=${currentUser.id}&_sort=createdAt&_order=desc`);
    const data = await res.json();
    setNotifications(data);
    setUnread(data.filter(n => !n.read).length);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
    
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [currentUser?.id]);

 
  const handleToggle = async (isOpen) => {
    if (isOpen && unread > 0) {
      
      await Promise.all(
        notifications.filter(n => !n.read).map(n =>
          fetch(`${API_URL}/notifications/${n.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ read: true }),
          })
        )
      );
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnread(0);
    }
  };

  return (
    <Dropdown align="end" onToggle={handleToggle} ref={dropdownRef}>
      <Dropdown.Toggle
        variant="link"
        className="position-relative p-0 border-0"
        style={{ fontSize: 24, color: unread > 0 ? "#e74c3c" : "#3989CE", verticalAlign: "middle" }}
      >
        {unread > 0 ? <RiNotification3Fill /> : <RiNotification3Line />}
        {unread > 0 && (
          <span className="notif-badge">{unread}</span>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu style={{ minWidth: 320, maxHeight: 400, overflowY: "auto" }}>
        <Dropdown.Header>Thông báo</Dropdown.Header>
        {loading ? (
          <div className="text-center py-3"><Spinner size="sm" /></div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-muted py-3">Không có thông báo mới.</div>
        ) : (
          <ListGroup variant="flush">
            {notifications.map((n) => (
              <ListGroup.Item
                key={n.id}
                className={n.read ? "bg-light" : "bg-white fw-semibold"}
                style={{ cursor: "pointer", fontSize: 14 }}
              >
                <div>{n.content}</div>
                <div className="text-muted" style={{ fontSize: 12 }}>
                  {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default NotificationBell;