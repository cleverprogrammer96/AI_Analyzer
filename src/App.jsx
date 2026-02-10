import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ChatLayout from './layouts/ChatLayout';
import ChatPage from './pages/ChatPage';
import ContractComparisonPage from './pages/ContractComparisonPage';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatLayout />}>
          <Route index element={<Navigate to="/chat" replace />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="comparison" element={<ContractComparisonPage />} />
          {/* Add more routes here as needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
