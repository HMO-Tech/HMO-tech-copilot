export async function runAI(prompt, { systemText = "" } = {}) {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            return "ERROR: Missing OPENROUTER_API_KEY in environment variables";
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

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

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText);
        }

        const data = await response.json();

        return data?.choices?.[0]?.message?.content || "No response from model";

    } catch (err) {
        return "AI Engine error: " + err.message;
    }
}
