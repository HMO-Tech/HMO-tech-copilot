import { GoogleGenAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // تنظیم هدرهای CORS برای ارتباط ایمن فرانت‌اند و بک‌اند
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { prompt, fileParts } = req.body;
    
    // استفاده از کلید عمومی گوگل (حتماً باید GEMINI_API_KEY را در Environment Variables ورسل ست کنی)
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(200).json({ 
            response: "تنظیمات فنی: کلید واژه GEMINI_API_KEY در توکن‌های پنل ورسل یافت نشد. لطفاً آن را ست کنید." 
        });
    }

    try {
        // راه‌اندازی کلاینت هوش مصنوعی گوگل بر اساس پکیج نصب‌شده شما
        const ai = new GoogleGenAI({ apiKey: apiKey });
        
        // آماده‌سازی آرایه محتوا برای پردازش چندوجهی
        const contents = [];

        // ۱. اضافه کردن فایل یا تصویر در صورت وجود (پشتیبانی کامل از Image Studio)
        if (fileParts && Array.isArray(fileParts) && fileParts.length > 0) {
            for (const part of fileParts) {
                if (part.inlineData && part.inlineData.data && part.inlineData.mimeType) {
                    contents.push({
                        inlineData: {
                            data: part.inlineData.data,
                            mimeType: part.inlineData.mimeType
                        }
                    });
                }
            }
        }

        // ۲. اضافه کردن متن پرامپت کاربر
        contents.push({
            text: prompt && prompt.trim() !== "" ? prompt : "Analyze the attached multimedia assets or say hello."
        });

        // ۳. دستورالعمل سیستم برای حفظ هویت برند و پاسخ‌دهی راست‌چین
        const systemInstruction = 
            "You are the D&T Ai-TECH Intelligent Core. You are an expert in graphic design, " +
            "computational design, UI/UX, and code optimization. Always respond in an incredibly " +
            "professional, supportive tone. Use Persian for the chat conversation, but keep code blocks " +
            "clean and in English.";

        // ارسال درخواست مستقیم به مدل زنده و چندوجهی جمنای
        const modelResponse = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.5,
                maxOutputTokens: 2048
            }
        });

        // استخراج متن پاسخ و ارسال به فرانت‌پند شیشه‌ای
        const aiText = modelResponse.text || "پاسخی از هسته پردازش دریافت نشد.";
        return res.status(200).json({ response: aiText });

    } catch (error) {
        console.error("Gemini Core Error:", error);
        return res.status(200).json({ 
            response: `خطای ارتباطی در هسته پردازش جمنای: ${error.message}` 
        });
    }
}
