<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>D&T Ai-TECH | Intelligent Workspace</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Vazirmatn:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #0b0b0e;
            --bg-sidebar: #13131a;
            --bg-card: #1e1e2f;
            --cyan: #00e5ff;
            --purple: #9b6dff;
            --pink: #e040a0;
            --blue: #1a8fff;
            --text: #e8e8f0;
            --text-muted: #9090a8;
            --border: rgba(255, 255, 255, 0.07);
            --sidebar-width: 260px;
            --sidebar-collapsed-width: 68px;
            --ease: cubic-bezier(0.4, 0, 0.2, 1);
            --gemini-aura: radial-gradient(circle at 50% 50%, rgba(155, 109, 255, 0.08) 0%, rgba(0, 229, 255, 0.04) 50%, transparent 70%);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-user-select: none; user-select: none; }
        html, body { height: 100%; overflow: hidden; background: var(--bg); color: var(--text); font-family: 'Space Grotesk', 'Vazirmatn', sans-serif; }
        body { display: flex; width: 100vw; height: 100vh; }

        /* ====== COLLAPSIBLE SIDEBAR ====== */
        .sidebar {
            width: var(--sidebar-width); min-width: var(--sidebar-width); background: var(--bg-sidebar);
            border-right: 1px solid var(--border); display: flex; flex-direction: column;
            transition: width 0.3s var(--ease), min-width 0.3s var(--ease); z-index: 100; flex-shrink: 0; position: relative;
        }
        .sidebar.collapsed { width: var(--sidebar-collapsed-width); min-width: var(--sidebar-collapsed-width); }
        
        .sidebar-top { height: 64px; display: flex; align-items: center; padding: 0 14px; gap: 12px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
        
        .toggle-btn {
            width: 40px; height: 40px; border-radius: 50%; background: transparent; border: none; color: var(--text-muted);
            cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s, color 0.2s; flex-shrink: 0;
        }
        .toggle-btn:hover { background: rgba(255, 255, 255, 0.06); color: var(--text); }
        .toggle-btn svg { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 2; }

        .brand { display: flex; align-items: center; gap: 12px; white-space: nowrap; transition: opacity 0.2s var(--ease); }
        .sidebar.collapsed .brand { opacity: 0; pointer-events: none; }
        
        /* مهار کاملاً اختصاصی هندسه تصویر لوگوی حسام */
        .logo-img-fix { width: 32px; height: 32px; object-fit: contain; flex-shrink: 0; filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.25)); }
        .brand-name { font-size: 15px; font-weight: 700; letter-spacing: 0.3px; }
        .brand-name span { background: linear-gradient(90deg, var(--purple), var(--cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        .nav { padding: 12px 8px; display: flex; flex-direction: column; gap: 4px; flex: 1; overflow-y: auto; }
        .nav-label { font-size: 10px; font-weight: 600; letter-spacing: 1.2px; color: rgba(155, 109, 255, 0.4); padding: 12px 14px 4px; white-space: nowrap; }
        .sidebar.collapsed .nav-label { opacity: 0; }

        .ni {
            display: flex; align-items: center; gap: 14px; padding: 11px 14px; border-radius: 14px; color: var(--text-muted);
            cursor: pointer; font-size: 13.5px; font-weight: 500; white-space: nowrap; transition: all 0.2s; position: relative;
        }
        .ni:hover { background: rgba(255, 255, 255, 0.03); color: var(--text); }
        .ni.on { background: rgba(155, 109, 255, 0.12); color: var(--cyan); }
        .ni.on::before { content: ''; position: absolute; left: 0; top: 25%; bottom: 25%; width: 3px; background: linear-gradient(180deg, var(--purple), var(--cyan)); border-radius: 0 4px 4px 0; }
        
        .ni-ico { width: 20px; height: 20px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .ni-ico svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 2; }
        
        .sidebar.collapsed .ni { padding: 11px; width: 44px; height: 44px; border-radius: 50%; justify-content: center; margin: 0 auto; }
        .sidebar.collapsed .ni::before { display: none; }
        .sidebar.collapsed .ni-txt { display: none; }
        .sidebar-bot { padding: 8px; border-top: 1px solid var(--border); }

        /* ====== MAIN CANVAS (GEMINI STYLE) ====== */
        .main { flex: 1; display: flex; flex-direction: column; min-width: 0; position: relative; overflow: hidden; height: 100vh; }
        .main::before { content: ''; position: absolute; inset: 0; background: var(--gemini-aura); pointer-events: none; z-index: 0; }
        
        .topbar { height: 64px; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); background: rgba(11, 11, 14, 0.5); backdrop-filter: blur(25px); position: relative; z-index: 10; }
        .topbar-t { font-size: 14px; font-weight: 500; color: var(--text-muted); }
        
        .content { flex: 1; display: flex; flex-direction: column; overflow-y: auto; position: relative; z-index: 1; padding: 24px; height: calc(100vh - 64px - 100px); }

        /* Central Workspace Greetings */
        .greet { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 24px; width: 100%; max-width: 720px; margin: 0 auto; }
        .greet-logo-box { width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 0 25px rgba(0, 229, 255, 0.35)); animation: floatG 4s ease-in-out infinite; }
        .main-logo-fix { width: 100%; height: 100%; object-fit: contain; }
        @keyframes floatG { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        
        .greet h1 { font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 300; background: linear-gradient(135deg, #ffffff 40%, #71719c 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.5px; }
        .greet p { font-size: 14.5px; color: var(--text-muted); max-width: 520px; line-height: 1.75; }

        .chips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; max-width: 620px; width: 100%; }
        .chip { padding: 10px 18px; border: 1px solid var(--border); border-radius: 25px; font-size: 13px; color: var(--text); cursor: pointer; background: rgba(255, 255, 255, 0.02); transition: all 0.2s var(--ease); backdrop-filter: blur(10px); }
        .chip:hover { border-color: rgba(0, 229, 255, 0.3); background: rgba(0, 229, 255, 0.05); transform: translateY(-1px); }

        /* Chat Core Logs layout */
        .chat-container { display: none; flex-direction: column; gap: 18px; width: 100%; max-width: 760px; margin: 0 auto; overflow-y: auto; }
        .chat-container.on { display: flex; }
        .mrow { display: flex; width: 100%; }
        .mrow.u { justify-content: flex-end; }
        .mrow.a { justify-content: flex-start; gap: 14px; }
        .bub { max-width: 82%; padding: 14px 20px; border-radius: 20px; font-size: 14.5px; line-height: 1.7; word-break: break-word; }
        .bub.u { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px 20px 4px 20px; text-align: left; }
        .bub.a { background: rgba(255, 255, 255, 0.01); border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 4px 20px 20px 20px; backdrop-filter: blur(12px); unicode-bidi: plaintext; text-align: left; }
        .bub.ld { color: var(--cyan); font-style: italic; animation: pulseG 1.5s infinite; }
        .bub b { font-weight: 600; font-size: 11px; color: var(--text-muted); display: block; margin-bottom: 6px; }
        @keyframes pulseG { 0%,100% { opacity:0.6; } 50% { opacity:1; } }

        /* ====== DYNAMIC VIEW MODES ====== */
        .view { display: none; flex-direction: column; width: 100%; max-width: 900px; margin: 0 auto; gap: 20px; }
        .view.on { display: flex; }
        .vh { text-align: center; padding: 10px 0; }
        .vh h2 { font-size: 24px; font-weight: 600; background: linear-gradient(135deg, var(--purple), var(--cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 6px; }
        .vh p { font-size: 13px; color: var(--text-muted); }

        /* Deep Search Centered Box */
        .search-center-container { display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; max-width: 600px; margin: auto; gap: 20px; padding: 40px 0; }
        .swrap { position: relative; width: 100%; }
        .swrap input { width: 100%; padding: 16px 20px 16px 54px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 18px; color: var(--text); font-size: 15px; outline: none; transition: border-color 0.2s; text-align: left; }
        .swrap input:focus { border-color: rgba(0, 229, 255, 0.3); }
        .sico { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--cyan); cursor: pointer; display: flex; align-items: center; }
        .sico svg { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 2; }
        .sres { width: 100%; background: var(--bg-card); border: 1px solid var(--border); border-radius: 18px; padding: 20px; font-size: 14px; color: var(--text); line-height: 1.8; display: none; text-align: left; }

        .pgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; width: 100%; }
        .pcard { background: var(--bg-card); border: 1px solid var(--border); border-radius: 18px; padding: 18px; cursor: pointer; transition: all 0.2s var(--ease); backdrop-filter: blur(10px); }
        .pcard:hover { border-color: rgba(0, 229, 255, 0.2); transform: translateY(-2px); }
        .pcard h3 { font-size: 14px; font-weight: 600; margin-bottom: 6px; }
        .pcard p { font-size: 12.5px; color: var(--text-muted); line-height: 1.6; }
        .ptag { display: inline-block; padding: 3px 10px; font-size: 10px; font-weight: 700; border-radius: 8px; margin-top: 12px; background: rgba(124, 58, 237, 0.12); color: var(--purple); border: 1px solid rgba(124, 58, 237, 0.18); }

        /* Code Library */
        .lib-tabs { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 8px; }
        .lib-tab { padding: 8px 18px; font-size: 12.5px; font-weight: 500; border-radius: 30px; border: 1px solid var(--border); color: var(--text-muted); cursor: pointer; transition: all 0.2s; background: transparent; }
        .lib-tab.on, .lib-tab:hover { border-color: rgba(0, 229, 255, 0.3); color: var(--cyan); background: rgba(0, 229, 255, 0.03); }
        .ccard { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; margin-bottom: 12px; width: 100%; }
        .cch { padding: 12px 18px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
        .clang { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 6px; background: rgba(0, 229, 255, 0.06); color: var(--cyan); border: 1px solid rgba(0, 229, 255, 0.12); }
        .ccard pre { padding: 18px; font-size: 12px; color: var(--text); font-family: 'Courier New', monospace; overflow-x: auto; background: rgba(0, 0, 0, 0.2); line-height: 1.75; text-align: left; }

        .dropz { width: 100%; max-width: 520px; height: 180px; border: 2px dashed rgba(0, 229, 255, 0.16); border-radius: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; cursor: pointer; background: rgba(0, 229, 255, 0.01); margin: 20px auto; }
        .dropz:hover { border-color: var(--cyan); background: rgba(0, 229, 255, 0.03); }

        /* ====== FLOATING CONTROL BAR ====== */
        .inp-wrap { padding: 12px 24px 24px; position: relative; z-index: 10; flex-shrink: 0; width: 100%; background: transparent; }
        .findc { font-size: 12px; color: var(--cyan); padding: 4px 0 8px 4px; display: none; align-items: center; gap: 6px; max-width: 760px; margin: 0 auto; }
        .findc.on { display: flex; }
        .findc svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; }
        
        .ibox { max-width: 760px; margin: 0 auto; background: rgba(20, 20, 27, 0.8); backdrop-filter: blur(35px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 32px; padding: 8px 16px; display: flex; align-items: flex-end; gap: 12px; box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5); }
        .lacts { display: flex; gap: 4px; align-items: center; padding-bottom: 4px; }
        .ab { width: 38px; height: 38px; border-radius: 50%; background: transparent; border: none; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
        .ab:hover { background: rgba(255, 255, 255, 0.05); color: var(--text); }
        .ab svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 2; }
        
        textarea#pr { flex: 1; background: transparent; border: none; color: var(--text); font-size: 15px; font-family: inherit; resize: none; outline: none; line-height: 1.65; padding: 8px 0; max-height: 140px; text-align: left; }
        textarea#pr::placeholder { color: var(--text-muted); }
        .racts { display: flex; align-items: center; padding-bottom: 3px; }
        
        .sbtn { height: 40px; padding: 0 24px; border-radius: 20px; border: none; font-family: inherit; background: linear-gradient(270deg, var(--blue), var(--purple), var(--pink), var(--cyan)); background-size: 300% 300%; animation: gradientS 4s ease infinite; color: #fff; font-size: 13px; font-weight: 700; cursor: pointer; transition: transform 0.15s; }
        .sbtn:hover { transform: scale(1.02); }
        @keyframes gradientS { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

        /* ====== MOBILE BOT NAV ====== */
        .mnav { display: none; position: fixed; bottom: 0; left: 0; right: 0; height: 64px; background: rgba(15, 15, 22, 0.9); backdrop-filter: blur(30px); border-top: 1px solid var(--border); z-index: 100; }
        .mnav-in { display: flex; height: 100%; }
        .mni { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; flex: 1; cursor: pointer; color: var(--text-muted); font-size: 10px; font-weight: 500; }
        .mni.on { color: var(--cyan); }
        .mni svg { width: 22px; height: 22px; stroke: currentColor; fill: none; stroke-width: 2; }

        /* ====== RESPONSIVE METRICS ====== */
        @media(max-width:768px){
            .sidebar { display: none; }
            .mnav { display: block; }
            body { padding-bottom: 64px; }
            .topbar { background: var(--bg2); height: 56px; border-bottom: 1px solid var(--border); }
            .greet h1 { font-size: 1.6rem; }
            .bub { max-width: 90%; font-size: 13.5px; }
            .inp-wrap { padding: 10px; }
            .ibox { border-radius: 24px; padding: 6px 6px 6px 12px; }
            .sbtn { height: 36px; padding: 0 16px; font-size: 12px; border-radius: 18px; }
            .content { padding: 12px; height: calc(100vh - 56px - 64px) !important; overflow-y: auto; }
        }
    </style>
</head>
<body>

<aside class="sidebar" id="sidebar">
    <div class="sidebar-top">
        <button class="toggle-btn" onclick="toggleSB()" aria-label="Toggle sidebar">
            <svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div class="brand">
            <img src="/D&T%20logo%20cdr.png" class="logo-img-fix" alt="D&T Logo">
            <div class="brand-text"><span class="brand-name"><span class="dt">D&T</span> Ai-TECH</span></div>
        </div>
    </div>
    <nav class="nav">
        <div class="nav-label">WORKSPACE</div>
        <div class="ni on" data-v="chat" onclick="sw('chat',this)"><div class="ni-ico"><svg viewBox="0 0 24 24"><path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12 L9 9L12 2Z"/></svg></div><span class="ni-txt">New Chat</span></div>
        <div class="ni" data-v="project" onclick="sw('project',this)"><div class="ni-ico"><svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div><span class="ni-txt">Projects</span></div>
        <div class="ni" data-v="search" onclick="sw('search',this)"><div class="ni-ico"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div><span class="ni-txt">Deep Search</span></div>
        <div class="nav-label">REPOS &AMP; IMAGES</div>
        <div class="ni" data-v="images" onclick="sw('images',this)"><div class="ni-ico"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div><span class="ni-txt">Image Studio</span></div>
        <div class="ni" data-v="library" onclick="sw('library',this)"><div class="ni-ico"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div><span class="ni-txt">Code Library</span></div>
    </nav>
    <div class="sidebar-bottom">
        <div class="ni" onclick="alert('Settings Core Active')">
            <div class="ni-ico"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div>
            <span class="ni-txt">System Settings</span>
        </div>
    </div>
</aside>

<main class="main">
    <div class="topbar">
        <span class="topbar-t" id="tb-t">AI Studio</span>
        <div class="tbr"><button class="ibtn" title="Reset Workspace" onclick="newChat()"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button></div>
    </div>
    
    <div class="content">
        <div id="v-chat" style="flex:1; display:flex; flex-direction:column; overflow:hidden">
            <div class="greet" id="greet">
                <div class="greet-logo-box">
                    <img src="/D&T%20logo%20cdr.png" class="main-logo-fix" alt="D&T Core Logo">
                </div>
                <h1>Where should we start?</h1>
                <p>Advanced computational engineering copilot for generating Grasshopper Python workflows and circuit optimization.</p>
                <div class="chips">
                    <div class="chip" onclick="useChip(this)">Generate Grasshopper Python Script</div>
                    <div class="chip" onclick="useChip(this)">Optimize Electronics Circuit</div>
                    <div class="chip" onclick="useChip(this)">Parametric Geometry Framework</div>
                </div>
            </div>
            <div class="chat-container" id="chatbox"></div>
        </div>

        <div id="v-project" class="view">
            <div class="vh"><h2>Projects Hub</h2><p>Manage advanced multi-dimensional computational workspaces</p></div>
            <div class="pgrid">
                <div class="pcard"><h3>D&T AI Interface</h3><p>Next-gen glassmorphic responsive front-end dashboard architecture</p><span class="ptag">Frontend</span></div>
                <div class="pcard"><h3>Computational Geometry</h3><p>Generative parametric scripts mapping out RhinoCommon topology</p><span class="ptag">Rhino / GH</span></div>
                <div class="pcard"><h3>Hardware Pipeline</h3><p>Embedded systems design focusing on microcontrollers and PCB layouts</p><span class="ptag">Electronics</span></div>
            </div>
        </div>

        <div id="v-search" class="view">
            <div class="vh"><h2>Deep Search Core</h2><p>Cross-examine massive parametric databases and engineering manifests</p></div>
            <div class="search-center-container">
                <div class="swrap">
                    <input id="dsi" type="text" placeholder="Search components or algorithmic libraries..." onkeydown="if(event.key==='Enter')doSrch()"/>
                    <button class="sico" onclick="doSrch()"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></button>
                </div>
                <div id="sres" class="sres"></div>
            </div>
        </div>

        <div id="v-images" class="view">
            <div class="vh"><h2>Image Studio</h2><p>Upload circuit blueprints, wireframes, or architectural sketches for AI dissection</p></div>
            <div style="display:flex; flex-direction:column; align-items:center; gap:14px; width:100%;">
                <div class="dropz" onclick="document.getElementById('img-up').click()" ondragover="event.preventDefault()" ondrop="imgDrop(event)">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <p style="color:var(--text-muted); font-size:13px">Drop technical asset here or click to choose file</p>
                </div>
                <input type="file" id="img-up" accept="image/*" style="display:none" onchange="prevImg(this)">
                <div id="img-pw" style="display:none; flex-direction:column; align-items:center; gap:12px; width:100%; max-width:500px">
                    <img id="img-p" style="max-width:100%; max-height:280px; border-radius:14px; border:1px solid var(--border)" src="" alt="">
                    <button class="sbtn" style="height:38px; padding:0 24px" onclick="analyzeImg()">Analyze Frame Model</button>
                </div>
                <div id="img-res" style="display:none; background:var(--bg-card); border:1px solid var(--border); border-radius:14px; padding:16px 18px; font-size:13px; color:var(--text-muted); line-height:1.8; width:100%; max-width:500px"></div>
            </div>
        </div>

        <div id="v-library" class="view">
            <div class="vh"><h2>Code Library</h2><p>Centralized repository housing foundational scripts and electrical logic</p></div>
            <div class="lib-tabs">
                <div class="lib-tab on" onclick="libF('all',this)">All Scripts</div>
                <div class="lib-tab" onclick="libF('gh',this)">Rhino / GH</div>
                <div class="lib-tab" onclick="libF('hw',this)">Electronics</div>
            </div>
            <div class="ccard" data-l="gh"><div class="cch"><span>Grasshopper Point Grid Generator</span><span class="clang">Python</span></div><pre>import Rhino.Geometry as rg
import math
pts = []
for i in range(10):
    z = math.sin(i) * 2
    pts.append(rg.Point3d(i, 0, z))</pre></div>
        </div>
    </div>

    <div class="inp-wrap">
        <div class="findc" id="findc">
            <svg viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            <span id="fnm"></span>
        </div>
        <div class="ibox">
            <div class="lacts">
                <button class="ab" title="Attach file" onclick="document.getElementById('finp').click()">
                    <svg viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                </button>
                <button class="ab" title="Image Studio" onclick="sw('images',null)">
                    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </button>
            </div>
            <input type="file" id="finp" style="display:none" onchange="onFile(this)">
            <textarea id="pr" rows="1" placeholder="Ask D&T Ai-TECH or upload computational assets..." oninput="ar(this)" onkeydown="ok(event)"></textarea>
            <div class="racts">
                <button class="sbtn" onclick="send()">SEND</button>
            </div>
        </div>
    </div>
</main>

<nav class="mnav">
    <div class="mnav-in">
        <div class="mni on" data-v="chat" onclick="mSw('chat',this)"><svg viewBox="0 0 24 24"><path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"/></svg>Chat</div>
        <div class="mni" data-v="project" onclick="mSw('project',this)"><svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>Projects</div>
        <div class="mni" data-v="search" onclick="mSw('search',this)"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>Search</div>
        <div class="mni" data-v="images" onclick="mSw('images',this)"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>Images</div>
        <div class="mni" data-v="library" onclick="mSw('library',this)"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>Library</div>
    </div>
</nav>

<script>
let selFile=null,started=false;
const VT={chat:'AI Studio',project:'Projects Hub',search:'Deep Search',images:'Image Studio',library:'Code Library'};

function toggleSB(){document.getElementById('sidebar').classList.toggle('collapsed')}

function sw(name,el){
    document.getElementById('v-chat').style.display=name==='chat'?'flex':'none';
    ['project','search','images','library'].forEach(n=>{
        const v = document.getElementById('v-'+n);
        if(v) v.classList.toggle('on', n===name);
    });
    document.querySelectorAll('.ni').forEach(i=>i.classList.remove('on'));
    const targetNi = document.querySelector(`.ni[data-v="${name}"]`);
    if(targetNi) targetNi.classList.add('on');
    document.getElementById('tb-t').textContent=VT[name]||name;
}

function mSw(name,el){
    document.querySelectorAll('.mni').forEach(i=>i.classList.remove('on'));
    el.classList.add('on');
    sw(name,null);
}

function newChat(){
    started=false;
    document.getElementById('chatbox').innerHTML='';
    document.getElementById('chatbox').classList.remove('on');
    document.getElementById('greet').style.display='flex';
    document.getElementById('pr').value='';
    document.getElementById('findc').classList.remove('on');
    selFile=null;
    sw('chat',null);
}

function useChip(el){document.getElementById('pr').value=el.textContent;document.getElementById('pr').focus();}
function ar(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,140)+'px';}
function ok(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}

function onFile(inp){if(inp.files.length){selFile=inp.files[0];document.getElementById('findc').classList.add('on');document.getElementById('fnm').textContent='✓ '+selFile.name;}}

async function send(){
    const txt=document.getElementById('pr').value.trim();
    if(!txt&&!selFile) return;
    if(!started){started=true;document.getElementById('greet').style.display='none';document.getElementById('chatbox').classList.add('on');}
    const cb=document.getElementById('chatbox');
    const fl=selFile?`<br><small style="color:var(--cyan);font-size:11px">📎 ${selFile.name}</small>`:'';
    
    cb.innerHTML+=`<div class="mrow u"><div class="bub u"><b>You</b><br>${txt||'Asset file attached'}${fl}</div></div>`;
    document.getElementById('pr').value='';document.getElementById('pr').style.height='auto';
    
    const id='a'+Date.now();
    cb.innerHTML+=`<div class="mrow a"><div class="av">${miniLogo()}</div><div class="bub a ld" id="${id}">D&T Core processing...</div></div>`;
    cb.scrollTop=cb.scrollHeight;
    
    let fp=[];
    if(selFile){fp=[{inlineData:{data:await b64(selFile),mimeType:selFile.type}}];}
    selFile=null;document.getElementById('findc').classList.remove('on');
    
    try{
        const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:txt,fileParts:fp})});
        const d=await r.json();const el=document.getElementById(id);el.classList.remove('ld');
        el.innerHTML=r.ok&&d.response?`<b>D&T Ai-TECH</b><br>${d.response}`:`<b>System Error:</b> Core failed. Check Gemini API variables on Vercel.`;
    }catch{const el=document.getElementById(id);el.classList.remove('ld');el.innerHTML=`<b>Connection Error:</b> Check Vercel serverless metrics dashboard.`;}
    cb.scrollTop=cb.scrollHeight;
}

