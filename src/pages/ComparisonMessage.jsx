import React from 'react';
import ContractComparisonResponse from './ContractComparisonResponse';

const ComparisonMessage = ({ message }) => {
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
            <p>{content}</p>
          ) : (
            <ContractComparisonResponse data={content} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonMessage;