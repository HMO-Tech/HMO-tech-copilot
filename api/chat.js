// api/chat.js (HMO-Tech Backend Engine)
export default async function handler(req, res) {
    // تنظیم هدرها برای جلوگیری از ارورهای CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt } = req.body;

        // اتصال به API پرسرعت و رایگان GROQ (مدل قدرتمند Llama-3)
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3-70b-8192', // یک مدل فوق‌العاده قوی با درک بالا از کدنویسی پایتون و زبان فارسی
                messages: [
                    {
                        role: 'system',
                        content: 'You are HMO-TECH AI Co-Pilot, an expert assistant for Computer Engineering, Rhino 3D, and Grasshopper. You must support both Persian and English. When writing code, ALWAYS return it inside standard markdown code blocks like ```python ... ```. Be highly professional, helpful, and avoid generic or repetitive introductory phrases.'
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.5
            })
        });

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;
        return res.status(200).json({ response: aiMessage });

    } catch (error) {
        return res.status(500).json({ error: 'Backend Server Error: ' + error.message });
    }
}
