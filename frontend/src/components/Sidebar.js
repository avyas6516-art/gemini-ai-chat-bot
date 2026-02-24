import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar({ conversations, currentConversationId, onSelectConversation, onNewConversation, onDeleteConversation, isOpen, onToggle }) {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getConversationTitle = (conversation) => {
    if (conversation.title) return conversation.title;
    if (conversation.messages.length > 0) {
      const firstUserMessage = conversation.messages.find(m => m.role === 'user');
      if (firstUserMessage) {
        return firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '');
      }
    }
    return 'New Conversation';
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (confirmDelete === id) {
      onDeleteConversation(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={onToggle}>
        {isOpen ? '✕' : '☰'}
      </button>
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Chat History</h2>
          <button className="new-chat-btn" onClick={onNewConversation}>
            ✚ New Chat
          </button>
        </div>

        <div className="conversations-list">
          {conversations.length === 0 ? (
            <div className="empty-state">
              <p>No conversations yet</p>
              <p className="hint">Start a new chat to begin!</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`conversation-item ${currentConversationId === conversation.id ? 'active' : ''}`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="conversation-content">
                  <div className="conversation-title">
                    {getConversationTitle(conversation)}
                  </div>
                  <div className="conversation-meta">
                    <span className="message-count">
                      {conversation.messages.length} messages
                    </span>
                    <span className="conversation-date">
                      {formatDate(conversation.updatedAt)}
                    </span>
                  </div>
                </div>
                <button
                  className={`delete-btn ${confirmDelete === conversation.id ? 'confirm' : ''}`}
                  onClick={(e) => handleDelete(e, conversation.id)}
                  title={confirmDelete === conversation.id ? 'Click again to confirm' : 'Delete conversation'}
                >
                  {confirmDelete === conversation.id ? '✓' : '🗑'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      
      {isOpen && <div className="sidebar-overlay" onClick={onToggle}></div>}
    </>
  );
}

export default Sidebar;
