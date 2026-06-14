export default async function handler(req, res) {
    // تنظیم هدرهای CORS برای دسترسی بدون مشکل فرانت‌آند دشبورد
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // دریافت اطلاعات ارسالی از سمت دشبورد بنفش (هماهنگ با هر دو فیلد prompt و message)
    const { prompt, message, fileParts, lang, systemText } = req.body;
    const userText = (prompt || message || '').trim() || 'Execute workspace analysis.';

    // خواندن دقیق کلیدی که در تصویر ورسل فرستادی
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        const msg = lang === 'fa'
            ? "⚠️ کلید GEMINI_API_KEY در تنظیمات ورسل یافت نشد."
            : "⚠️ GEMINI_API_KEY not found in Vercel Environment Variables.";
        return res.status(200).json({ response: msg, success: false, reply: msg });
    }

    // دستورالعمل سیستم برای هدایت رفتاری هوش مصنوعی
    let systemInstructionText = systemText || (
        lang === 'fa'
            ? "شما هسته پردازش مرکزی هوشمند D&T Ai-TECH هستید که توسط مجموعه HMO-Tech توسعه یافته است. به سوالات مهندسی، برنامه‌نویسی پایتون و طراحی پارامتریک در گراس‌هاپر پاسخ دهید. لحن حرفه‌ای، پاسخ متنی فارسی، کدها انگلیسی."
            : "You are the D&T Ai-TECH Intelligent Core, engineered by HMO-Tech. You are a professional AI copilot for architecture, computational design, and Grasshopper Python scripting."
    );

    try {
        // اتصال هوشمند به اوپن‌روتر با استفاده از توکنی که در ورسل داری
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://hesaart.shop',
                'X-Title': 'Hesaart Studio Dashboard'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash', // مدل پایدار و فعال در پلتفرم اوپن‌روتر
                messages: [
                    { role: 'system', content: systemInstructionText },
                    { role: 'user', content: userText }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || "خطای ناشناخته از سمت سرور ارائه دهنده");
        }

        const aiText = data.choices?.[0]?.message?.content;
        
        if (aiText) {
            // بازگرداندن فیلدها به صورتی که هم با ایندکس قدیمی و هم جدید فرانت‌آند سینک باشد
            return res.status(200).json({ 
                response: aiText, 
                reply: aiText, 
                success: true, 
                model_used: 'gemini-2.0-flash' 
            });
        } else {
            return res.status(200).json({ 
                response: "خطا: پاسخ هوش مصنوعی خالی بود. دیتای خام: " + JSON.stringify(data), 
                success: false 
            });
        }

    } catch (err) {
        const errMsg = lang === 'fa' 
            ? `خطا در ارتباط با هسته هوش مصنوعی: ${err.message}` 
            : `AI Core Error: ${err.message}`;
        return res.status(200).json({ response: errMsg, reply: errMsg, success: false });
    }
}
