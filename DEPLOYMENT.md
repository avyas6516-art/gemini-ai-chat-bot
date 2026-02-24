# 🚀 Deployment Guide

## Deploy Gemini AI Chatbot (Free)

### 📋 Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Render account (sign up at render.com)
- Your Gemini API Key: `AIzaSyAyx2QJJoK8GxzZqw7YKHtJubcJmM5JqOY`

---

## Step 1️⃣: Push to GitHub

```bash
# Initialize git (if not already done)
cd "c:\Users\Aditya\Desktop\chat bot\gemini-ai-chatbot"
git init
git add .
git commit -m "Initial commit - Gemini AI Chatbot"

# Create repository on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/gemini-chatbot.git
git branch -M main
git push -u origin main
```

---

## Step 2️⃣: Deploy Backend to Render

1. Go to https://render.com
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"** → Select your repository
4. Configure:
   - **Name:** `gemini-chatbot-api`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   
5. Click **"Advanced"** → Add Environment Variable:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `AIzaSyAyx2QJJoK8GxzZqw7YKHtJubcJmM5JqOY`

6. Click **"Create Web Service"**

7. **Copy your backend URL** (e.g., `https://gemini-chatbot-api.onrender.com`)

---

## Step 3️⃣: Update Frontend API URL

Edit `frontend/.env.production`:
```env
REACT_APP_API_URL=https://your-actual-backend-url.onrender.com
```

Replace `your-actual-backend-url` with your Render URL from Step 2.

---

## Step 4️⃣: Deploy Frontend to Vercel

### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

### Option B: Vercel Website

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. **Import** your GitHub repository
4. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

5. Add Environment Variable:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** Your Render backend URL

6. Click **"Deploy"**

---

## Step 5️⃣: Test Your Deployed App

1. Open your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Send a test message
3. Upload a file to test document processing
4. Check chat history works

---

## 🔧 Update Deployment

**Frontend:**
```bash
cd frontend
vercel --prod
```

**Backend:**
- Just push to GitHub, Render auto-deploys!

---

## 🐛 Troubleshooting

### Backend not responding:
- Check Render logs: Dashboard → Logs
- Verify `GEMINI_API_KEY` is set correctly
- Render free tier sleeps after inactivity (first request takes 30s)

### Frontend can't connect to backend:
- Verify `REACT_APP_API_URL` in Vercel environment variables
- Check CORS is enabled in backend
- Redeploy frontend after changing env variables

### CORS Errors:
Update `backend/server.js`:
```javascript
app.use(cors({
  origin: ['https://your-vercel-url.vercel.app', 'http://localhost:3000']
}));
```

---

## 💰 Cost

- **Vercel:** FREE (unlimited personal projects)
- **Render:** FREE (sleeps after 15min inactivity, 750hrs/month)
- **Total:** $0/month

---

## 🎉 Your App is Live!

**Frontend URL:** https://your-app.vercel.app
**Backend URL:** https://gemini-chatbot-api.onrender.com

Share your chatbot with the world! 🌍
