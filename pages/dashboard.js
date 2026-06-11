// در فایل dashboard.js (بخش اسکریپت‌ها)
import { processAI } from '../api/aiEngine'; // وارد کردن موتورِ خودت

const handleSendChat = async () => {
    // 1. دریافت متن کاربر
    // 2. ارسال به aiEngine.js
    const response = await processAI(chatInput); 
    // 3. نمایش در chatbox
};
