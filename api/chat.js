export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { prompt, fileParts, lang } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(200).json({ 
            response: "سرور مرکزی: متغیر GEMINI_API_KEY در تنظیمات ورسل یافت نشد. لطفاً توکن معتبر خود را اضافه کنید." 
        });
    }

    try {
        // 🔒 استفاده از اندپوینت استاندارد v1
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
        
        // 🧠 پرامپت سیستمی هوشمند و پویا متناسب با انتخاب زبان دشبورد شما
        let systemRule = "System Rule: You are the D&T Ai-TECH Intelligent Core, engineered and maintained by HMO-Tech. You are a premium, world-class enterprise AI copilot. Help users generate advanced Grasshopper parametric Python code structures, analyze electronics circuit pipelines, and resolve general inquiries with utmost accuracy. Keep responses flawlessly precise, clean, and highly sophisticated.";
        
        if (lang === 'fa') {
            systemInstructionText = "دستورالعمل سیستم: شما هسته پردازش مرکزی هوشمند D&T Ai-TECH هستید که توسط مجموعه‌ی HMO-Tech توسعه یافته و نگهداری می‌شود. شما یک دستیار هوش مصنوعی پیشرفته و مهندسی هستید که به سوالات پاسخ داده و اسکریپت‌های کاربردی پایتون در گراس‌هاپر و بردهای الکترونیکی تولید می‌کنید. لحن شما باید بسیار تخصصی، دقیق، محترمانه و حرفه‌ای باشد. همواره پاسخ‌های متنی را به زبان فارسی روان بدهید اما کدهای کامپیوتری و توابع پایتون را کاملاً انگلیسی بنویسید.";
        }

        // 🛠️ تزریق مستقیم پرامپت به ابتدای متن کاربر جهت دور زدن باگ پایپ‌لاین ساختار JSON گوگل
        const combinedText = `${systemRule}\n\nUser Query: ${prompt && prompt.trim() !== "" ? prompt.trim() : "Execute workspace analysis."}`;
        
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
        
        parts.push({ text: combinedText });

        const requestBody = {
            contents: [{ parts: parts }],
            generationConfig: {
                temperature: 0.15,
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

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "پاسخی از هسته مرکزی دریافت نشد.";
        return res.status(200).json({ response: aiText });

    } catch (error) {
        return res.status(200).json({ response: `خطای بحرانی ساختار بک‌آند: ${error.message}` });
    }
}
