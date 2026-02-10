import React from 'react';
import ContractResponse from './ContractResponse';

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
          {isUser ? (
            // User messages are always plain text
            <p>{content}</p>
          ) : (
            // Assistant messages can be structured or plain text
            <ContractResponse data={content} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
