import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [promptInput, setPromptInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [started, setStarted] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [systemTheme, setSystemTheme] = useState('dark');
  const [activeView, setActiveView] = useState('chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: txt, systemText: currentLang === 'fa' ? "You are D&T AI Engineering Assistant. Speak in Persian." : "You are D&T AI Engineering Assistant." })
      });
      const data = await res.json();
      
      setChatMessages(prev => prev.map(m => m.id === loadingId ? {
        sender: 'ai',
        text: res.ok && data.success ? data.reply : 'System Error: Connection failed.'
      } : m));
    } catch (error) {
      setChatMessages(prev => prev.map(m => m.id === loadingId ? {
        sender: 'ai',
        text: 'Connection Error: Cloud function timeout.'
      } : m));
    }
  };

  return (
    <>
      <Head>
        <title>D&T Ai-TECH | Workspace Core</title>
        <style>{`
          body { margin: 0; padding: 0; background: #07070a; color: #e8e8f0; font-family: sans-serif; overflow: hidden; }
          ::-webkit-scrollbar { width: 4px; height: 4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
          .theme-blue { --bg: #050b14; --bg-sidebar: #081220; }
        `}</style>
      </Head>
      
      <div style={{
        display: 'flex', width: '100vw', height: '100vh', background: '#07070a', overflow: 'hidden',
        direction: currentLang === 'fa' ? 'rtl' : 'ltr'
      }}>
        
        {/* سایدبار پیشرفته شبیه به جمنای */}
        <aside style={{
          width: sidebarCollapsed ? '68px' : '260px', background: '#0e0e14',
          borderRight: currentLang === 'en' ? '1px solid rgba(255,255,255,0.06)' : 'none',
          borderLeft: currentLang === 'fa' ? '1px solid rgba(255,255,255,0.06)' : 'none',
          display: 'flex', flexDirection: 'column', transition: 'width 0.3s'
        }}>
          <div style={{ height: '64px', display: 'flex', alignItems: 'center', padding: '0 14px', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ background: 'transparent', border: 'none', color: '#7a7a9a', cursor: 'pointer', fontSize: '20px' }}>☰</button>
            {!sidebarCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/logo.png" style={{ width: '32px', height: '32px', objectFit: 'contain' }} alt="Logo" />
                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>D&T <span style={{ color: '#00e5ff' }}>Ai-TECH</span></span>
              </div>
            )}
          </div>
          <nav style={{ padding: '12px 8px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(155, 109, 255, 0.1)', color: '#00e5ff', cursor: 'pointer', fontSize: '13.5px' }}>
              ✨ {!sidebarCollapsed ? (currentLang === 'fa' ? 'گفتگوی جدید' : 'New Chat') : '💬'}
            </div>
          </nav>
        </aside>

        {/* بخش اصلی محتوا */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: relative }}>
          <div style={{ height: '64px', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '14px', color: '#7a7a9a', fontWeight: '500' }}>AI Studio</span>
            <button onClick={toggleLanguageSystem} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#00e5ff', cursor: 'pointer', fontWeight: '600' }}>
              {currentLang === 'en' ? 'FA / EN' : 'EN / FA'}
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', overflowY: 'auto' }}>
            {!started ? (
              <div style={{ margin: 'auto', textAlign: 'center' }}>
                <img src="/logo.png" style={{ width: '120px', marginBottom: '20px', filter: 'drop-shadow(0 0 25px rgba(0, 229, 255, 0.35))' }} alt="D&T Logo" />
                <h1 style={{ fontSize: '2.5rem', fontWeight: '300', marginBottom: '10px', color: '#fff' }}>
                  {currentLang === 'fa' ? 'کجا شروع کنیم؟' : 'Where should we start?'}
                </h1>
                <p style={{ color: '#7a7a9a', maxWidth: '500px', fontSize: '14.5px', lineHeight: '1.75', margin: '0 auto' }}>
                  {currentLang === 'fa' ? 'دستیار مهندسی محاسباتی هوشمند پلتفرم D&T Ai-TECH.' : 'Advanced computational engineering copilot for generating workflows.'}
                </p>
              </div>
            ) : (
              <div ref={chatboxRef} style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', maxWidth: '740px', width: '100%', margin: '0 auto' }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} style={{ marginBottom: '18px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                    <div style={{ display: 'inline-block', padding: '14px 20px', borderRadius: '20px', background: msg.sender === 'user' ? '#141420' : 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <b style={{ color: msg.sender === 'user' ? '#00e5ff' : '#9b6dff', display: 'block', marginBottom: '4px', fontSize: '11px' }}>{msg.sender === 'user' ? (currentLang === 'fa' ? 'شما' : 'You') : 'D&T Ai-TECH'}</b>
                      <div style={{ whiteSpace: 'pre-wrap', fontSize: '14.5px', lineHeight: '1.7' }}>{msg.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* کادر ورودی پیام پایین */}
            <div style={{ maxWidth: '760px', width: '100%', margin: '0 auto', display: 'flex', gap: '10px', background: 'transparent' }}>
              <div style={{ flex: 1, background: 'rgba(18, 18, 26, 0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px', padding: '8px 18px', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={promptInput} 
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder={currentLang === 'fa' ? 'سوال خود را اینجا مطرح کنید...' : 'Ask D&T Ai-TECH...'}
                  style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '15px' }}
                />
                <button onClick={handleSendChat} style={{ height: '40px', padding: '0 24px', borderRadius: '20px', border: 'none', background: 'linear-gradient(270deg, #1a8fff, #9b6dff)', color: '#fff', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
                  SEND
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
