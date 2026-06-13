import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

export default function Dashboard() {
  const [lang, setLang] = useState('en');
  const [view, setView] = useState('chat'); // تبلت‌های کاربری: chat, projects, search, images, library, settings
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef(null);

  // واژه‌نامه اختصاصی پلتفرم مهندسی D&T
  const dic = {
    en: {
      title: "D&T Ai-TECH | Engineering Core",
      chatTab: "AI Engine Studio", projectTab: "Computational Repos",
      searchTab: "Deep Search Core", imageTab: "Blueprint Dissection",
      libTab: "Algorithmic Library", setTab: "System Tuning",
      placeholder: "Ask D&T Ai-TECH or paste Grasshopper script...",
      greet: "Advanced Engineering Hub Active",
      desc: "Parametric workflow generation, circuit layout optimization, and core system modeling tools."
    },
    fa: {
      title: "D&T Ai-TECH | هسته محاسباتی",
      chatTab: "استودیو پردازش هوش مصنوعی", projectTab: "مخازن الگوریتم محاسباتی",
      searchTab: "هسته جستجوی عمیق", imageTab: "کالبدشکافی نقشه‌ها",
      libTab: "کتابخانه توسعه مرجع", setTab: "تنظیمات متغیرهای سیستمی",
      placeholder: "سوال خود را بپرسید یا اسکریپت پایتون گراس‌هاپر را وارد کنید...",
      greet: "مرکز مهندسی پیشرفته متصل شد",
      desc: "تولید جریان‌های کاری پارامتریک، بهینه‌سازی چیدمان مدار و ابزارهای مدل‌سازی هسته سیستم."
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async () => {
    if (!promptText.trim() || loading) return;
    const userText = promptText;
    setPromptText('');
    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      // 🎯 اتصال دقیق و مهندسی شده با API قدیمی شما بدون تداخل بیلد
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText, fileParts: [], lang })
      });
      const data = await res.json();
      
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        text: res.ok && data.response ? data.response : (lang === 'fa' ? 'سیستم ابری با خطا مواجه شد.' : 'Cloud execution failed.') 
      }]);
    } catch {
      setChatHistory(prev => [...prev, { role: 'ai', text: lang === 'fa' ? 'خطای شبکه در اتصال به گیت‌وی.' : 'Network gateway timeout.' }]);
    } finally {
      setLoading(false);
    }
  };

  const t = lang === 'fa' ? dic.fa : dic.en;

  return (
    <>
      <Head>
        <title>{t.title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=Vazirmatn:wght@400;500;700&display=swap" rel="stylesheet" />
        <style>{`
          body { margin: 0; padding: 0; background: #050508; color: #e1e1e8; font-family: 'Space Grotesk', 'Vazirmatn', sans-serif; overflow: hidden; }
        `}</style>
      </Head>

      <div style={{ display: 'flex', width: '100vw', height: '100vh', direction: lang === 'fa' ? 'rtl' : 'ltr' }}>
        
        {/* سایدبار ناوبری دشبورد ثانویه */}
        <aside style={{ width: sidebarCollapsed ? '70px' : '280px', background: '#09090e', transition: 'width 0.2s', display: 'flex', flexDirection: 'column', borderRight: lang === 'en' ? '1px solid rgba(255,255,255,0.05)' : 'none', borderLeft: lang === 'fa' ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
          <div style={{ height: '64px', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ background: 'transparent', border: 'none', color: '#6a6a7a', cursor: 'pointer', fontSize: '20px' }}>☰</button>
            {!sidebarCollapsed && <span style={{ fontWeight: '600', color: '#fff' }}>D&T Workspace</span>}
          </div>
          
          <div style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div onClick={() => setView('chat')} style={{ padding: '12px', borderRadius: '10px', background: view === 'chat' ? 'rgba(0, 229, 255, 0.08)' : 'transparent', color: view === 'chat' ? '#00e5ff' : '#a0a0b0', cursor: 'pointer', fontSize: '13.5px' }}>💬 {!sidebarCollapsed && t.chatTab}</div>
            <div onClick={() => setView('projects')} style={{ padding: '12px', borderRadius: '10px', background: view === 'projects' ? 'rgba(0, 229, 255, 0.08)' : 'transparent', color: view === 'projects' ? '#00e5ff' : '#a0a0b0', cursor: 'pointer', fontSize: '13.5px' }}>📂 {!sidebarCollapsed && t.projectTab}</div>
            <div onClick={() => setView('search')} style={{ padding: '12px', borderRadius: '10px', background: view === 'search' ? 'rgba(0, 229, 255, 0.08)' : 'transparent', color: view === 'search' ? '#00e5ff' : '#a0a0b0', cursor: 'pointer', fontSize: '13.5px' }}>🔍 {!sidebarCollapsed && t.searchTab}</div>
            <div onClick={() => setView('images')} style={{ padding: '12px', borderRadius: '10px', background: view === 'images' ? 'rgba(0, 229, 255, 0.08)' : 'transparent', color: view === 'images' ? '#00e5ff' : '#a0a0b0', cursor: 'pointer', fontSize: '13.5px' }}>🖼️ {!sidebarCollapsed && t.imageTab}</div>
            <div onClick={() => setView('library')} style={{ padding: '12px', borderRadius: '10px', background: view === 'library' ? 'rgba(0, 229, 255, 0.08)' : 'transparent', color: view === 'library' ? '#00e5ff' : '#a0a0b0', cursor: 'pointer', fontSize: '13.5px' }}>📚 {!sidebarCollapsed && t.libTab}</div>
            <div onClick={() => setView('settings')} style={{ padding: '12px', borderRadius: '10px', background: view === 'settings' ? 'rgba(0, 229, 255, 0.08)' : 'transparent', color: view === 'settings' ? '#00e5ff' : '#a0a0b0', cursor: 'pointer', fontSize: '13.5px' }}>⚙️ {!sidebarCollapsed && t.setTab}</div>
          </div>
        </aside>

        {/* فریم اصلی نمایش محیط‌های مختلف */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <header style={{ height: '64px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: '#6a6a7a', fontSize: '12px', fontWeight: '500' }}>ANALYTICS ENGINE CORE</span>
            <button onClick={() => setLang(l => l === 'en' ? 'fa' : 'en')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#00e5ff', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>{lang === 'en' ? 'FA' : 'EN'}</button>
          </header>

          <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', maxWidth: '840px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
            
            {view === 'chat' && (
              <>
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '24px' }}>
                  {chatHistory.length === 0 && (
                    <div style={{ textAlign: 'center', marginTop: '12%' }}>
                      <h1 style={{ fontSize: '30px', fontWeight: '400', color: '#fff', marginBottom: '8px' }}>{t.greet}</h1>
                      <p style={{ color: '#6a6a7a', fontSize: '14px', maxWidth: '480px', margin: '0 auto' }}>{t.desc}</p>
                    </div>
                  )}
                  {chatHistory.map((msg, i) => (
                    <div key={i} style={{ marginBottom: '20px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                      <div style={{ display: 'inline-block', padding: '14px 20px', borderRadius: '20px', background: msg.role === 'user' ? '#141424' : 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', maxWidth: '85%' }}>
                        <small style={{ color: msg.role === 'user' ? '#00e5ff' : '#9b6dff', fontWeight: 'bold', fontSize: '11px', display: 'block', marginBottom: '4px' }}>{msg.role === 'user' ? 'USER' : 'D&T AI CORE'}</small>
                        <div style={{ fontSize: '14.5px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                      </div>
                    </div>
                  ))}
                  {loading && <div style={{ color: '#6a6a7a', fontSize: '13px' }}>⏳ Calculating algorithms...</div>}
                  <div ref={chatBottomRef} />
                </div>
                
                <div style={{ display: 'flex', gap: '12px', background: '#0e0e16', border: '1px solid rgba(255,255,255,0.06)', padding: '8px 8px 8px 18px', borderRadius: '32px', alignItems: 'center' }}>
                  <input type="text" value={promptText} onChange={e => setPromptText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder={t.placeholder} style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '14.5px' }} />
                  <button onClick={handleSend} style={{ background: 'linear-gradient(90deg, #00e5ff, #7b4fc4)', color: '#000', border: 'none', padding: '10px 24px', borderRadius: '24px', cursor: 'pointer', fontWeight: '700', fontSize: '12.5px' }}>RUN EXECUTION</button>
                </div>
              </>
            )}

            {view !== 'chat' && (
              <div style={{ background: '#0e0e16', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#00e5ff' }}>{view.toUpperCase()} STATION ACTIVE</h3>
                <p style={{ margin: 0, color: '#6a6a7a', fontSize: '14px' }}>{lang === 'fa' ? 'ماژول با موفقیت با معماری سرورلس ورسل یکپارچه شد. در حال مانیتورینگ...' : 'Module securely mounted on Vercel infrastructure. Data stream idle.'}</p>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
}
