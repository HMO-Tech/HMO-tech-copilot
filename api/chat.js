export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { prompt, message, lang } = req.body;
    const userText = (prompt || message || '').trim();
    if (!userText) return res.status(400).json({ error: 'No message' });

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        const msg = 'OPENROUTER_API_KEY یافت نشد در Vercel';
        return res.status(200).json({ response: msg, success: false, reply: msg });
    }

    const systemPrompt = lang === 'fa'
        ? 'شما دستیار هوشمند D&T Ai-TECH هستید. پاسخ فارسی، کدها انگلیسی.'
        : 'You are D&T Ai-TECH AI assistant. Help with engineering, Grasshopper, parametric design, and coding.';

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://www.dt-ai.tech',
                'X-Title': 'D&T Ai-TECH'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-exp:free',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userText }
                ],
                max_tokens: 3500,
                temperature: 0.2
            })
        });

        const data = await response.json();
        const aiText = data.choices?.[0]?.message?.content;

        if (aiText) {
            return res.status(200).json({ 
                response: aiText, 
                reply: aiText, 
                success: true 
            });
        }

        const errMsg = data.error?.message || 'No response from AI';
        return res.status(200).json({ response: errMsg, reply: errMsg, success: false });

    } catch (err) {
        return res.status(200).json({ 
            response: 'Connection error: ' + err.message, 
            reply: 'Connection error', 
            success: false 
        });
    }
}
