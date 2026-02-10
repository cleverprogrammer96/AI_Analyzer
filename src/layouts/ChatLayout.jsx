import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const ChatLayout = () => {
  // Mock chat history - you can replace this with actual state management
  const chatHistory = [
    // Example:
    // { id: 1, title: 'Q3 Vendor Contract Analysis', timestamp: '2 hours ago' },
    // { id: 2, title: 'Payment Terms Review', timestamp: 'Yesterday' },
  ];

  const handleNewChat = () => {
    console.log('Starting new chat...');
    // Clear current chat or navigate to fresh chat
  };

  return (
    <div className="app-container">
      <Header />
      <div className="app-body">
        <Sidebar chatHistory={chatHistory} onNewChat={handleNewChat} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ChatLayout;
