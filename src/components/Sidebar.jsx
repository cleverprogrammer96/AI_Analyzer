import React, { useState, useEffect } from 'react';
import { fetchConversations } from '../services/conversationApi';

const Sidebar = ({ onSelectConversation, currentConversationId }) => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchConversations();
      setConversations(data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationClick = (conversationId) => {
    if (onSelectConversation) {
      onSelectConversation(conversationId);
    }
  };

  const handleNewChat = () => {
    if (onSelectConversation) {
      onSelectConversation(null); // null means new chat
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={handleNewChat}>
          + New Chat
        </button>
      </div>

      <div className="sidebar-content">
        {isLoading ? (
          <div className="sidebar-loading">
            <div className="loading-spinner"></div>
            <p>Loading chats...</p>
          </div>
        ) : error ? (
          <div className="sidebar-error">
            <p>{error}</p>
            <button onClick={loadConversations} className="retry-btn">
              Retry
            </button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="sidebar-empty">
            <p>No conversations yet</p>
            <p className="sidebar-empty-hint">Start a new chat to begin</p>
          </div>
        ) : (
          <div className="conversation-list">
            {conversations.map((conversation) => (
              <div
                key={conversation.id || conversation.conversationId}
                className={`conversation-item ${
                  currentConversationId === (conversation.id || conversation.conversationId)
                    ? 'active'
                    : ''
                }`}
                onClick={() => handleConversationClick(conversation.id || conversation.conversationId)}
              >
                <div className="conversation-icon">💬</div>
                <div className="conversation-details">
                  <div className="conversation-title">
                    {conversation.title || conversation.name || 'Untitled Chat'}
                  </div>
                  {conversation.lastMessage && (
                    <div className="conversation-preview">
                      {conversation.lastMessage}
                    </div>
                  )}
                  {conversation.timestamp && (
                    <div className="conversation-time">
                      {new Date(conversation.timestamp).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;