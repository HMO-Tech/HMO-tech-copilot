import fetch from "node-fetch";

export async function runAI(prompt, { systemText = "" } = {}) {
    const apiKey = process.env.OPENROUTER_API_KEY;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
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

    const data = await response.json();

    return data.choices?.[0]?.message?.content || "No response";
}
