import React from 'react';

const Message = ({ message }) => {
  const { role, content, isError } = message;
  const isUser = role === 'user';

  return (
    <div className={`message ${isUser ? 'user-message' : 'assistant-message'} ${isError ? 'error-message' : ''}`}>
      <div className="message-avatar">
        <div className={`avatar-icon ${isUser ? 'user-avatar' : 'assistant-avatar'}`}>
          {isUser ? 'U' : 'AI'}
        </div>
      </div>
      <div className="message-content">
        <div className="message-text">
          {typeof content === 'string' ? (
            <p>{content}</p>
          ) : (
            // Handle structured content if needed
            <div className="structured-content">
              {JSON.stringify(content, null, 2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
