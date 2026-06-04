export default async function handler(req, res) {
    // تنظیم هدرهای CORS برای ارتباط بدون مشکل مرورگر
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const apiKey = process.env.GROQ_API_KEY;
        
        // ارسال درخواست به سرور رسمی Groq با مدل بسیار هوشمند Llama 3
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192', // مدل فوق‌العاده سریع و هوشمند لاما ۳
                messages: [{ role: 'user', content: prompt }]
            })
        });

        const data = await response.json();
        const aiText = data.choices?.[0]?.message?.content || "متأسفانه پاسخی دریافت نشد.";

        return res.status(200).json({ response: aiText });

    } catch (error) {
        return res.status(500).json({ response: `خطای سرور Groq: ${error.message}` });
    }
}
