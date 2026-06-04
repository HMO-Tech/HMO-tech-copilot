export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { prompt, fileParts } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return res.status(200).json({ response: "تنظیمات فنی: کلید واژه GROQ_API_KEY در پنل ورسل یافت نشد." });
    }

    try {
        // استفاده از مدل ۱۰۰٪ فعال و تست‌شده در لاگ‌های قبلی شما برای تضمین پایداری چت
        const modelId = 'llama3-8b-8192'; 
        let messageContent = prompt || "سلام";

        // مدیریت ایمن فایل برای جلوگیری از خراب شدن درخواست‌های متنی
        if (fileParts && Array.isArray(fileParts) && fileParts.length > 0) {
            messageContent = `[تصویر ضمیمه شده] ${messageContent}`;
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelId,
                messages: [{ role: 'user', content: messageContent }],
                max_tokens: 1024
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(200).json({ response: `پیام سیستم: ${data.error.message}` });
        }

        const aiText = data.choices?.[0]?.message?.content || "پاسخی دریافت نشد.";
        return res.status(200).json({ response: aiText });

    } catch (error) {
        return res.status(200).json({ response: `خطای ارتباطی سرور: ${error.message}` });
    }
}
