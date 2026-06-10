import fs from "fs";
import path from "path";

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
                { role: "system", content: options.systemText || "You are a professional AI engine." },
                { role: "user", content: prompt }
            ],
            max_tokens: 2000
        })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    // 🧠 Artifact Layer (مهم‌ترین بخش)
    const artifact = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        prompt,
        response: text,
        model
    };

    // ذخیره محلی (برای الان)
    saveArtifact(artifact);

    return {
        text,
        artifact
    };
}

// 📦 ذخیره artifact
function saveArtifact(data) {
    const dir = path.join(process.cwd(), "workflows");

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const file = path.join(dir, `artifact-${data.id}.json`);

    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// 🔑 ID generator
function generateId() {
    return Math.random().toString(36).substring(2, 10);
}
