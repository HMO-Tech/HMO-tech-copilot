export default async function handler(req, res) {
    // تنظیم هدرهای CORS برای ارتباط ایمن و بدون باگ فرانت‌بند با سرور
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { prompt, fileParts } = req.body;
    
    // دریافت کلید هوش مصنوعی گوگل از متغیرهای ورسل
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(200).json({ 
            response: "تنظیمات فنی: کلید واژه GEMINI_API_KEY در پنل ورسل یافت نشد. لطفاً آن را در بخش Environment Variables ست کنید." 
        });
    }

    try {
        // ساختار استاندارد درخواست به مدل چندوجهی و پرسرعت جمنای گوگل
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        // آماده‌سازی بخش‌های مختلف دیتای ارسالی (متن + تصویر)
        const parts = [];

        // ۱. پردازش و الحاق تصاویر آپلود شده در Image Studio
        if (fileParts && Array.isArray(fileParts) && fileParts.length > 0) {
            for (const part of fileParts) {
                if (part.inlineData && part.inlineData.data && part.inlineData.mimeType) {
                    parts.push({
                        inlineData: {
                            data: part.inlineData.data,
                            mimeType: part.inlineData.mimeType
                        }
                    });
                }
            }
        }

        // ۲. الحاق متن پیام کاربر
        parts.push({
            text: prompt && prompt.trim() !== "" ? prompt : "Analyze the data or greet the user."
        });

        // ۳. ساخت آبجکت نهایی بدنه درخواست همراه با دستورالعمل سیستم (System Instruction)
        const requestBody = {
            contents: [{ parts: parts }],
            systemInstruction: {
                parts: [{
                    text: "You are the D&T Ai-TECH Intelligent Core, maintained by HMO-Tech. You are a world-class expert in graphic design, computational design, UI/UX systems, and coding tools. Always maintain an exceptionally professional and luxurious brand tone. Respond in Persian for general chat, but keep all source code blocks in clean English."
                }]
            },
            generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 2048
            }
        };

        // ارسال درخواست مستقیم به سرورهای هوش مصنوعی گوگل
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        // بررسی خطاهای احتمالی از سمت API گوگل
        if (data.error) {
            return res.status(200).json({ response: `خطای سرور جمنای گوگل: ${data.error.message}` });
        }

        // استخراج متن نهایی تولید شده و ارسال به دشبورد
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "پاسخی از هسته پردازش دریافت نشد.";
        return res.status(200).json({ response: aiText });

    } catch (error) {
        console.error("Gemini Dispatch Error:", error);
        return res.status(200).json({ 
            response: `خطای ارتباطی در بک‌آند سرور: ${error.message}` 
        });
    }
}
