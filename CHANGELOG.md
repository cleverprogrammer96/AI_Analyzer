# Changelog

## Version 2.0 - Major UI/UX Updates

### ✨ New Features

#### 1. Header Navigation
- Added minimalist white-blue gradient header
- Navigation tabs for "Analysis" and "Comparison" pages
- Sticky header that stays visible while scrolling
- Active state highlighting for current page

#### 2. File Upload in Chat Input
- Moved file upload button (+) from sidebar to chat input box
- Upload button now integrated inline with message input (ChatGPT/Claude style)
- Auto-suggests message after file upload
- Shows upload status in input footer

#### 3. Contract Comparison Page
- New dedicated page for contract comparison workflows
- Separate route: `/comparison`
- Custom example prompts focused on comparison tasks
- Same chat interface, different context

#### 4. Chat History in Sidebar
- Sidebar now displays chat history instead of uploaded files
- "New Chat" button to start fresh conversations
- Chat items show title and timestamp
- Click to load previous conversations (ready for implementation)

### 🎨 Design Improvements
- Cleaner header with gradient background
- Better visual hierarchy with navigation tabs
- Improved spacing and layout consistency
- Upload button has subtle hover state

### 📂 New Files
- `src/components/Header.jsx` - Top navigation header
- `src/pages/ContractComparisonPage.jsx` - Comparison interface
- Added `MessageIcon` to `src/ui/Icons.jsx`

### 🔧 Modified Files
- `src/components/ChatInput.jsx` - Now includes file upload functionality
- `src/components/Sidebar.jsx` - Shows chat history instead of files
- `src/layouts/ChatLayout.jsx` - Includes Header component
- `src/App.jsx` - Added comparison route
- `src/styles/App.css` - Header styles and layout restructuring

### 📋 Technical Changes
- Layout changed from 2-column to 3-section (header + sidebar + content)
- File upload now handled in ChatInput component
- Chat history prop-based (ready for state management)
- Responsive adjustments for header navigation

### 🚀 Usage

**Start Development Server:**
```bash
npm run dev
```

**Navigate Between Pages:**
- Analysis: `http://localhost:3000/chat`
- Comparison: `http://localhost:3000/comparison`

**Upload Files:**
- Click the `+` button in the chat input
- Select PDF/DOC files
- Files auto-upload and populate a suggested message

### 📝 Next Steps
- Implement actual chat history storage/retrieval
- Add API endpoint for comparison (or reuse existing with context)
- Persist uploaded files per chat session
- Add "Delete chat" functionality
- Implement search in chat history

---

## Version 1.0 - Initial Release
- Basic chat interface
- Sidebar with file upload
- API integration
- ChatGPT-inspired design
