import React, { useState, useRef, useEffect } from 'react';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import PDFViewer from '../components/PDFViewer';
import { generateResponse } from '../services/api';
import { useParams, useSearchParams } from 'react-router-dom';
import { fetchConversation, transformMessages } from '../services/conversationApi';


const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [showPdf, setShowPdf] = useState(false);
  const [highlightText, setHighlightText] = useState(null);
  const messagesEndRef = useRef(null);

  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get('conversationId');
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);

  // Local PDF file path - put your PDF in public folder
  const localPdfPath = '/sample-contract.pdf';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  useEffect(() => {
  if (!conversationId) {
    // No conversation ID - this is a new chat
    setCurrentConversationId(null);
    setMessages([]);
    return;
  }

  if (conversationId === currentConversationId) {
    // Already loaded this conversation
    return;
  }

  // Load conversation from backend
  const loadConversation = async () => {
    setIsLoadingConversation(true);
    try {
      const data = await fetchConversation(conversationId);
      const transformedMessages = transformMessages(data.messages || []);
      setMessages(transformedMessages);
      setCurrentConversationId(conversationId);
    } catch (error) {
      console.error('Failed to load conversation:', error);
      // Show error message
      const errorMessage = {
        id: Date.now(),
        role: 'assistant',
        content: 'Failed to load conversation. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages([errorMessage]);
    } finally {
      setIsLoadingConversation(false);
    }
  };

  loadConversation();
}, [conversationId, currentConversationId]);

  const handleSendMessage = async (content) => {
    if (!content.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setStreamingMessage('Analyzing your request...');

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
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
      setStreamingMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (uploadedFiles, response) => {
    console.log('Files uploaded:', uploadedFiles, response);
  };

  const togglePdfViewer = () => {
    setShowPdf((prev) => !prev);
  };

  const handleExcerptClick = (excerpt) => {
    // Show PDF if hidden
    if (!showPdf) {
      setShowPdf(true);
    }
    
    // Highlight the text
    setHighlightText(excerpt);
    
    // Clear highlight after 5 seconds
    setTimeout(() => {
      setHighlightText(null);
    }, 5000);
  };

  return (
    <div className={`chat-page ${showPdf ? 'with-pdf' : ''}`}>
      {/* PDF Toggle Button */}
      <button 
        className="pdf-toggle-btn"
        onClick={togglePdfViewer}
        title={showPdf ? 'Hide PDF' : 'Show PDF'}
      >
        {showPdf ? '📕 Hide PDF' : '📄 Show PDF'}
      </button>

      {showPdf && (
        <div className="pdf-sidebar">
          <PDFViewer 
            file={localPdfPath}
            highlightText={highlightText}
            onClose={() => setShowPdf(false)}
          />
        </div>
      )}
      
      <div className="chat-main">
        <div className="chat-container">
          {messages.length === 0 && !streamingMessage ? (
            <div className="empty-chat">
              <div className="empty-chat-content">
                <h1 className="empty-chat-title">Contract Assistant</h1>
                <p className="empty-chat-subtitle">
                  Upload contracts to analyze, compare, and get insights
                </p>
                <div className="example-prompts">
                  <button 
                    className="example-prompt"
                    onClick={() => handleSendMessage('Summarize the key terms and conditions')}
                  >
                    Summarize the key terms and conditions
                  </button>
                  <button 
                    className="example-prompt"
                    onClick={() => handleSendMessage('What are the payment terms?')}
                  >
                    What are the payment terms?
                  </button>
                  <button 
                    className="example-prompt"
                    onClick={() => handleSendMessage('Compare liability clauses')}
                  >
                    Compare liability clauses
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <MessageList 
              messages={messages} 
              streamingMessage={streamingMessage}
              isLoading={isLoading}
              onExcerptClick={handleExcerptClick}
            />
          )}
          <div ref={messagesEndRef} />
        </div>

        <div>
          <button onClick={() => handleExcerptClick("with")}>Click me buddy</button>
        </div>
        
        <ChatInput 
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatPage;