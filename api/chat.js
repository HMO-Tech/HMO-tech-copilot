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
            response: "System Config Error: GEMINI_API_KEY environment variable is missing on Vercel variables map." 
        });
    }

    try {
        // 🔒 استفاده از پورت v1beta جهت فعالسازی ۱۰۰٪ بدون باگ پرامپت سیستمی مدل فوق‌العاده قوی Pro
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

        const userText = prompt && prompt.trim() !== "" ? prompt.trim() : "Execute architectural framework analysis.";
        parts.push({ text: userText });

        const requestBody = {
            contents: [{ parts: parts }],
            systemInstruction: {
                parts: [{
                    text: "You are the D&T Ai-TECH Intelligent Core, engineered and maintained by HMO-Tech. You are a professional, premium architecture and computer engineering co-pilot. Your developer partner is Hesam. Help him generate advanced Grasshopper parametric Python scripts, analyze electronics circuit models, and build UI frameworks. Keep responses technical, flawlessly clean, and exceptionally professional. Match the user's language blueprint context perfectly."
                }]
            },
            generationConfig: {
                temperature: 0.2,
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
            return res.status(200).json({ 
                response: `Google Cloud Error API Node: ${data.error?.message || response.statusText}` 
            });
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Empty payload response generated from the model canvas.";
        return res.status(200).json({ response: aiText });

    } catch (error) {
        return res.status(200).json({ response: `Critical Network Layer Exception: ${error.message}` });
    }
}
