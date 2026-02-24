import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatMessage.css';

function ChatMessage({ message }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`chat-message ${message.role}`}>
      <div className="message-header">
        <span className="message-role">
          {message.role === 'user' ? '👤 You' : '🤖 AI'}
        </span>
        <span className="message-time">{formatTime(message.timestamp)}</span>
      </div>
      <div className="message-content">
        {message.role === 'assistant' ? (
          <ReactMarkdown>{message.content}</ReactMarkdown>
        ) : (
          <p>{message.content}</p>
        )}
      </div>
      {message.role === 'assistant' && (
        <button 
          className="copy-button"
          onClick={copyToClipboard}
          title="Copy message"
        >
          {copied ? '✓ Copied' : '📋 Copy'}
        </button>
      )}
    </div>
  );
}

export default ChatMessage;
