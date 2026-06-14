export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // پشتیبانی کامل از ورودی‌های فرانت‌آند هساآرت استودیو
    const { prompt, message, fileParts, lang } = req.body;
    const userText = (prompt || message || '').trim() || 'Execute workspace analysis.';

    // خواندن توکن مستقیمی که در ورسل ذخیره کردی
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(200).json({
            response: "توکن هوش مصنوعی یافت نشد. لطفاً آن را در انوایورمنت ورسل تنظیم کنید.",
            success: false,
            reply: "API Key is missing."
        });
    }

    // استفاده از قوی‌ترین و پایدارترین مدل زنده نسل جدید گوگل بر اساس داکیومنت جدیدی که فرستادی
    const model = 'gemini-3.5-flash';
    
    let systemInstructionText = lang === 'fa'
        ? "شما هسته هوشمند D&T Ai-TECH هستید. به سوالات مهندسی، برنامه‌نویسی پایتون و گراس‌هاپر پاسخ دهید. پاسخ فارسی، کدها انگلیسی."
        : "You are D&T Ai-TECH Intelligent Core. Help with Grasshopper scripts, parametric design, and engineering.";

    const parts = [];
    if (fileParts && Array.isArray(fileParts)) {
        fileParts.forEach(p => {
            if (p.inlineData?.data) parts.push({ inlineData: p.inlineData });
        });
    }
    parts.push({ text: userText });

    const requestBody = {
        contents: [{ parts }],
        systemInstruction: { parts: [{ text: systemInstructionText }] },
        generationConfig: { temperature: 0.2, maxOutputTokens: 3500, topP: 0.95 }
    };

    try {
        // اتصال مستقیم به اندپوینت رسمی گوگل بدون نیاز به واسطه‌ها
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ response: `خطای سرور گوگل: ${data.error.message}`, success: false });
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText) {
            return res.status(200).json({ 
                response: aiText, 
                success: true,
                reply: aiText 
            });
        } else {
            return res.status(200).json({ response: "فرمت پاسخ ناشناخته: " + JSON.stringify(data), success: false });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Server Connection Error' });
    }
}
