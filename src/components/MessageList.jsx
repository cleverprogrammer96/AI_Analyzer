import React from 'react';
import Message from './Message';
import LoadingIndicator from './LoadingIndicator';

const MessageList = ({ messages, streamingMessage, isLoading, onExcerptClick }) => {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <Message key={message.id} message={message} onExcerptClick={onExcerptClick} />
      ))}
      
      {streamingMessage && (
        <div className="streaming-message">
          <div className="message assistant-message">
            <div className="message-avatar">
              <div className="avatar-icon assistant-avatar">AI</div>
            </div>
            <div className="message-content">
              <div className="message-status">{streamingMessage}</div>
              <LoadingIndicator />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
