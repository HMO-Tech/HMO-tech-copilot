export default async function handler(req, res) {
    // تنظیم هدرهای CORS برای امنیت ارتباط فرانت و بک
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { prompt } = req.body;
    const userPrompt = (prompt || '').trim();

    if (!userPrompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(200).json({ error: "API Key missing in Vercel settings.", success: false });
    }

    // 🧠 دستورالعمل اختصاصی به جمینای ۲.۰ برای خروجی لوکس و هندسی خالص
    const systemInstruction = `
    You are the DT-3D-Engine Core Parser. Your job is to translate text prompts into a structured 3D scene JSON template.
    You must ONLY respond with a valid JSON object. No markdown block wraps (NO \`\`\`json), no regular prose.

    Output Format Specification:
    {
      "metadata": { "style": "futuristic", "lighting": "neon" },
      "objects": [
        { "type": "box"|"sphere"|"cylinder", "scale": [x, y, z], "position": [x, y, z], "color": "#HEX" }
      ]
    }
    `;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://dt-ai.tech',
                'X-Title': 'D&T 3D Engine Core'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash',
                messages: [
                    { role: 'system', content: systemInstruction },
                    { role: 'user', content: `Generate a 3D scene blueprint for: ${userPrompt}` }
                ],
                temperature: 0.1 // برای بالا بردن دقت خروجی ساختار دیتای جی‌سون
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        let rawText = data.choices?.[0]?.message?.content || '';
        
        // پاک‌سازی فرمت‌های احتمالی مارک‌داون هوش مصنوعی
        rawText = rawText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
        
        const sceneJson = JSON.parse(rawText);

        return res.status(200).json({
            success: true,
            scene: sceneJson
        });

    } catch (err) {
        return res.status(200).json({
            success: false,
            error: `3D Core Parsing Failed: ${err.message}`
        });
    }
}
