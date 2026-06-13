import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

export default function Dashboard() {
  const [selFile, setSelFile] = useState(null);
  const [started, setStarted] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [chatMessages, setChatMessages] = useState([]);
  const [promptInput, setPromptInput] = useState('');
  const [activeView, setActiveView] = useState('chat');
  const [systemTheme, setSystemTheme] = useState('dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const chatboxRef = useRef(null);
  const fileInputRef = useRef(null);

  // تغییر زبان
  const toggleLanguageSystem = () => {
    setCurrentLang(prev => prev === 'en' ? 'fa' : 'en');
  };

  // مدیریت اسکرول چت
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleFileChange = (e) => {
    if (e.target.files.length) {
      setSelFile(e.target.files[0]);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
  };

  // 🎯 ارسال پیام به بک‌اَند واقعی (حل مشکل ایمپورت مستقیم سرور)
  const handleSendChat = async () => {
    const txt = promptInput.trim();
    if (!txt && !selFile) return;

    if (!started) setStarted(true);

    const currentMsgId = 'msg_' + Date.now();
    const newUserMessage = {
      sender: 'user',
      text: txt,
      fileName: selFile ? selFile.name : null
    };

    setChatMessages(prev => [...prev, newUserMessage]);
    setPromptInput('');
    setSelFile(null);

    const loadingId = 'loading_' + Date.now();
    setChatMessages(prev => [...prev, { sender: 'ai', id: loadingId, isLoading: true, text: 'Processing...' }]);

    let fileParts = [];
    if (selFile) {
      fileParts = [{ inlineData: { data: await convertToBase64(selFile), mimeType: selFile.type } }];
    }

    try {
      // ریکوئست استاندارد به API بک‌اَند بدون تداخل در بیلد
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: txt, fileParts, lang: currentLang })
      });
      const data = await res.json();
      
      setChatMessages(prev => prev.map(m => m.id === loadingId ? {
        sender: 'ai',
        id: currentMsgId,
        text: res.ok && data.response ? data.response : 'System Error: Connection failed.'
      } : m));
    } catch {
      setChatMessages(prev => prev.map(m => m.id === loadingId ? {
        sender: 'ai',
        text: 'Connection Error: Serverless cloud engine timed out.'
      } : m));
    }
  };

  return (
    <>
      <Head>
        <title>D&T Ai-TECH | Dashboard</title>
      </Head>
      <div style={{
        display: 'flex', width: '100vw', height: '100vh', background: '#07070a', color: '#e8e8f0',
        fontFamily: "sans-serif", overflow: 'hidden', direction: currentLang === 'fa' ? 'rtl' : 'ltr'
      }}>
        {/* هدر بالایی و وضعیت دکمه زبان */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '64px', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '14px', color: '#7a7a9a' }}>D&T AI Studio Workspace</span>
            <button onClick={toggleLanguageSystem} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#00e5ff', cursor: 'pointer' }}>
              {currentLang === 'en' ? 'FA / EN' : 'EN / FA'}
            </button>
          </div>

          {/* محتوای داخلی فضای کاری */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', overflowY: 'auto' }}>
            {!started ? (
              <div style={{ margin: 'auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '300', marginBottom: '10px' }}>
                  {currentLang === 'fa' ? 'کجا شروع کنیم؟' : 'Where should we start?'}
                </h1>
                <p style={{ color: '#7a7a9a', maxWidth: '500px', fontSize: '14px' }}>
                  Advanced computational engineering copilot active on dt-ai.tech.
                </p>
              </div>
            ) : (
              <div ref={chatboxRef} style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} style={{ marginBottom: '15px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                    <div style={{ display: 'inline-block', padding: '12px', borderRadius: '12px', background: msg.sender === 'user' ? '#141420' : 'rgba(255,255,255,0.02)' }}>
                      <b>{msg.sender === 'user' ? 'You' : 'D&T AI'}</b><br />
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* کادر ورودی پیام پایین دشبورد */}
            <div style={{ maxWidth: '760px', width: '100%', margin: '0 auto', display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={promptInput} 
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder={currentLang === 'fa' ? 'سوال خود را بپرسید...' : 'Ask D&T Ai-TECH...'}
                style={{ flex: 1, background: '#12121a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '12px 20px', color: '#fff', outline: 'none' }}
              />
              <button onClick={handleSendChat} style={{ padding: '0 24px', borderRadius: '24px', background: '#1a8fff', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                SEND
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
