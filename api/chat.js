// api/chat.js (D&T Ai-TECH Dedicated Co-Pilot Backend)
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
            return res.status(400).json({ error: 'GROQ_API_KEY is missing from environment setup.' });
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
                        content: 'You are D&T Ai-TECH, a highly precise full-stack developer and computational design assistant specialized in Python, JavaScript, Rhino 3D, and Grasshopper. Your answers must be short, high-performing, and structurally accurate. Do not repeat your explanations or run into endless loops. Never provide 2D HTML structures when Three.js WebGL is requested. Always reply in clean Persian when user addresses you in Persian.'
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.4
            })
        });

        const data = await response.json();
        if (data.error) return res.status(400).json({ error: `Groq API Error: ${data.error.message}` });

        if (data.choices && data.choices[0] && data.choices[0].message) {
            return res.status(200).json({ response: data.choices[0].message.content });
        }
        return res.status(500).json({ error: 'Unexpected structure from API response.' });

    } catch (error) {
        return res.status(500).json({ error: 'Server Side Exception: ' + error.message });
    }
}
