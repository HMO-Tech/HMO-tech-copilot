export async function runAI(prompt, { systemText = "" } = {}) {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000); // 8 ثانیه limit

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            signal: controller.signal,
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                messages: [
                    { role: "system", content: systemText },
                    { role: "user", content: prompt }
                ]
            })
        });

        clearTimeout(timeout);

        const data = await response.json();
        return data?.choices?.[0]?.message?.content || "No response from model";

    } catch (err) {
        return "AI Engine timeout or error: " + err.message;
    }
}
