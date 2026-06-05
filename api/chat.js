export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { prompt, fileParts } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(200).json({ 
            response: "سرور مرکزی: کلید واژه GEMINI_API_KEY در تنظیمات ورسل یافت نشد. لطفاً توکن معتبر کلاود خود را اضافه کنید." 
        });
    }

    try {
        // 🔒 اصلاح فوق‌العاده مهم اندپوینت برای اتصال ۱۰۰٪ پایدار به هسته هوش مصنوعی پرو گوگل
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
        const parts = [];

        if (fileParts && Array.isArray(fileParts) && fileParts.length > 0) {
            fileParts.forEach(part => {
                if (part.inlineData && part.inlineData.data && part.inlineData.mimeType) {
                    parts.push({
                        inlineData: {
                            data: part.inlineData.data,
                            mimeType: part.inlineData.mimeType
                        }
                    });
                }
            });
        }

        const userText = prompt && prompt.trim() !== "" ? prompt.trim() : "Dissect the computational assets.";
        parts.push({ text: userText });

        const requestBody = {
            contents: [{ parts: parts }],
            systemInstruction: {
                parts: [{
                    text: "You are the D&T Ai-TECH Intelligent Core, engineered and maintained by HMO-Tech. You are a premium, world-class enterprise copilot tailored for architectural computation, generating advanced Rhino/Grasshopper parametric Python code blocks, analyzing embedded circuit topology, and resolving computer hardware logic. Your structural developer partner is Hesam. Keep responses flawlessly precise, professional, and sophisticated. Match the user's script query layout perfectly."
                }]
            },
            generationConfig: {
                temperature: 0.15, // بهینه‌سازی دما برای خروجی بدون باگ اسکریپت‌های سه بعدی
                maxOutputTokens: 3500,
                topP: 0.95
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            return res.status(200).json({ response: `خطای لایه ابری گوگل: ${data.error?.message || response.statusText}` });
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "پاسخی دریافت نشد.";
        return res.status(200).json({ response: aiText });

    } catch (error) {
        return res.status(200).json({ response: `خطای بحرانی ساختار بک‌آند: ${error.message}` });
    }
}
