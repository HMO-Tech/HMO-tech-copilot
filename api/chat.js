
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // مدیریت متد درخواست
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required' });
    }
    
    // ۱. اصلاح نام کلاس به GoogleGenerativeAI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // ۲. فراخوانی مدل با ساختار و آدرس کاملاً استاندارد گوگل
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // تفکیک آخرین متن پیام کاربر
    const lastMessage = messages[messages.length - 1].content;

    // ارسال به گوگل
    const result = await model.generateContent(lastMessage);
    const response = await result.response;
    const text = response.text();

    // خروجی استاندارد
    return res.status(200).json({ text: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    // بازگرداندن ارور به فرانت‌انداز تا متوجه جزئیات شویم
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
