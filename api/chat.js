export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { prompt, fileParts, lang } = req.body;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        return res.status(200).json({
            response: "⚠️ متغیر OPENROUTER_API_KEY در Vercel یافت نشد.\n\n1. به openrouter.ai بروید و ثبت‌نام کنید\n2. یک API key رایگان بگیرید\n3. در Vercel → Settings → Environment Variables اضافه کنید\n4. Redeploy کنید"
        });
    }

    let systemInstructionText = "You are the D&T Ai-TECH Intelligent Core, engineered and maintained by HMO-Tech. You are a professional, premium architecture and computer engineering co-pilot. Help users generate advanced Grasshopper parametric Python scripts, analyze electronics circuit models, and build UI frameworks. Keep responses technical, flawlessly clean, and exceptionally professional.";

    if (lang === 'fa') {
        systemInstructionText = "شما هسته پردازش مرکزی هوشمند D&T Ai-TECH هستید که توسط مجموعه‌ی HMO-Tech توسعه یافته و نگهداری می‌شود. شما یک دستیار هوش مصنوعی پیشرفته و مهندسی هستید که به سوالات پاسخ داده و اسکریپت‌های کاربردی پایتون در گراس‌هاپر و بردهای الکترونیکی تولید می‌کنید. لحن شما باید بسیار تخصصی، دقیق، محترمانه و حرفه‌ای باشد. همواره پاسخ‌های متنی را به زبان فارسی روان بدهید اما کدهای کامپیوتری و توابع پایتون را کاملاً انگلیسی بنویسید.";
    }

    const userText = prompt?.trim() || "Execute workspace analysis.";

    // ساخت محتوای پیام — پشتیبانی از تصویر
    let messageContent;
    if (fileParts && Array.isArray(fileParts) && fileParts.length > 0) {
        messageContent = [
            { type: "text", text: userText },
            ...fileParts
                .filter(p => p.inlineData?.data && p.inlineData?.mimeType)
                .map(p => ({
                    type: "image_url",
                    image_url: {
                        url: `data:${p.inlineData.mimeType};base64,${p.inlineData.data}`
                    }
                }))
        ];
    } else {
        messageContent = userText;
    }

    // مدل‌های fallback — همه رایگان
    const MODELS = [
        "google/gemini-2.0-flash-exp:free",
        "google/gemini-flash-1.5-8b-exp",
        "meta-llama/llama-3.1-8b-instruct:free",
    ];

    for (const model of MODELS) {
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                    "HTTP-Referer": "https://dt-aitech.vercel.app",
                    "X-Title": "D&T Ai-TECH"
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: "system", content: systemInstructionText },
                        { role: "user", content: messageContent }
                    ],
                    max_tokens: 3500,
                    temperature: 0.2,
                    top_p: 0.95
                })
            });

            const data = await response.json();

            // اگر خطای rate limit یا مدل در دسترس نبود، بعدی را امتحان کن
            if (data.error) {
                const code = data.error.code || data.error.status;
                if (code === 429 || code === 503 || code === 'rate_limit_exceeded') {
                    continue;
                }
                // خطای دیگر — برگردان
                return res.status(200).json({
                    response: `خطای API (${model}): ${data.error.message || JSON.stringify(data.error)}`
                });
            }

            const aiText = data.choices?.[0]?.message?.content;
            if (aiText) {
                return res.status(200).json({ response: aiText, model_used: model });
            }

        } catch (err) {
            continue;
        }
    }

    return res.status(200).json({
        response: lang === 'fa'
            ? "⚠️ همه مدل‌ها در حال حاضر در دسترس نیستند. لطفاً چند دقیقه دیگر دوباره امتحان کنید."
            : "⚠️ All models are currently unavailable. Please try again in a few minutes."
    });
}
