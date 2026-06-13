import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [promptInput, setPromptInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [started, setStarted] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [systemTheme, setSystemTheme] = useState('dark');
  const [activeView, setActiveView] = useState('chat');
  const chatboxRef = useRef(null);

  const toggleLanguageSystem = () => {
    setCurrentLang(prev => prev === 'en' ? 'fa' : 'en');
  };

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendChat = async () => {
    const txt = promptInput.trim();
    if (!txt) return;

    if (!started) setStarted(true);

    setChatMessages(prev => [...prev, { sender: 'user', text: txt }]);
    setPromptInput('');

    const loadingId = 'loading_' + Date.now();
    setChatMessages(prev => [...prev, { sender: 'ai', id: loadingId, text: 'D&T Core processing...' }]);

    try {
      // ارتباط مستقیم و استاندارد با بک‌اَند بدون خراب کردن بیلد ورسل
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: txt, lang: currentLang })
      });
      const data = await res.json();
      
      setChatMessages(prev => prev.map(m => m.id === loadingId ? {
        sender: 'ai',
        text: res.ok && data.response ? data.response : 'System Error: Connection failed.'
      } : m));
    } catch {
      setChatMessages(prev => prev.map(m => m.id === loadingId ? {
        sender: 'ai',
        text: 'Connection Error: Cloud function timeout.'
      } : m));
    }
  };

  return (
    <>
      <Head>
        <title>D&T Ai-TECH | Workspace</title>
      </Head>
      <div style={{
        display: 'flex', width: '100vw', height: '100vh', background: '#07070a', color: '#e8e8f0',
        fontFamily: 'sans-serif', overflow: 'hidden', direction: currentLang === 'fa' ? 'rtl' : 'ltr'
      }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '64px', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '14px', color: '#7a7a9a', fontWeight: 'bold' }}>D&T AI Studio Workspace</span>
            <button onClick={toggleLanguageSystem} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#00e5ff', cursor: 'pointer' }}>
              {currentLang === 'en' ? 'FA / EN' : 'EN / FA'}
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', overflowY: 'auto' }}>
            {!started ? (
              <div style={{ margin: 'auto', textAlign: 'center' }}>
                <img src="/logo.png" style={{ width: '100px', marginBottom: '20px', filter: 'drop-shadow(0 0 15px rgba(0,229,255,0.3))' }} alt="D&T Logo" />
                <h1 style={{ fontSize: '2.5rem', fontWeight: '300', marginBottom: '10px', color: '#fff' }}>
                  {currentLang === 'fa' ? 'کجا شروع کنیم؟' : 'Where should we start?'}
                </h1>
                <p style={{ color: '#7a7a9a', maxWidth: '500px', fontSize: '14px', lineHeight: '1.6' }}>
                  {currentLang === 'fa' 
                    ? 'دستیار مهندسی محاسباتی هوشمند جهت تولید اسکریپت‌های پایتون گراس‌هاپر و بهینه‌سازی مدارهای الکترونیکی فعال روی dt-ai.tech.' 
                    : 'Advanced computational engineering copilot active on dt-ai.tech.'}
                </p>
              </div>
            ) : (
              <div ref={chatboxRef} style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} style={{ marginBottom: '15px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                    <div style={{ display: 'inline-block', padding: '12px 18px', borderRadius: '18px', background: msg.sender === 'user' ? '#141420' : 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <b style={{ color: msg.sender === 'user' ? '#00e5ff' : '#9b6dff' }}>{msg.sender === 'user' ? (currentLang === 'fa' ? 'شما' : 'You') : 'D&T AI'}</b><br />
                      <div style={{ marginTop: '5px', whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ maxWidth: '760px', width: '100%', margin: '0 auto', display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={promptInput} 
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder={currentLang === 'fa' ? 'سوال خود را بپرسید یا پروژه جدید را تعریف کنید...' : 'Ask D&T Ai-TECH or enter prompt...'}
                style={{ flex: 1, background: '#12121a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '14px 20px', color: '#fff', outline: 'none' }}
              />
              <button onClick={handleSendChat} style={{ padding: '0 24px', borderRadius: '24px', background: 'linear-gradient(90deg, #1a8fff, #9b6dff)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                SEND
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
