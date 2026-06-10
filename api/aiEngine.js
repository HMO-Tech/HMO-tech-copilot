import { GoogleGenerativeAI } from "@google/generative-ai";

// API Key باید در Environment Variables در Vercel ست بشه
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function runAI(prompt, options = {}) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const systemText = options.systemText || "";

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `${systemText}\n\nUser Prompt:\n${prompt}`
                        }
                    ]
                }
            ],
        });

        const response = await result.response;
        const text = response.text();

        return text || "Empty response from AI";

    } catch (err) {
        console.error("AI Engine Error:", err);
        throw new Error("AI generation failed");
    }
}
