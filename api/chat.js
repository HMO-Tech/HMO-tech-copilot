// api/chat.js (HMO-Tech Ultra-Focused Co-Pilot)
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { prompt } = req.body;
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) return res.status(400).json({ error: 'GROQ_API_KEY is missing.' });

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey.trim()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are HMO-TECH AI Co-Pilot, a precise full-stack and computational design engineer. Be highly concise. Do not repeat previous statements. Never fake 3D codes using 2D HTML/CSS. When asked for Three.js, provide real WebGL code using standard libraries like OrbitControls if navigation is needed. Answer in clear Persian when prompted in Persian.'
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.4 // تمرکز بالا و کاهش لوپ‌های تکراری هوش مصنوعی
            })
        });

        const data = await response.json();
        if (data.error) return res.status(400).json({ error: `Groq API Error: ${data.error.message}` });

        if (data.choices && data.choices[0] && data.choices[0].message) {
            return res.status(200).json({ response: data.choices[0].message.content });
        }
        return res.status(500).json({ error: 'Unexpected response structure.' });

    } catch (error) {
        return res.status(500).json({ error: 'Server Exception: ' + error.message });
    }
}
