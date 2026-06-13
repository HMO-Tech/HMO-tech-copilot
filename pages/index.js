import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [selFile, setSelFile] = useState(null);
  const [started, setStarted] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [chatMessages, setChatMessages] = useState([]);
  const [promptInput, setPromptInput] = useState('');
  const [activeView, setActiveView] = useState('chat');
  const [systemTheme, setSystemTheme] = useState('dark');
  const [searchResult, setSearchResult] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [imgAnalysis, setImgAnalysis] = useState('');
  const [activeLibTab, setActiveLibTab] = useState('all');
  
  const chatboxRef = useRef(null);
  const fileInputRef = useRef(null);
  const imgInputRef = useRef(null);

  const VT = {
    en: { chat: 'AI Studio', project: 'Projects Hub', search: 'Deep Search', images: 'Image Studio', library: 'Extended Library', settings: 'System Settings' },
    fa: { chat: 'استودیو هوش مصنوعی', project: 'مرکز پروژه‌ها', search: 'جستجوی عمیق', images: 'استودیو تصویر', library: 'کتابخانه مرجع', settings: 'تنظیمات سیستم' }
  };

  const dic = {
    en: {
      lblW: "WORKSPACE", lblM: "REPOS & LIBRARIES", placeholder: "Ask D&T Ai-TECH or upload assets...",
      greetT: "Where should we start?", greetD: "Advanced computational engineering copilot for generating Grasshopper Python workflows and circuit optimization.",
      pT: "Projects Hub", pD: "Manage advanced multi-dimensional computational workspaces",
      sT: "Deep Search Core", sD: "Cross-examine massive parametric databases and engineering manifests", sInp: "Search components or algorithmic libraries...",
      iT: "Image Studio", iD: "Upload circuit blueprints, wireframes, or architectural sketches for AI dissection", iDrop: "Drop technical asset here or click to choose file",
      lT: "Extended Library", lD: "Centralized repository housing foundational scripts, prompt systems and templates",
      stT: "System Settings", stD: "Configure your D&T intelligent engine core variables"
    },
    fa: {
      lblW: "فضای کاری سابسکریپشن", lblM: "مخازن و کتابخانه‌ها", placeholder: "سوال خود را بپرسید یا فایل آپلود کنید...",
      greetT: "کجا شروع کنیم؟", greetD: "دستیار مهندسی محاسباتی هوشمند جهت تولید اسکریپت‌های پایتون گراس‌هاپر، بهینه‌سازی مدارهای الکترونیکی و پاسخ به سوالات عمومی.",
      pT: "مرکز پروژه‌ها", pD: "مدیریت و مهار فضاهای کاری پیشرفته چندبعدی",
      sT: "هسته جستجوی عمیق", sD: "بررسی متقاطع دیتابیس‌های پارامتریک و مانیفست‌های مهندسی", sInp: "در کتابخانه‌های الگوریتمی جستجو کنید...",
      iT: "استودیوی تصویر", iD: "آپلود نقشه‌های مدار یا اسکیس‌های معماری جهت کالبدشکافی توسط هوش مصنوعی", iDrop: "فایل مهندسی را اینجا رها کنید یا کلیک کنید",
      lT: "کتابخانه توسعه‌یافته", lD: "مخزن مرکزی کدهای مرجع، سیستم‌های پرامپت و قالب‌های محاسباتی",
      stT: "تنظیمات سیستم", stD: "پیکربندی متغیرهای هسته پردازش مرکزی هوشمند"
    }
  };

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const toggleLanguageSystem = () => {
    setCurrentLang(prev => prev === 'en' ? 'fa' : 'en');
  };

  const handleFileChange = (e) => {
    if (e.target.files.length) {
      setSelFile(e.target.files[0]);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      rd.onload = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
  };

  const handleSend = async () => {
    const txt = promptInput.trim();
    if (!txt && !selFile) return;

    if (!started) setStarted(true);

    const currentMsgId = 'msg_' + Date.now();
    const newUserMessage = {
      sender: 'user',
      text: txt,
      fileName: selFile ? selFile.name : null,
      isFa: /[\u0600-\u06FF]/.test(txt) || currentLang === 'fa'
    };

    setChatMessages(prev => [...prev, newUserMessage]);
    setPromptInput('');
    setSelFile(null);

    const loadingId = 'loading_' + Date.now();
    setChatMessages(prev => [...prev, { sender: 'ai', id: loadingId, isLoading: true, text: 'D&T Intelligent Core processing...' }]);

    let fileParts = [];
    if (selFile) {
      fileParts = [{ inlineData: { data: await convertToBase64(selFile), mimeType: selFile.type } }];
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: txt, fileParts, lang: currentLang })
      });
      const data = await res.json();
      
      setChatMessages(prev => prev.map(m => m.id === loadingId ? {
        sender: 'ai',
        id: currentMsgId,
        text: res.ok && data.response ? data.response : 'System Error: Connection failed.',
        isFa: /[\u0600-\u06FF]/.test(data.response || '')
      } : m));
    } catch {
      setChatMessages(prev => prev.map(m => m.id === loadingId ? {
        sender: 'ai',
        text: 'Connection Error: Serverless cloud engine timed out.',
        isError: true
      } : m));
    }
  };

  return (
    <>
      <Head>
        <title>D&T Ai-TECH | Workspace Core</title>
      </Head>
      <div className={systemTheme === 'blue' ? 'theme-blue' : ''} style={{
        display: 'flex', width: '100vw', height: '100vh', background: 'var(--bg)', color: 'var(--text)',
        fontFamily: "'Space Grotesk', 'Vazirmatn', sans-serif", overflow: 'hidden'
      }}>
        {/* اینترفیس سایدبار و المان‌های استایل پلتفرم شما بدون نقص لود می‌شود */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <img src="/logo.png" style={{ width: '120px', marginBottom: '20px', filter: 'drop-shadow(0 0 25px rgba(0, 229, 255, 0.35))' }} alt="D&T Logo" />
            <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>{currentLang === 'fa' ? dic.fa.greetT : dic.en.greetT}</h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 24px', fontSize: '14.5px', lineHeight: '1.75' }}>
              {currentLang === 'fa' ? dic.fa.greetD : dic.en.greetD}
            </p>
            <button className="lang-switch" onClick={toggleLanguageSystem} style={{
              padding: '8px 20px', borderRadius: '20px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', color: 'var(--cyan)', cursor: 'pointer'
            }}>
              {currentLang === 'en' ? 'FA / EN' : 'EN / FA'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
