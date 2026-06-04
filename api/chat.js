export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { prompt, fileParts } = req.body;

    try {
        const apiKey = process.env.GROQ_API_KEY;
        let contentPayload = [];

        // فرمت‌بندی استاندارد پیام به ساختار چندرسانه‌ای طبق مستندات Groq
        if (fileParts && Array.isArray(fileParts) && fileParts.length > 0) {
            const base64Data = fileParts[0].inlineData.data;
            const mimeType = fileParts[0].inlineData.mimeType;

            contentPayload = [
                {
                    type: "text",
                    text: prompt || "Analyze this image and describe its visual elements."
                },
                {
                    type: "image_url",
                    image_url: {
                        url: `data:${mimeType};base64,${base64Data}`
                    }
                }
            ];
        } else {
            contentPayload = [
                {
                    type: "text",
                    text: prompt || "سلام"
                }
            ];
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.2-11b-vision-preview',
                messages: [
                    { 
                        role: 'user', 
                        content: contentPayload 
                    }
                ],
                max_tokens: 1024
            })
        });

        const data = await response.json();
        
        // هندل کردن مستقیم ارور ساختاری سرور در صورت رخ دادن
        if (data.error) {
            return res.status(400).json({ response: `Groq Error: ${data.error.message}` });
        }

        const aiText = data.choices?.[0]?.message?.content || "متأسفانه پاسخی دریافت نشد.";
        return res.status(200).json({ response: aiText });

    } catch (error) {
        return res.status(500).json({ response: `خطای سرور: ${error.message}` });
    }
}