function b64(f){return new Promise(r=>{const rd=new FileReader();rd.onload=()=>r(rd.result.split(',')[1]);rd.readAsDataURL(f);});}
function miniLogo(){ return `<img src="/D&T%20logo%20cdr.png" style="width:16px;height:16px;object-fit:contain;">`; }

async function doSrch(){
    const q=document.getElementById('dsi').value.trim();if(!q)return;
    const box=document.getElementById('sres');box.style.display='block';box.innerHTML='<span style="color:var(--cyan)">Querying databases...</span>';
    try{const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:`Deep search deployment analysis for: ${q}`})});
        const d=await r.json();box.innerHTML=r.ok&&d.response?d.response:'Server unreachable.';}
    catch{box.innerHTML='Connection error.';}
}

function imgDrop(e){e.preventDefault();const f=e.dataTransfer.files[0];if(f&&f.type.startsWith('image/'))prvF(f);}
function prevImg(inp){if(inp.files[0])prvF(inp.files[0]);}
function prvF(file){const r=new FileReader();r.onload=e=>{document.getElementById('img-p').src=e.target.result;document.getElementById('img-pw').style.display='flex';document.querySelector('.dropz').style.display='none';};r.readAsDataURL(file);window._imgFile=file;}

async function analyzeImg(){
    const box=document.getElementById('img-res');box.style.display='block';box.textContent='Dissecting visual framework topologies...';box.style.color='var(--cyan)';
    try{const d64=await b64(window._imgFile);const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:'Analyze this architectural sketch or circuit layout.',fileParts:[{inlineData:{data:d64,mimeType:window._imgFile.type}}]})});
        const d=await r.json();if(r.ok&&d.response){box.textContent=d.response;box.style.color='var(--text-muted)';}else{box.textContent='Analysis failed.';box.style.color='var(--text-muted)';}}
    catch{box.textContent='Network timeout error.';box.style.color='var(--text-muted)';}
}

function libF(l,el){document.querySelectorAll('.lib-tab').forEach(t=>t.classList.remove('on'));el.classList.add('on');document.querySelectorAll('.code-card').forEach(c=>{c.style.display=(l==='all'||c.dataset.l===l)?'block':'none';});}

document.addEventListener('keydown', function(e) {
    if (e.keyCode == 123) { e.preventDefault(); return false; } 
    if (e.ctrlKey && e.shiftKey && e.keyCode == 73) { e.preventDefault(); return false; } 
    if (e.ctrlKey && e.shiftKey && e.keyCode == 67) { e.preventDefault(); return false; } 
    if (e.ctrlKey && e.keyCode == 85) { e.preventDefault(); return false; } 
});
</script>
</body>
</html>
