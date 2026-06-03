// api/chat.js (HMO-Tech Advanced Secured Backend)
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { prompt } = req.body;
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return res.status(400).json({ error: 'GROQ_API_KEY is completely missing in Vercel settings.' });
        }

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
                        content: 'You are HMO-TECH AI Co-Pilot, an expert assistant for Computer Engineering, Rhino 3D, and Grasshopper. Answer in Persian if the user speaks Persian, and English if they speak English. Always put python codes in ```python ... ``` blocks.'
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.6
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(400).json({ error: `Groq API Error: ${data.error.message}` });
        }

        if (data.choices && data.choices[0] && data.choices[0].message) {
            return res.status(200).json({ response: data.choices[0].message.content });
        } else {
            return res.status(500).json({ error: 'Unexpected response structure from Groq.' });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Server Side Exception: ' + error.message });
    }
}
