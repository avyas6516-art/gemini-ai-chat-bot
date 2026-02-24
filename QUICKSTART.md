# 🚀 Quick Deployment Steps

## ✅ Pre-Deployment Checklist

- [x] Vercel configuration created (`frontend/vercel.json`)
- [x] Render configuration created (`backend/render.yaml`)  
- [x] Environment variable setup (`.env.production`)
- [x] CORS configured for production
- [x] API URL uses environment variables
- [x] .gitignore files created

---

## 📝 Step-by-Step Deployment

### **STEP 1: Push to GitHub** ⬆️

Open PowerShell in project directory:

```powershell
cd "c:\Users\Aditya\Desktop\chat bot\gemini-ai-chatbot"

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Gemini AI Chatbot ready for deployment"

# Add remote (create repo on GitHub first)
git remote add origin https://github.com/YOUR_USERNAME/gemini-chatbot.git

# Push
git branch -M main
git push -u origin main
```

---

### **STEP 2: Deploy Backend to Render** 🔧

1. **Go to:** https://render.com
2. **Sign up/Login** with GitHub
3. Click **"New +"** → **"Web Service"**
4. **Connect** your GitHub repository
5. **Configure:**
   - Name: `gemini-chatbot-api`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Plan: `Free`

6. **Environment Variables** - Click "Advanced":
   ```
   Key: GEMINI_API_KEY
   Value: AIzaSyAyx2QJJoK8GxzZqw7YKHtJubcJmM5JqOY
   ```

7. Click **"Create Web Service"**

8. **Wait for deployment** (2-3 minutes)

9. **Copy your URL:** `https://gemini-chatbot-api-XXXX.onrender.com`

---

### **STEP 3: Update Frontend Environment** 🔄

Edit `frontend/.env.production`:

```env
REACT_APP_API_URL=https://gemini-chatbot-api-XXXX.onrender.com
```

Replace `XXXX` with your actual Render URL.

**Commit the change:**
```powershell
git add frontend/.env.production
git commit -m "Update API URL for production"
git push
```

---

### **STEP 4: Deploy Frontend to Vercel** 🎨

#### **Option A: Vercel CLI (Recommended)**

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to frontend
cd frontend

# Deploy to production
vercel --prod
```

Follow the prompts:
- Setup and deploy? **Y**
- Scope: Select your account
- Link to existing project? **N**
- Project name: `gemini-chatbot`
- Directory: `./` (leave as is)
- Override settings? **N**

#### **Option B: Vercel Website**

1. **Go to:** https://vercel.com
2. **Sign up/Login** with GitHub
3. Click **"Add New..."** → **"Project"**
4. **Import** your GitHub repository
5. **Configure:**
   - Framework Preset: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

6. **Environment Variables:**
   ```
   Key: REACT_APP_API_URL
   Value: https://gemini-chatbot-api-XXXX.onrender.com
   ```

7. Click **"Deploy"**

8. **Wait for deployment** (1-2 minutes)

9. **Your app is live!** 🎉

---

### **STEP 5: Test Your Deployment** ✅

1. **Open your Vercel URL:** `https://your-app.vercel.app`

2. **Test features:**
   - ✅ Send a message
   - ✅ Upload a file
   - ✅ Create new conversation
   - ✅ Toggle dark mode
   - ✅ Check word suggestions

3. **Check browser console** for any errors

4. **If issues:**
   - Check Render logs: Dashboard → Logs
   - Check Vercel logs: Deployment → Function Logs
   - Verify environment variables are set correctly

---

## 🔄 Update Deployment

**Frontend changes:**
```powershell
cd frontend
git add .
git commit -m "Update frontend"
git push

# Auto-deploys on Vercel!
# Or manually: vercel --prod
```

**Backend changes:**
```powershell
cd backend
git add .
git commit -m "Update backend"
git push

# Auto-deploys on Render!
```

---

## 🐛 Troubleshooting

### Backend not responding:
- Render free tier sleeps after 15 min → First request takes 30-50s
- Check environment variables in Render dashboard
- View logs in Render dashboard

### Frontend CORS errors:
- Verify `REACT_APP_API_URL` is correct in Vercel
- Check backend CORS settings in `server.js`
- Redeploy frontend after env variable changes

### Build failures:
- Check build logs in respective platforms
- Verify all dependencies in `package.json`
- Ensure Node version compatibility

---

## 💰 Costs

- **Vercel:** FREE forever (unlimited personal projects)
- **Render:** FREE 750 hours/month (sleeps after inactivity)
- **Total:** $0/month for hobby use

---

## 🎉 Success!

Your AI chatbot is now live and accessible worldwide! 

**Share it:**
- Frontend: `https://your-app.vercel.app`
- API: `https://gemini-chatbot-api-XXXX.onrender.com`

---

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [GitHub Documentation](https://docs.github.com)
- [Gemini API Docs](https://ai.google.dev/docs)

---

**Need help?** Check the full guide in `DEPLOYMENT.md`
