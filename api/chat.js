import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // تنظیم هدرهای CORS جهت جلوگیری از خطای بلاک مرورگر
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, fileParts } = req.body;
    
    if (!prompt && (!fileParts || fileParts.length === 0)) {
      return res.status(400).json({ error: 'Prompt or file input is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'API key is missing on Vercel.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // تغییر به مدل پیشرفته Pro برای درک فضاها و منطق‌های پیچیده مهندسی
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
      systemInstruction: `You are "D&T Ai-TECH: AI Compass & Design Co-Pilot". An elite computational design co-pilot. 
      Your mission is to help the user with general queries, computer science, electronics, and specialized 3D/4D parametric scripts (Rhinoceros 3D, Grasshopper, RhinoCommon, GhPython).
      Always separate source code clearly, providing optimal, production-ready solutions. Respond fluently in the language of the prompt (Persian or English).`
    });

    let contents = [];
    
    // ترکیب و افزودن فایل‌های آپلود شده (تصویر، داکیومنت) به ریکوئست گوگل
    if (fileParts && fileParts.length > 0) {
      fileParts.forEach(part => {
        contents.push(part);
      });
    }
    
    if (prompt) {
      contents.push(prompt);
    }

    const result = await model.generateContent(contents);
    const response = await result.response;
    const text = response.text();

    // خروجی نهایی مچ با ساختار فرانت‌اند شما (d.response)
    return res.status(200).json({ response: text });

  } catch (error) {
    console.error('Gemini API Ultimate Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
