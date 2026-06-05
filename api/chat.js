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
            response: "تنظیمات سرور: متغیر GEMINI_API_KEY یافت نشد. لطفاً کلید معتبر خود را در تنظیمات ورسل ست کرده و ری‌دیپلوی کنید." 
        });
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
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

        const userText = prompt && prompt.trim() !== "" ? prompt.trim() : "Analyze the design data.";
        parts.push({ text: userText });

        const requestBody = {
            contents: [{ parts: parts }],
            systemInstruction: {
                parts: [{
                    text: "You are the D&T Ai-TECH Intelligent Core, engineered and maintained by HMO-Tech. You are a world-class copilot for computational design, Rhino/Grasshopper parametric Python script generation, advanced electronics, computer science, and 3D/4D spatial computing. Your partner is Hesam. Always respond in an exceptionally professional, clean, and advanced technical tone. Use Persian for text discussion, but keep all computer code or scripts in perfectly written English."
                }]
            },
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 3000,
                topP: 0.95
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            return res.status(200).json({ response: `خطای سرور گوگل کلاود: ${errData.error?.message || response.statusText}` });
        }

        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "پاسخی از هسته پردازش مرکزی دریافت نشد.";
        return res.status(200).json({ response: aiText });

    } catch (error) {
        return res.status(200).json({ response: `خطای بحرانی لایه شبکه: ${error.message}` });
    }
}
