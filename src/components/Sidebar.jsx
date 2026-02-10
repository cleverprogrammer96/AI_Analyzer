import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { PlusIcon, MessageIcon } from '../ui/Icons';

const Sidebar = ({ chatHistory = [], onNewChat }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNewChat = () => {
    if (onNewChat) {
      onNewChat();
    }
    navigate('/chat');
  };

  const handleChatClick = (chatId) => {
    // Navigate to specific chat or load chat history
    console.log('Load chat:', chatId);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Button 
          variant="primary" 
          className="new-chat-btn"
          onClick={handleNewChat}
          aria-label="Start new chat"
        >
          <PlusIcon />
          <span>New Chat</span>
        </Button>
      </div>

      <div className="sidebar-content">
        <div className="chat-history">
          {chatHistory.length === 0 ? (
            <p className="empty-state">No chat history yet</p>
          ) : (
            <div className="chat-list">
              {chatHistory.map((chat) => (
                <div 
                  key={chat.id} 
                  className="chat-item"
                  onClick={() => handleChatClick(chat.id)}
                >
                  <MessageIcon size={16} />
                  <div className="chat-info">
                    <span className="chat-title">{chat.title}</span>
                    <span className="chat-meta">{chat.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <span className="user-name">Contract Assistant</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
