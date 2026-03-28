"use client";

import { useEffect, useState } from "react";

const MAX_MESSAGE_LENGTH = 500;

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("hu-HU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export default function HomePage() {
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  async function loadMessages() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/messages", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Nem sikerult betolteni az uzeneteket.");
      }

      setMessages(payload.data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError("Ures uzenet nem mentheto.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: trimmedContent })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "A mentes sikertelen volt.");
      }

      setContent("");
      await loadMessages();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: "DELETE"
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "A torles sikertelen volt.");
      }

      await loadMessages();
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="page-shell">
      <section className="board-card">
        <div className="hero">
          <p className="eyebrow">Publikus message board</p>
          <h1>Uzenofal</h1>
          <p className="lead">
            Rogzits egy rovid uzenetet, majd nezd meg a legfrissebb bejegyzeseket.
          </p>
        </div>

        <form className="composer" onSubmit={handleSubmit}>
          <label className="label" htmlFor="message">
            Uzenet
          </label>
          <textarea
            id="message"
            name="message"
            rows="4"
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder="Irj be egy uzenetet..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
            disabled={isSaving}
          />
          <div className="form-footer">
            <span className="hint">
              {content.trim().length}/{MAX_MESSAGE_LENGTH} karakter
            </span>
            <button type="submit" disabled={isSaving || !content.trim()}>
              {isSaving ? "Mentes..." : "Mentes"}
            </button>
          </div>
        </form>

        {error ? <p className="status error">{error}</p> : null}

        <section className="messages-section">
          <div className="messages-header">
            <h2>Korabbi uzenetek</h2>
            <button
              type="button"
              className="secondary-button"
              onClick={loadMessages}
              disabled={isLoading}
            >
              {isLoading ? "Betoltes..." : "Frissites"}
            </button>
          </div>

          {isLoading ? <p className="status">Uzenetek betoltese...</p> : null}

          {!isLoading && messages.length === 0 ? (
            <p className="status">Meg nincs egyetlen bejegyzes sem.</p>
          ) : null}

          {!isLoading && messages.length > 0 ? (
            <ul className="message-list">
              {messages.map((message) => (
                <li key={message.id} className="message-item">
                  <div className="message-copy">
                    <p>{message.content}</p>
                    <time dateTime={message.created_at}>
                      {formatDate(message.created_at)}
                    </time>
                  </div>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => handleDelete(message.id)}
                    disabled={deletingId === message.id}
                  >
                    {deletingId === message.id ? "Torles..." : "Torles"}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </section>
    </main>
  );
}
