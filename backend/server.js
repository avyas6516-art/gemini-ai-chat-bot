const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const xlsx = require('xlsx');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// List of models to try in order (fastest/most available first)
const MODELS_TO_TRY = [
  'gemini-flash-lite-latest',
  'gemini-2.5-flash-lite',
  'gemma-3-4b-it',
  'gemini-2.0-flash-lite-001',
  'gemini-3-flash-preview'
];

// Cache the last successful model to avoid trying all models every time
let lastSuccessfulModel = null;

// Helper function to try multiple models until one works with timeout
async function generateWithFallback(prompt) {
  // Try the last successful model first
  if (lastSuccessfulModel) {
    try {
      const model = genAI.getGenerativeModel({ model: lastSuccessfulModel });
      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000))
      ]);
      const response = await result.response;
      const text = response.text();
      return { text, modelUsed: lastSuccessfulModel };
    } catch (error) {
      // If cached model fails, reset and try all models
      lastSuccessfulModel = null;
    }
  }
  
  // Try all models with timeout
  let lastError = null;
  for (const modelName of MODELS_TO_TRY) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 15000))
      ]);
      const response = await result.response;
      const text = response.text();
      lastSuccessfulModel = modelName; // Cache successful model
      return { text, modelUsed: modelName };
    } catch (error) {
      lastError = error;
    }
  }
  
  throw lastError || new Error('All models failed');
}

// CORS configuration - allow both development and production
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://*.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow all Vercel deployments
    if (origin.includes('vercel.app')) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins (change in production if needed)
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Helper function to extract text from PDF
async function extractPdfText(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

// Helper function to extract text from DOCX
async function extractDocxText(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

// Helper function to extract text from Excel
function extractExcelText(filePath) {
  const workbook = xlsx.readFile(filePath);
  let text = '';
  
  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    text += `\n\nSheet: ${sheetName}\n`;
    text += xlsx.utils.sheet_to_txt(sheet);
  });
  
  return text;
}

// Helper function to extract text from TXT
function extractTxtText(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

// Function to process uploaded file
async function processFile(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  
  try {
    switch (ext) {
      case '.pdf':
        return await extractPdfText(file.path);
      case '.docx':
      case '.doc':
        return await extractDocxText(file.path);
      case '.xlsx':
      case '.xls':
        return extractExcelText(file.path);
      case '.txt':
        return extractTxtText(file.path);
      default:
        return `[File: ${file.originalname} - Format not supported for text extraction]`;
    }
  } catch (error) {
    console.error('Error processing file:', error);
    return `[Error reading file: ${file.originalname}]`;
  } finally {
    // Clean up uploaded file
    try {
      fs.unlinkSync(file.path);
    } catch (e) {
      console.error('Error deleting temp file:', e);
    }
  }
}

app.post('/api/chat', upload.array('files', 10), async (req, res) => {
  try {
    const message = req.body.message || '';
    const conversationHistory = req.body.conversationHistory ? JSON.parse(req.body.conversationHistory) : [];
    const files = req.files || [];

    if (!message && files.length === 0) {
      return res.status(400).json({ error: 'Message or files are required' });
    }

    // Process uploaded files
    let filesContent = '';
    if (files.length > 0) {
      filesContent = '\n\n=== UPLOADED DOCUMENTS ===\n\n';
      
      for (const file of files) {
        filesContent += `\n--- Document: ${file.originalname} ---\n`;
        const content = await processFile(file);
        filesContent += content + '\n';
      }
      
      filesContent += '\n=== END OF DOCUMENTS ===\n\n';
    }

    // Build conversation context (only last 6 messages for speed)
    let prompt = '';
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-6);
      recentHistory.forEach(msg => {
        const content = msg.content.slice(0, 500); // Limit message length
        prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${content}\n`;
      });
    }
    
    // Add files content and user message
    const fullMessage = filesContent + message;
    prompt += `User: ${fullMessage}\nAssistant:`;

    // Generate response with fallback to multiple models
    const { text, modelUsed } = await generateWithFallback(prompt);

    res.json({ 
      response: text,
      timestamp: new Date().toISOString(),
      filesProcessed: files.length,
      modelUsed: modelUsed
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
