import { runAI } from "./aiEngine.js";

export default async function handler(req, res) {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");

        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        const { prompt, lang } = req.body;

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
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}
