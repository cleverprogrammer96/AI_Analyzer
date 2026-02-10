# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd contract-chat-app
npm install
```

### 2. Configure Backend URL
```bash
# Copy environment template
cp .env.example .env

# Edit .env and set your backend URL
# REACT_APP_API_BASE_URL=http://your-backend-url:8000
```

### 3. Run the App
```bash
npm run dev
```

The app will open at `http://localhost:3000`

---

## 📂 What You Have

### Complete React 19 App Structure
```
contract-chat-app/
├── src/
│   ├── components/      # UI components (Sidebar, ChatInput, Messages)
│   ├── pages/          # ChatPage with message handling
│   ├── layouts/        # ChatLayout wrapper
│   ├── services/       # API integration (api.js)
│   ├── ui/            # Abstraction layer (Button, Icons)
│   └── styles/        # ChatGPT-inspired CSS
├── README.md          # Full documentation
├── MIGRATION_GUIDE.md # How to swap component libraries
└── package.json       # React 19 + Router + Vite
```

### Key Features Implemented
✅ ChatGPT-like minimalist UI (white-blue theme)
✅ File upload via "+" button
✅ Chat interface with message history
✅ Loading states and error handling
✅ API integration for `/generate/single` and `/upload/contract`
✅ Responsive design
✅ Easy component library swapping

---

## 🔧 Backend Integration

Your app is ready to connect to these endpoints:

### 1. Generate Response
```javascript
POST {baseURL}/generate/single
{
  "query": "What are the payment terms?"
}
```

### 2. Upload Contracts
```javascript
POST {baseURL}/upload/contract
FormData with files
```

**Edit `src/services/api.js` to customize request/response handling.**

---

## 🎨 Customizing for Your Org

### Option 1: Keep Current Design
Just update CSS variables in `src/styles/App.css`:
```css
:root {
  --color-primary: #YOUR_COLOR;
  --font-body: 'Your Font', sans-serif;
}
```

### Option 2: Use Your Component Library
Follow `MIGRATION_GUIDE.md` - it's designed for easy swapping!

1. Install your library: `npm install @your-org/components`
2. Update `src/ui/Button.jsx` and `src/ui/Icons.jsx`
3. Map props to your library's API
4. Business logic stays unchanged ✨

---

## 🎯 Next Steps

### Immediate (Already Done)
- [x] Chat interface
- [x] File upload
- [x] API integration
- [x] Loading states

### Suggested Enhancements
- [ ] Add streaming status messages ("Analyzing clauses...", "Retrieving sections...")
- [ ] Render structured LLM responses (tables, comparisons, citations)
- [ ] Add chat history persistence
- [ ] Implement user authentication
- [ ] Add contract comparison view
- [ ] Create settings page

### For Structured Content

Update `src/components/Message.jsx` to handle JSON responses:

```javascript
// Example: Render comparison tables
if (content.response_type === 'comparison') {
  return <ComparisonTable data={content.structured_data} />;
}

// Example: Render citations
if (content.citations) {
  return (
    <>
      <p>{content.answer}</p>
      <CitationList citations={content.citations} />
    </>
  );
}
```

---

## 💡 Tips

**Streaming Status Messages:**
Edit `src/pages/ChatPage.jsx` to show progress:
```javascript
setStreamingMessage('Analyzing contract clauses...');
// Call API
setStreamingMessage('Generating response...');
```

**Add New Routes:**
1. Create page in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation in `src/components/Sidebar.jsx`

**Debug API Calls:**
Check browser console - all API calls are logged in `src/services/api.js`

---

## 📖 Documentation

- **README.md** - Full project documentation
- **MIGRATION_GUIDE.md** - How to swap component libraries
- **Comments in code** - Inline guidance throughout

---

## ❓ Common Issues

**Build Error:** Make sure you're using Node 18+
```bash
node --version  # Should be 18.0.0 or higher
```

**API Not Connecting:** Check `.env` file has correct backend URL

**Port 3000 Already in Use:**
```bash
# Edit vite.config.js and change port
server: { port: 3001 }
```

---

## 🎉 You're Ready!

Your ChatGPT-inspired contract analysis app is ready to run. The architecture is production-grade, modular, and designed for easy customization.

**Start the app:** `npm run dev`
**Build for production:** `npm run build`
**Read docs:** Open `README.md`

Happy coding! 🚀
