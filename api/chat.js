import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // تنظیم هدرهای CORS برای اینکه مرورگر اجازه ارتباط داشته باشد
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { prompt, fileParts } = req.body; 
        
        // راه‌اندازی هوش مصنوعی گوگل با کلید مخفی شما
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // استفاده از مدل فلش برای سرعت بالاتر در وب

        // بسته‌بندی پیام متنی و فایل‌ها با هم
        const contents = [{
            role: 'user',
            parts: [
                { text: prompt || "Analyze the attached file" },
                ...(fileParts && Array.isArray(fileParts) ? fileParts : [])
            ]
        }];

        const result = await model.generateContent({ contents });
        const response = result.response.text();

        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
