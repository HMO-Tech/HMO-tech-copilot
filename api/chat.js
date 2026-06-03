import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { prompt, fileParts } = req.body; // در اینجا فایل‌ها را از پنل دریافت می‌کنیم
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

        const contents = [prompt];
        if (fileParts && Array.isArray(fileParts)) {
            contents.push(...fileParts);
        }

        const result = await model.generateContent(contents);
        const response = await result.response.text();

        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
