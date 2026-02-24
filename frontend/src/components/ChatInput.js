import React, { useState, useRef, useEffect } from 'react';
import './ChatInput.css';

function ChatInput({ onSendMessage, disabled }) {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const textareaRef = useRef(null);
  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleFileSelect = (e, type) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      type,
      name: file.name,
      size: file.size,
      preview: type === 'image' ? URL.createObjectURL(file) : null
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
    setShowAttachMenu(false);
  };

  const removeAttachment = (id) => {
    setAttachments(prev => {
      const attachment = prev.find(a => a.id === id);
      if (attachment?.preview) {
        URL.revokeObjectURL(attachment.preview);
      }
      return prev.filter(a => a.id !== id);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((input.trim() || attachments.length > 0) && !disabled) {
      let messageText = input;
      
      if (attachments.length > 0) {
        const attachmentText = attachments.map(a => 
          `[${a.type === 'image' ? '📷 Image' : a.type === 'document' ? '📄 Document' : '🎤 Voice'}: ${a.name}]`
        ).join('\n');
        messageText = attachmentText + (input ? '\n\n' + input : '');
      }
      
      // Pass both message text and attachments
      onSendMessage(messageText, attachments);
      setInput('');
      setAttachments([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceRecord = () => {
    alert('Voice recording feature - would require microphone permissions and recording implementation');
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      {attachments.length > 0 && (
        <div className="attachments-preview">
          {attachments.map(attachment => (
            <div key={attachment.id} className="attachment-item">
              {attachment.type === 'image' && attachment.preview && (
                <img src={attachment.preview} alt={attachment.name} className="attachment-image" />
              )}
              {attachment.type === 'document' && (
                <div className="attachment-document">
                  <span className="doc-icon">📄</span>
                </div>
              )}
              <div className="attachment-info">
                <span className="attachment-name">{attachment.name}</span>
                <span className="attachment-size">{(attachment.size / 1024).toFixed(1)} KB</span>
              </div>
              <button 
                type="button"
                className="remove-attachment"
                onClick={() => removeAttachment(attachment.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="input-container">
        <div className="input-actions">
          <div className="attach-wrapper">
            <button
              type="button"
              className="action-button attach-button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              disabled={disabled}
            >
              📎
            </button>
            
            {showAttachMenu && (
              <div className="attach-menu">
                <button
                  type="button"
                  className="attach-option"
                  onClick={() => {
                    imageInputRef.current?.click();
                    setShowAttachMenu(false);
                  }}
                >
                  <span className="option-icon">📷</span>
                  <span className="option-label">Photos</span>
                </button>
                <button
                  type="button"
                  className="attach-option"
                  onClick={() => {
                    documentInputRef.current?.click();
                    setShowAttachMenu(false);
                  }}
                >
                  <span className="option-icon">📄</span>
                  <span className="option-label">Documents</span>
                </button>
              </div>
            )}
          </div>
          
          <button
            type="button"
            className="action-button voice-button"
            onClick={handleVoiceRecord}
            disabled={disabled}
          >
            🎤
          </button>
        </div>
        
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={disabled}
          rows={1}
        />
        
        <button 
          type="submit" 
          disabled={disabled || (!input.trim() && attachments.length === 0)}
          className="send-button"
        >
          {disabled ? '⏳' : '➤'}
        </button>
      </div>
      
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e, 'image')}
      />
      
      <input
        ref={documentInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e, 'document')}
      />
    </form>
  );
}

export default ChatInput;
