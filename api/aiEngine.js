// api/aiEngine.js
import { TextServiceClient } from "@google/generative-ai";

// کلاینت برای مدل‌های متنی
const client = new TextServiceClient();

export async function generateText(prompt) {
  try {
    const response = await client.generateText({
      model: "models/text-bison-001",
      input: prompt,
      temperature: 0.7
    });
    // برمیگردونیم متن تولید شده
    return response.candidates[0].output;
  } catch (err) {
    console.error("AI Engine Error:", err);
    throw new Error("Failed to generate text");
  }
}
