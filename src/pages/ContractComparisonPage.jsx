import React, { useState, useRef, useEffect } from 'react';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import { generateResponse } from '../services/api';

const ContractComparisonPage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

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
    setStreamingMessage('Comparing contracts...');

    try {
      // Call the comparison API endpoint
      // You can modify this to use a different endpoint for comparison
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
    // Handle file upload for comparison
    console.log('Files uploaded for comparison:', uploadedFiles, response);
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        {messages.length === 0 && !streamingMessage ? (
          <div className="empty-chat">
            <div className="empty-chat-content">
              <h1 className="empty-chat-title">Contract Comparison</h1>
              <p className="empty-chat-subtitle">
                Upload multiple contracts to compare terms, clauses, and conditions
              </p>
              <div className="example-prompts">
                <button 
                  className="example-prompt"
                  onClick={() => handleSendMessage('Compare the payment terms across all contracts')}
                >
                  Compare the payment terms across all contracts
                </button>
                <button 
                  className="example-prompt"
                  onClick={() => handleSendMessage('Show differences in liability clauses')}
                >
                  Show differences in liability clauses
                </button>
                <button 
                  className="example-prompt"
                  onClick={() => handleSendMessage('Which contract has the most favorable terms?')}
                >
                  Which contract has the most favorable terms?
                </button>
              </div>
            </div>
          </div>
        ) : (
          <MessageList 
            messages={messages} 
            streamingMessage={streamingMessage}
            isLoading={isLoading}
          />
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        onFileUpload={handleFileUpload}
        disabled={isLoading}
      />
    </div>
  );
};

export default ContractComparisonPage;
