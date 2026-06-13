import { runAI } from "./aiEngine.js"; // مسیر اصلاح شده بر اساس ساختار پوشه‌ها

export default async function handler(req, res) {
  // تنظیم هدرهای امنیتی و دسترسی
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { message, systemText } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: "Empty message" });
    }

    // استفاده از موتور پردازش بهینه شده با مدیریت تایم‌اوت
    const reply = await runAI(message, { 
      systemText: systemText || "You are D&T AI Engineering Assistant." 
    });

    return res.status(200).json({ success: true, reply });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
