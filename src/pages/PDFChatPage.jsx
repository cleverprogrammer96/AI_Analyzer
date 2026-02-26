import React, { useState, useRef, useEffect } from 'react';
import PDFViewer from '../components/PDFViewer';
import PDFChatMessage from '../components/PDFChatMessage';
import ChatInput from '../components/ChatInput';
import LoadingIndicator from '../components/LoadingIndicator';
import { generateResponse, uploadContract } from '../services/api';

const PDFChatPage = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [highlightText, setHighlightText] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Check if it's a PDF
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setIsLoading(true);
    setStreamingMessage('Uploading and processing PDF...');

    try {
      // Upload to backend for embeddings
      await uploadContract(files);
      
      // Also set for local preview
      setPdfFile(file);
      
      // Add system message
      const systemMessage = {
        id: Date.now(),
        role: 'system',
        content: `PDF "${file.name}" loaded successfully. Ask me anything about this document!`,
        timestamp: new Date().toISOString(),
      };
      
      setMessages([systemMessage]);
      setStreamingMessage('');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content) => {
    if (!content.trim() || isLoading) return;
    
    if (!pdfFile) {
      alert('Please upload a PDF first');
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setStreamingMessage('Analyzing document...');

    try {
      const response = await generateResponse(content);
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingMessage('');
    } catch (error) {
      console.error('Error generating response:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
      setStreamingMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExcerptClick = (excerpt, pageNo) => {
    console.log('Highlighting:', excerpt, 'on page', pageNo);
    setHighlightText(excerpt);
    
    // Clear highlight after 5 seconds
    setTimeout(() => {
      setHighlightText(null);
    }, 5000);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files);
    }
    e.target.value = ''; // Reset input
  };

  return (
    <div className="pdf-chat-page">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div className="pdf-chat-container">
        {/* Left: PDF Preview */}
        <div className="pdf-preview-panel">
          {pdfFile ? (
            <PDFViewer 
              file={pdfFile} 
              highlightText={highlightText}
            />
          ) : (
            <div className="pdf-empty-state">
              <div className="upload-prompt">
                <div className="upload-icon">📄</div>
                <h2>Upload a PDF to get started</h2>
                <p>Upload a contract or document to analyze with AI</p>
                <button 
                  className="upload-btn-large"
                  onClick={handleUploadClick}
                >
                  Upload PDF
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Chat Interface */}
        <div className="pdf-chat-panel">
          <div className="pdf-chat-messages">
            {messages.length === 0 && !pdfFile ? (
              <div className="chat-empty-state">
                <p>Upload a PDF document to start chatting</p>
              </div>
            ) : (
              <>
                <div className="message-list">
                  {messages.map((message) => (
                    <PDFChatMessage
                      key={message.id}
                      message={message}
                      onExcerptClick={handleExcerptClick}
                    />
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
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <ChatInput
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
            disabled={isLoading || !pdfFile}
          />
        </div>
      </div>
    </div>
  );
};

export default PDFChatPage;
