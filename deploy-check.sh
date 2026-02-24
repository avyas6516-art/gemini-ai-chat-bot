#!/bin/bash
# Deployment Checklist for Gemini AI Chatbot

echo "🚀 Gemini AI Chatbot - Deployment Checklist"
echo "=========================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized"
    echo "   Run: git init"
    exit 1
else
    echo "✅ Git repository initialized"
fi

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file missing"
    echo "   Create: backend/.env with GEMINI_API_KEY"
else
    echo "✅ Backend .env file exists"
fi

# Check if node_modules exist
if [ ! -d "backend/node_modules" ]; then
    echo "⚠️  Backend dependencies not installed"
    echo "   Run: cd backend && npm install"
else
    echo "✅ Backend dependencies installed"
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  Frontend dependencies not installed"
    echo "   Run: cd frontend && npm install"
else
    echo "✅ Frontend dependencies installed"
fi

# Check deployment config files
if [ -f "frontend/vercel.json" ]; then
    echo "✅ Vercel config exists"
else
    echo "❌ Vercel config missing"
fi

if [ -f "backend/render.yaml" ]; then
    echo "✅ Render config exists"
else
    echo "❌ Render config missing"
fi

if [ -f "DEPLOYMENT.md" ]; then
    echo "✅ Deployment guide exists"
else
    echo "❌ Deployment guide missing"
fi

echo ""
echo "=========================================="
echo "📋 Next Steps:"
echo ""
echo "1. Push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy Backend to Render:"
echo "   - Go to https://render.com"
echo "   - New Web Service → Import from GitHub"
echo "   - Root directory: backend"
echo "   - Add GEMINI_API_KEY environment variable"
echo ""
echo "3. Update Frontend API URL:"
echo "   - Edit: frontend/.env.production"
echo "   - Set: REACT_APP_API_URL=https://your-render-url.onrender.com"
echo ""
echo "4. Deploy Frontend to Vercel:"
echo "   - Run: cd frontend && vercel --prod"
echo "   - Or use: https://vercel.com (import from GitHub)"
echo ""
echo "5. Test your deployed app!"
echo ""
echo "=========================================="
echo "📖 Read DEPLOYMENT.md for detailed instructions"
