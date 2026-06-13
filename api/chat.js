import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [lang, setLang] = useState('en');
  const [view, setView] = useState('chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef(null);

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
      // 🎯 اتصال دقیق به ساختار فایل chat.js شما با ارسال پارامترهای prompt و lang
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText, fileParts: [], lang })
      });
      const data = await res.json();
      
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        text: res.ok && data.response ? data.response : (lang === 'fa' ? 'خطا در دریافت پاسخ از سرور مرکزی.' : 'Central core response failed.') 
      }]);
    } catch {
      setChatHistory(prev => [...prev, { role: 'ai', text: lang === 'fa' ? 'خطای اتصال به شبکه ابری.' : 'Cloud network connectivity error.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>D&T Ai-TECH | Workspace Core</title>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Vazirmatn:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <style>{`
          body { margin: 0; padding: 0; background: #07070a; color: #e8e8f0; font-family: 'Space Grotesk', 'Vazirmatn', sans-serif; overflow: hidden; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        `}</style>
      </Head>
      
      <div style={{ display: 'flex', width: '100vw', height: '100vh', direction: lang === 'fa' ? 'rtl' : 'ltr' }}>
        {/* سایدبار لوکس پلتفرم */}
        <aside style={{ width: sidebarCollapsed ? '70px' : '260px', background: '#0e0e14', transition: 'width 0.2s', display: 'flex', flexDirection: 'column', borderRight: lang === 'en' ? '1px solid rgba(255,255,255,0.06)' : 'none', borderLeft: lang === 'fa' ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
          <div style={{ height: '64px', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ background: 'transparent', border: 'none', color: '#7a7a9a', cursor: 'pointer', fontSize: '20px' }}>☰</button>
            {!sidebarCollapsed && <span style={{ fontWeight: '600', letterSpacing: '0.5px' }}>D&T <span style={{ color: '#00e5ff' }}>Ai-TECH</span></span>}
          </div>
          <div style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div onClick={() => setView('chat')} style={{ padding: '12px', borderRadius: '12px', background: view === 'chat' ? 'rgba(255,255,255,0.04)' : 'transparent', color: view === 'chat' ? '#00e5ff' : '#e8e8f0', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>💬 {!sidebarCollapsed && (lang === 'fa' ? 'استودیو گفتگو' : 'Chat Studio')}</div>
            <div onClick={() => setView('settings')} style={{ padding: '12px', borderRadius: '12px', background: view === 'settings' ? 'rgba(255,255,255,0.04)' : 'transparent', color: view === 'settings' ? '#9b6dff' : '#e8e8f0', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>⚙️ {!sidebarCollapsed && (lang === 'fa' ? 'تنظیمات هسته' : 'Core Settings')}</div>
          </div>
        </aside>

        {/* فریم محتوای اصلی */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#07070a' }}>
          <header style={{ height: '64px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ color: '#7a7a9a', fontSize: '13px', fontWeight: '500' }}>WORKSPACE / {view.toUpperCase()}</span>
            <button onClick={() => setLang(l => l === 'en' ? 'fa' : 'en')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#00e5ff', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>{lang === 'en' ? 'FA' : 'EN'}</button>
          </header>

          <div style={{ flex: 1, padding: '32px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', maxWidth: '800px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
            {view === 'chat' ? (
              <>
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '24px', paddingRight: '4px' }}>
                  {chatHistory.length === 0 && (
                    <div style={{ textAlign: 'center', marginTop: '10%' }}>
                      <h1 style={{ fontSize: '32px', fontWeight: '300', color: '#fff', marginBottom: '8px' }}>{lang === 'fa' ? 'کجا شروع کنیم؟' : 'Where should we start?'}</h1>
                      <p style={{ color: '#7a7a9a', fontSize: '14px' }}>{lang === 'fa' ? 'دستیار هوشمند مهندسی محاسباتی D&T Ai-TECH' : 'Computational Intelligence Engineering Copilot'}</p>
                    </div>
                  )}
                  {chatHistory.map((msg, i) => (
                    <div key={i} style={{ marginBottom: '20px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                      <div style={{ display: 'inline-block', padding: '14px 20px', borderRadius: '20px', background: msg.role === 'user' ? '#141420' : 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', maxWidth: '85%' }}>
                        <small style={{ color: msg.role === 'user' ? '#00e5ff' : '#9b6dff', fontWeight: 'bold', fontSize: '11px', display: 'block', marginBottom: '4px' }}>{msg.role === 'user' ? (lang === 'fa' ? 'شما' : 'YOU') : 'D&T AI'}</small>
                        <div style={{ fontSize: '14.5px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                      </div>
                    </div>
                  ))}
                  {loading && <div style={{ color: '#7a7a9a', fontSize: '13px' }}>⏳ D&T Core Engine is thinking...</div>}
                  <div ref={chatBottomRef} />
                </div>
                
                {/* باکس ورودی پیام اصلی */}
                <div style={{ display: 'flex', gap: '12px', background: 'rgba(20,20,32,0.6)', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 8px 8px 16px', borderRadius: '32px', alignItems: 'center' }}>
                  <input type="text" value={promptText} onChange={e => setPromptText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder={lang === 'fa' ? 'پروژه جدید یا سوال خود را تعریف کنید...' : 'Ask D&T Ai-TECH or enter code syntax...'} style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '15px' }} />
                  <button onClick={handleSend} style={{ background: 'linear-gradient(90deg, #1a8fff, #9b6dff)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '24px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>SEND</button>
                </div>
              </>
            ) : (
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '400', marginBottom: '20px' }}>{lang === 'fa' ? 'تنظیمات هسته مرکزی' : 'Core Engine Settings'}</h2>
                <div style={{ background: '#141420', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '500' }}>{lang === 'fa' ? 'زبان پیش‌فرض محیط کاربری' : 'Primary Workspace Language'}</div>
                      <div style={{ fontSize: '13px', color: '#7a7a9a', marginTop: '4px' }}>{lang === 'fa' ? 'تغییر راست‌چین و تراز کدهای خروجی' : 'Set default layout direction and aligning rules'}</div>
                    </div>
                    <select value={lang} onChange={e => setLang(e.target.value)} style={{ background: '#07070a', color: '#fff', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }}>
                      <option value="en">English (US)</option>
                      <option value="fa">Persian (FA)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
