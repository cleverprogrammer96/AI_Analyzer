import React from 'react';

const PDFChatMessage = ({ message, onExcerptClick }) => {
  const { role, content, isError } = message;
  const isUser = role === 'user';

  const renderContent = () => {
    if (isUser) {
      return <p>{content}</p>;
    }

    // Handle backend response wrapper
    let data = content;
    if (data && typeof data === 'object' && data.result) {
      data = data.result;
    }

    // Parse JSON if string
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        return <p>{data}</p>;
      }
    }

    // If not an object, render as string
    if (!data || typeof data !== 'object') {
      return <p>{String(data)}</p>;
    }

    const { answer, excerpt, excerpt_page_no } = data;

    return (
      <div className="pdf-chat-content">
        {answer && <p className="chat-answer">{answer}</p>}
        
        {excerpt && (
          <div className="excerpt-section">
            <div className="excerpt-header">
              <span className="excerpt-label">📄 Relevant Excerpt</span>
              {excerpt_page_no && (
                <span className="page-badge">Page {excerpt_page_no}</span>
              )}
            </div>
            <div 
              className="excerpt-box clickable"
              onClick={() => onExcerptClick && onExcerptClick(excerpt, excerpt_page_no)}
              title="Click to highlight in PDF"
            >
              <p>{excerpt}</p>
              <span className="click-hint">👆 Click to highlight in PDF</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`message ${isUser ? 'user-message' : 'assistant-message'} ${isError ? 'error-message' : ''}`}>
      <div className="message-avatar">
        <div className={`avatar-icon ${isUser ? 'user-avatar' : 'assistant-avatar'}`}>
          {isUser ? 'U' : 'AI'}
        </div>
      </div>
      <div className="message-content">
        <div className="message-text">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PDFChatMessage;
