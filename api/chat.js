// api/chat.js
import { runAI } from "./aiEngine.js";

export default async function handler(req, res) {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
            return res.status(200).end();
        }

        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        // مطمئن شدن از اینکه req.body همیشه object است
        const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
        const { prompt, lang } = body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt required" });
        }

        const systemText =
            lang === "fa"
                ? "شما هسته هوشمند D&T AI هستید. پاسخ‌ها دقیق و مهندسی باشند."
                : "You are D&T AI Engine Core. Provide structured technical responses.";

        const result = await runAI(prompt, { systemText });

        return res.status(200).json({
            success: true,
            response: result
        });

    } catch (err) {
        console.error("API Error:", err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}
