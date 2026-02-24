# Gemini AI Chatbot

A full-stack AI chatbot application powered by Google's Gemini API, featuring a ChatGPT-like interface.

## Features

- 🤖 Powered by Google Gemini AI (gemini-1.5-flash)
- 💬 Real-time chat interface
- 🌓 Dark/Light mode toggle
- 📝 Markdown support with code syntax highlighting
- 📋 Copy message to clipboard
- ⏰ Message timestamps
- 📱 Responsive design
- ⌨️ Keyboard shortcuts (Enter to send, Shift+Enter for new line)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. The API key is already configured in `.env` file

4. Start the backend server:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## Usage

1. Ensure the backend server is running on port 5000
2. Open the frontend at `http://localhost:3000`
3. Start chatting with the AI!

## Tech Stack

### Backend
- Node.js
- Express.js
- Google Generative AI SDK
- CORS
- dotenv

### Frontend
- React 18
- React Markdown
- CSS3

## API Endpoints

- `POST /api/chat` - Send a message and receive AI response
- `GET /api/health` - Health check endpoint

## License

MIT
