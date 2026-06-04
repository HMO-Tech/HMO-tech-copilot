import { GoogleGenAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    
    // مقداردهی اولیه به API با استفاده از متغیر محیطی ورسل
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // اصلاح نام مدل به نسخه استاندارد و سازگار با v1beta
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    // تفکیک آخرین پیام کاربر برای ارسال به مدل
    const lastMessage = messages[messages.length - 1].content;

    const result = await model.generateContent(lastMessage);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
