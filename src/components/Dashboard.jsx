import React, { useEffect, useState, useRef } from "react";
import { Button, Container, ListGroup, Form } from "react-bootstrap";
import axios from "axios";
import { io } from "socket.io-client";

const Dashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [users, setUsers] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        console.log("Notification permission:", permission);
      });
    }

    socketRef.current = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket"],
      auth: {
        token: localStorage.getItem("token")
      }
    });

    const userId = localStorage.getItem("userId");
    if (userId) {
      socketRef.current.emit("join", userId);
    }

    socketRef.current.on("new_notification", (newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
      
      setUnreadCount(prev => prev + 1);
      
      
      if (Notification.permission === "granted") {
        const sender = users.find(u => u.id === newNotification.senderId)?.username || newNotification.senderId;
        new Notification(`New message from ${sender}`, {
          body: newNotification.message,
          icon: "/logo.png",
          vibrate: [200, 100, 200],
        });
      }
    });

    fetchUsers();
    fetchNotifications();

    return () => {
      if (socketRef.current) {
        socketRef.current.off("new_notification");
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    document.title = unreadCount > 0 
      ? `(${unreadCount}) My App` 
      : "My App";
  }, [unreadCount]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/users/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const sendNotification = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      await axios.post(
        "http://localhost:5000/api/notifications/send",
        { senderId: userId, receiverId, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("");
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, isread: true } : n
      ));
      
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === id);
        return notification && !notification.isread ? prev - 1 : prev;
      });
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Dashboard</h2>
      <div className="mb-4">
        <h4>Send Notification</h4>
        <Form.Select 
          className="mb-2"
          onChange={(e) => setReceiverId(e.target.value)}
          value={receiverId}
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </Form.Select>
        <Form.Control
          type="text"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mb-2"
        />
        <Button 
          variant="primary" 
          onClick={sendNotification}
          disabled={!receiverId || !message}
        >
          Send
        </Button>
      </div>

      <h4 className="mt-5">
        Notifications
        {unreadCount > 0 && (
          <span className="badge bg-danger ms-2">{unreadCount}</span>
        )}
      </h4>
      <ListGroup>
        {notifications.map((notification) => (
          <ListGroup.Item 
            key={notification.id}
            className={notification.isread ? "" : "fw-bold"}
          >
            <div className="d-flex justify-content-between">
              <div>
                <p className="mb-1">
                  <strong>From:</strong> {users.find(u => u.id === notification.senderId)?.username || notification.senderId}
                </p>
                <p className="mb-1">{notification.message}</p>
                <small className="text-muted">
                  {new Date(notification.created_at).toLocaleString()}
                </small>
              </div>
              {!notification.isread && (
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as Read
                </Button>
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default Dashboard;