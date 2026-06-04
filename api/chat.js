export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { prompt, fileParts } = req.body;

    try {
        const apiKey = process.env.GROQ_API_KEY;
        
        // تشخیص اینکه کاربر عکس فرستاده است یا فقط متن
        let contentPayload = [];
        
        if (fileParts && Array.isArray(fileParts) && fileParts.length > 0) {
            // اگر عکس فرستاده شده بود، آن را به فرمت استاندارد Groq تبدیل می‌کنیم
            const base64Data = fileParts[0].inlineData.data;
            const mimeType = fileParts[0].inlineData.mimeType;
            
            contentPayload = [
                { type: "text", text: prompt || "این تصویر را تحلیل کن و جزئیات طراحی و سبک را شرح بده." },
                {
                    type: "image_url",
                    image_url: {
                        url: `data:${mimeType};base64,${base64Data}`
                    }
                }
            ];
        } else {
            // درخواست‌های صرفاً متنی چت
            contentPayload = [{ type: "text", text: prompt || "سلام" }];
        }

        // استفاده از مدل قدرتمند بینایی Groq (Llama 3.2 Vision)
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.2-11b-vision-preview', // مدل رسمی مجهز به سیستم پردازش تصویر Groq
                messages: [{ role: 'user', content: contentPayload }]
            })
        });

        const data = await response.json();
        const aiText = data.choices?.[0]?.message?.content || "متأسفانه پاسخی دریافت نشد.";

        return res.status(200).json({ response: aiText });

    } catch (error) {
        return res.status(500).json({ response: `خطای سرور Groq: ${error.message}` });
    }
}
