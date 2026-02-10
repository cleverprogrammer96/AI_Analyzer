# Contract Chat Application

A modern, ChatGPT-inspired contract analysis application built with React 19. This app enables users to upload contracts, ask questions, perform comparisons, and get AI-powered insights using a RAG (Retrieval-Augmented Generation) pipeline.

## Features

- 🎨 **ChatGPT-inspired UI** - Clean, minimalist white-blue design
- 📄 **Contract Upload** - Upload PDF/DOC contracts for analysis
- 💬 **Interactive Chat** - Natural conversation interface for contract Q&A
- 🔍 **Smart Analysis** - Powered by LLM with RAG pipeline
- 🎯 **Modular Architecture** - Easy to swap component libraries
- 📱 **Responsive Design** - Works on desktop and mobile

## Tech Stack

- **React 19** - Latest React with concurrent features
- **React Router v7** - Client-side routing
- **Vite** - Fast build tool and dev server
- **CSS Variables** - Theme customization
- **Fetch API** - Backend communication

## Project Structure

```
contract-chat-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ChatInput.jsx
│   │   ├── LoadingIndicator.jsx
│   │   ├── Message.jsx
│   │   ├── MessageList.jsx
│   │   └── Sidebar.jsx
│   ├── layouts/             # Layout components
│   │   └── ChatLayout.jsx
│   ├── pages/               # Page components
│   │   └── ChatPage.jsx
│   ├── services/            # API and business logic
│   │   └── api.js
│   ├── ui/                  # Abstraction layer for component library
│   │   ├── Button.jsx
│   │   └── Icons.jsx
│   ├── styles/              # CSS files
│   │   └── App.css
│   ├── App.jsx              # Main app component with routing
│   └── index.jsx            # Entry point
├── index.html
├── package.json
├── vite.config.js
└── .env.example
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd contract-chat-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the backend URL:
   ```env
   REACT_APP_API_BASE_URL=http://your-backend-url:8000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Backend Integration

### API Endpoints

The app expects two backend endpoints:

#### 1. Generate Response
```
POST {baseURL}/generate/single
Content-Type: application/json

{
  "query": "User's question here"
}
```

**Expected Response Format:**
You can return either:
- A simple string response
- A structured JSON object (will be displayed as formatted JSON)

Example structured response:
```json
{
  "response_type": "summary",
  "answer": "The contract has 3 key terms...",
  "citations": [
    {
      "clause_id": "4.2",
      "text": "Payment terms..."
    }
  ]
}
```

#### 2. Upload Contract
```
POST {baseURL}/upload/contract
Content-Type: multipart/form-data

files: [File, File, ...]
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Contracts uploaded and embedded",
  "document_ids": ["doc1", "doc2"]
}
```

### Customizing API Integration

Edit `src/services/api.js` to customize:
- Request/response format
- Error handling
- Progress tracking
- Authentication headers

## Swapping Component Libraries

The app is designed to make switching to your org's component library easy:

### 1. Update UI Abstractions

**For Buttons** (`src/ui/Button.jsx`):
```javascript
// Replace native button with your library
import { Button as OrgButton } from '@your-org/components';

export const Button = ({ variant, ...props }) => {
  // Map variants to your library's props
  const variantMap = {
    primary: 'solid',
    icon: 'ghost',
  };
  
  return <OrgButton variant={variantMap[variant]} {...props} />;
};
```

**For Icons** (`src/ui/Icons.jsx`):
```javascript
// Replace with your icon library
import { Plus, Send } from '@your-org/icons';

export const PlusIcon = (props) => <Plus {...props} />;
export const SendIcon = (props) => <Send {...props} />;
```

### 2. Update CSS Variables

Edit `src/styles/App.css` to match your design system:
```css
:root {
  --color-primary: #YOUR_PRIMARY_COLOR;
  --font-body: 'Your Font', sans-serif;
  /* ... other variables */
}
```

### 3. Component Examples

The abstraction layer ensures minimal changes to actual components:
```javascript
// This stays the same regardless of library
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

## Customization

### Adding Status Messages

To show "thinking steps" while the LLM processes:

**Option 1: Frontend Status Messages**
```javascript
// In ChatPage.jsx
setStreamingMessage('Analyzing contract clauses...');
setTimeout(() => setStreamingMessage('Retrieving relevant sections...'), 1000);
setTimeout(() => setStreamingMessage('Generating response...'), 2000);
```

**Option 2: Real Streaming from Backend**
```javascript
// Modify api.js to handle streaming responses
const response = await fetch(`${BASE_URL}/generate/single`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  // Update UI with chunk
  onStreamUpdate(chunk);
}
```

### Displaying Structured Content

Update `Message.jsx` to render structured data:
```javascript
const Message = ({ message }) => {
  if (message.content.response_type === 'comparison') {
    return <ContractComparisonTable data={message.content} />;
  }
  
  if (message.content.response_type === 'summary') {
    return <SummaryCard data={message.content} />;
  }
  
  // Default to text
  return <p>{message.content}</p>;
};
```

## Adding New Routes

1. **Create a new page component:**
   ```javascript
   // src/pages/SettingsPage.jsx
   const SettingsPage = () => {
     return <div>Settings</div>;
   };
   export default SettingsPage;
   ```

2. **Add route to App.jsx:**
   ```javascript
   import SettingsPage from './pages/SettingsPage';
   
   <Route path="settings" element={<SettingsPage />} />
   ```

3. **Add navigation (in Sidebar.jsx):**
   ```javascript
   import { Link } from 'react-router-dom';
   
   <Link to="/settings">Settings</Link>
   ```

## Browser Support

- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+

## License

Proprietary - Your Organization

## Support

For issues or questions, contact your development team.
