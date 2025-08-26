import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminMessagesAndSubscribers.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminMessagesAndSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [subsRes, msgsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/messages`),
          axios.get(`${API_BASE_URL}/api/subscribers`),
        ]);

        setSubscribers(Array.isArray(subsRes.data) ? subsRes.data : []);
        setMessages(Array.isArray(msgsRes.data) ? msgsRes.data : []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div className="admin-section">⏳ Inapakia...</div>;

  return (
    <div className="admin-section">
      <h2>📬 Jumbe kutoka kwa Wateja</h2>
      <div className="card-container">
        {messages.length === 0 ? (
          <p>Hakuna ujumbe bado.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="card message-card">
              <h4>{msg.name} <span className="email">({msg.email})</span></h4>
              <p className="timestamp">{new Date(msg.date_sent).toLocaleString()}</p>
              <p><strong>{msg.subject}</strong></p>
              <p>{msg.content}</p>
            </div>
          ))
        )}
      </div>

      <h2>👥 Wateja Waliosubscribe</h2>
      <div className="card-container">
        <p>Jumla ya Subscribers: <strong>{subscribers.length}</strong></p>
        {subscribers.length === 0 ? (
          <p>Hakuna aliyejiunga bado.</p>
        ) : (
          <ul className="subscriber-list">
            {subscribers.map((sub) => (
              <li key={sub.id}>
                <span className="subscriber-email">{sub.email}</span>
                <span className="subscriber-date">
                  {new Date(sub.subscribed_on).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
