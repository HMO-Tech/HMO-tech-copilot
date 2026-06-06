export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { prompt, fileParts, lang } = req.body;

    // ✅ مدیریت کلیدهای پشتیبان جهت دور زدن خطای محدودیت سهمیه مصرفی رایگان
    const apiKeys = [
        process.env.GEMINI_API_KEY,
        process.env.GEMINI_API_KEY_1,
        process.env.GEMINI_API_KEY_2,
    ].filter(Boolean);

    if (apiKeys.length === 0) {
        return res.status(200).json({
            response: "سرور مرکزی: متغیر GEMINI_API_KEY در تنظیمات ورسل یافت نشد. لطفاً توکن معتبر خود را اضافه کنید."
        });
    }

    // ✅ لیست مدل‌های پرسرعت و پایدار نسل جدید کاملاً سازگار با لایه v1beta کلاود
    const MODELS = [
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b'
    ];

    let systemInstructionText = "You are the D&T Ai-TECH Intelligent Core, engineered and maintained by HMO-Tech. You are a professional, premium architecture and computer engineering co-pilot. Help users generate advanced Grasshopper parametric Python scripts, analyze electronics circuit models, and build UI frameworks. Keep responses technical, flawlessly clean, and exceptionally professional.";

    if (lang === 'fa') {
        systemInstructionText = "شما هسته پردازش مرکزی هوشمند D&T Ai-TECH هستید که توسط مجموعه‌ی HMO-Tech توسعه یافته و نگهداری می‌شود. شما یک دستیار هوش مصنوعی پیشرفته و مهندسی هستید که به سوالات پاسخ داده و اسکریپت‌های کاربردی پایتون در گراس‌هاپر و بردهای الکترونیکی تولید می‌کنید. لحن شما باید بسیار تخصصی، دقیق، محترمانه و حرفه‌ای باشد. همواره پاسخ‌های متنی را به زبان فارسی روان بدهید اما کدهای کامپیوتری و توابع پایتون را کاملاً انگلیسی بنویسید.";
    }

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
    
    const userText = prompt && prompt.trim() !== "" ? prompt.trim() : "Execute workspace analysis.";
    parts.push({ text: userText });

    const requestBody = {
        contents: [{ parts: parts }],
        systemInstruction: {
            parts: [{ text: systemInstructionText }]
        },
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 3500,
            topP: 0.95
        }
    };

    // 🔄 چرخش هوشمند روی کلیدها و مدل‌ها برای تضمین پایداری پاسخ‌دهی
    for (const apiKey of apiKeys) {
        for (const model of MODELS) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });

                const data = await response.json();

                if (data.error) {
                    const msg = data.error.message || '';
                    if (data.error.code === 429 || msg.includes('quota') || msg.includes('not found') || msg.includes('not supported')) {
                        continue; // سوئیچ خودکار به لایه مدل یا کلید بعدی
                    }
                    return res.status(200).json({ response: `خطای لایه ابری گوگل: ${msg}` });
                }

                const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (aiText) {
                    return res.status(200).json({ response: aiText, model_used: model });
                }

            } catch (err) {
                continue; // خطای شبکه، آزمایش کانال بعدی
            }
        }
    }

    return res.status(200).json({
        response: lang === 'fa'
            ? "⚠️ تمام کلیدهای API به سقف مصرف یا محدودیت منطقه‌ای رسیده‌اند. لطفاً کلید معتبری که در پروژه جدید ساختیم را در دشبورد ورسل جایگزین کنید."
            : "⚠️ All API keys have exceeded free quota or regional restrictions. Please update your GEMINI_API_KEY with the new project key in Vercel settings."
    });
}
