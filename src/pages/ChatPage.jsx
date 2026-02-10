import React, { useState, useRef, useEffect } from 'react';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import { generateResponse } from '../services/api';

const ChatPage = () => {
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

    // Add user message
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
      // Call the LLM API
      const response = await generateResponse(content);
      
      // Add assistant message
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
      
      // Add error message
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
    // Handle file upload success
    console.log('Files uploaded:', uploadedFiles, response);
    
    // You can add the files to chat history or show a success message
    // For example, auto-add a system message:
    // const systemMessage = {
    //   id: Date.now(),
    //   role: 'system',
    //   content: `Uploaded ${uploadedFiles.length} file(s): ${uploadedFiles.map(f => f.name).join(', ')}`,
    //   timestamp: new Date().toISOString(),
    // };
    // setMessages((prev) => [...prev, systemMessage]);
  };

  return (
    <div className="chat-page">
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

export default ChatPage;
