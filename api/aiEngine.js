// api/aiEngine.js
import fs from 'fs';
import path from 'path';

export async function runAI(prompt, options = {}) {
    const model = options.model || "openrouter/auto";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: "system", content: options.systemText || "You are a professional AI assistant." },
                { role: "user", content: prompt }
            ],
            max_tokens: 3500
        })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    // ذخیره خروجی در پوشه workflows
    const outputDir = path.join(process.cwd(), "workflows");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const fileName = `output-${Date.now()}.json`;
    fs.writeFileSync(path.join(outputDir, fileName), JSON.stringify({ prompt, text, model }, null, 2));

    return text;
}
