import React, { useState, useRef } from 'react';
import { Button } from '../ui/Button';
import { SendIcon, PlusIcon } from '../ui/Icons';
import { uploadContract } from '../services/api';

const ChatInput = ({ onSendMessage, onFileUpload, disabled }) => {
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || disabled || isUploading) return;

    onSendMessage(input);
    setInput('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const response = await uploadContract(files);
      
      // Notify parent component about upload
      if (onFileUpload) {
        const uploadedFiles = Array.from(files).map((file, index) => ({
          id: Date.now() + index,
          name: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        }));
        onFileUpload(uploadedFiles, response);
      }

      // Auto-send a message about the upload
      const fileNames = Array.from(files).map(f => f.name).join(', ');
      setInput(`I've uploaded: ${fileNames}. Please analyze these contracts.`);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset file input
    }
  };

  return (
    <div className="chat-input-container">
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <Button
            type="button"
            variant="icon"
            onClick={handleFileClick}
            disabled={disabled || isUploading}
            aria-label="Upload files"
            className="upload-btn"
          >
            <PlusIcon />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
            aria-label="Upload contract files"
          />
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder="Ask about contracts, terms, clauses..."
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={disabled || isUploading}
            rows={1}
          />
          <Button
            type="submit"
            variant="icon"
            disabled={!input.trim() || disabled || isUploading}
            aria-label="Send message"
          >
            <SendIcon />
          </Button>
        </div>
      </form>
      <div className="input-footer">
        <p className="disclaimer">
          {isUploading ? 'Uploading files...' : 'AI can make mistakes. Verify important contract details.'}
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
