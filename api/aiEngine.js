export async function runAI(prompt, { systemText = "" } = {}) {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            return "ERROR: Missing OPENROUTER_API_KEY in environment variables";
        }

        // تنظیم تایم‌اوت روی ۸ ثانیه جهت جلوگیری از برخورد با سقف ۱۰ ثانیه‌ای ورسل
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            signal: controller.signal,
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://dt-ai.tech", // الزامی برای قوانین اپن‌روتر
                "X-Title": "D&T Ai-TECH Platform"     // الزامی برای قوانین اپن‌روتر
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                messages: [
                    { role: "system", content: systemText },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 1500 // محدود کردن توکن برای پاسخ سریع‌تر و فرار از تایم‌اوت
            })
        });

        clearTimeout(timeout);

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText);
        }

        const data = await response.json();
        return data?.choices?.[0]?.message?.content || "No response from model";

    } catch (err) {
        if (err.name === 'AbortError') {
            return "AI Engine Error: پاسخ هوش مصنوعی طولانی شد و برای جلوگیری از خطای سرور ابری متوقف گردید. لطفاً درخواست خود را کوتاه‌تر ارسال کنید.";
        }
        return "AI Engine error: " + err.message;
    }
}
