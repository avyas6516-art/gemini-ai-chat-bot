import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import Sidebar from './components/Sidebar';

// API URL from environment variable or fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize conversations from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem('gemini-conversations');
    const savedDarkMode = localStorage.getItem('gemini-dark-mode');
    
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }

    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      setConversations(parsed);
      if (parsed.length > 0) {
        setCurrentConversationId(parsed[0].id);
      } else {
        createNewConversation();
      }
    } else {
      createNewConversation();
    }
  }, []);

  // Save conversations to localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('gemini-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('gemini-dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);

  const createNewConversation = () => {
    const newConversation = {
      id: Date.now(),
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setSidebarOpen(false);
  };

  const deleteConversation = (id) => {
    const updatedConversations = conversations.filter(c => c.id !== id);
    setConversations(updatedConversations);
    
    if (currentConversationId === id) {
      if (updatedConversations.length > 0) {
        setCurrentConversationId(updatedConversations[0].id);
      } else {
        createNewConversation();
      }
    }
  };

  const selectConversation = (id) => {
    setCurrentConversationId(id);
    setSidebarOpen(false);
  };

  const updateConversationMessages = (messages) => {
    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId 
        ? { ...conv, messages, updatedAt: new Date().toISOString() }
        : conv
    ));
  };

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const messages = currentConversation?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText, attachments = []) => {
    if ((!messageText.trim() && attachments.length === 0) || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    updateConversationMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('message', messageText);
      formData.append('conversationHistory', JSON.stringify(messages));
      
      // Add files if any
      attachments.forEach(attachment => {
        formData.append('files', attachment.file);
      });

      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response,
        timestamp: data.timestamp
      };

      updateConversationMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      updateConversationMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Sidebar 
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={selectConversation}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <header className="app-header">
        <h1>Gemini AI Chat</h1>
        <button 
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle theme"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <main className="chat-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <h2>Welcome to Gemini AI Chat</h2>
            <p>Start a conversation by typing a message below</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
    </div>
  );
}

export default App;
