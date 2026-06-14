import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

// ── Logo SVG (inline, no external file needed) ──────────────────────────────
function LogoSVG({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gBody" x1="15" y1="85" x2="85" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1A0055" />
          <stop offset="30%" stopColor="#3D1A8A" />
          <stop offset="65%" stopColor="#7B4FC4" />
          <stop offset="100%" stopColor="#9B80C8" />
        </linearGradient>
        <linearGradient id="gRight" x1="65" y1="20" x2="90" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8A78C0" />
          <stop offset="100%" stopColor="#4A3888" />
        </linearGradient>
        <linearGradient id="gStar" x1="72" y1="32" x2="90" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E8F4FF" />
          <stop offset="40%" stopColor="#A5F3FC" />
          <stop offset="100%" stopColor="#7870B0" />
        </linearGradient>
      </defs>
      <path d="M50 12 C25 12 11 26 11 50 C11 74 25 88 50 88 C62 88 71 83 77 75 L66 68 C61 74 56 78 50 78 C31 78 22 65 22 50 C22 35 31 22 50 22 C56 22 61 24 66 30 L77 23 C71 15 62 12 50 12Z" fill="url(#gBody)" />
      <path d="M66 30 L77 23 L88 40 L77 48 Z" fill="#2E1560" />
      <path d="M66 68 L77 75 L88 60 L77 52 Z" fill="#241248" />
      <path d="M77 23 L88 40 L88 60 L77 75 L66 68 L72 58 L78 50 L72 42 L66 30 Z" fill="url(#gRight)" />
      <rect x="67" y="10" width="22" height="22" rx="5" fill="url(#gRight)" />
      <path d="M83 36 L85 42 L91 44 L85 46 L83 52 L81 46 L75 44 L81 42 Z" fill="url(#gStar)" />
    </svg>
  );
}

// ── Nav items matching architecture roadmap ──────────────────────────────────
const NAV = [
  { id: 'chat',      group: 'WORKSPACE',         icon: '✦',  label: 'New Chat' },
  { id: 'projects',  group: 'WORKSPACE',         icon: '🖥', label: 'Projects' },
  { id: 'engine3d',  group: 'WORKSPACE',         icon: '📦', label: 'DT-3D Engine' },
  { id: 'search',    group: 'WORKSPACE',         icon: '🔍', label: 'Deep Search' },
  { id: 'image',     group: 'REPOS & LIBRARIES', icon: '🖼', label: 'Image Studio' },
  { id: 'library',   group: 'REPOS & LIBRARIES', icon: '📄', label: 'Extended Library' },
];

const QUICK_PROMPTS = [
  'Generate Grasshopper Python Script',
  'Optimize Electronics Circuit',
  'Parametric Geometry Framework',
];

const PROJECTS = [
  { title: 'D&T AI Interface',       desc: 'Next-gen glassmorphic responsive front-end dashboard architecture',       tag: 'Frontend',   color: '#9b6dff' },
  { title: 'Computational Geometry', desc: 'Generative parametric scripts mapping out RhinoCommon topology',            tag: 'Rhino / GH',  color: '#00b4d8' },
  { title: 'Hardware Pipeline',       desc: 'Embedded systems design focusing on microcontrollers and PCB layouts',      tag: 'Electronics', color: '#7b2fff' },
];

const LIBRARY = [
  { title: 'Grasshopper Point Grid Generator',          tag: 'Python',          code: "import Rhino.Geometry as rg\nimport math\npts = []\nfor i in range(10):\n    z = math.sin(i) * 2\n    pts.append(rg.Point3d(i, 0, z))" },
  { title: 'Parametric Structural Optimization Prompt', tag: 'System Prompts', code: "Act as an expert in structural topology optimization. Refactor the given mesh distribution using the Karamba3D matrix variables..." },
];

// ── Inline styles ────────────────────────────────────────────────────────────
const S = {
  root: {
    display: 'flex', width: '100vw', height: '100vh',
    background: '#07070a', color: '#e8e8f0',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    overflow: 'hidden',
  },
  sidebar: (collapsed) => ({
    width: collapsed ? '64px' : '248px',
    background: 'rgba(10,8,22,0.95)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(138,43,226,0.15)',
    display: 'flex', flexDirection: 'column',
    transition: 'width 0.28s cubic-bezier(.4,0,.2,1)',
    overflow: 'hidden', flexShrink: 0, position: 'relative',
  }),
  sbGlow: {
    position: 'absolute', top: -80, left: -80,
    width: 260, height: 260, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(138,43,226,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  sbHeader: {
    height: 64, display: 'flex', alignItems: 'center',
    padding: '0 14px', gap: 10,
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    flexShrink: 0,
  },
  hamburger: {
    background: 'transparent', border: 'none',
    color: '#7a7a9a', cursor: 'pointer', fontSize: 18,
    padding: 4, borderRadius: 6, flexShrink: 0,
    transition: 'color 0.2s',
  },
  brandName: {
    fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap',
    background: 'linear-gradient(90deg,#9B6FDF,#C4A0FF,#00e5ff)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  nav: { padding: '10px 8px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' },
  navGroup: {
    fontSize: 9, color: 'rgba(255,255,255,0.25)',
    letterSpacing: 2, padding: '10px 10px 4px',
    whiteSpace: 'nowrap',
  },
  navItem: (active, collapsed) => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: collapsed ? '10px' : '9px 11px',
    justifyContent: collapsed ? 'center' : 'flex-start',
    borderRadius: 10, cursor: 'pointer',
    fontSize: 13, color: active ? '#E0CFFF' : 'rgba(255,255,255,0.5)',
    fontWeight: active ? 500 : 400,
    background: active ? 'rgba(138,43,226,0.15)' : 'transparent',
    border: active ? '1px solid rgba(138,43,226,0.3)' : '1px solid transparent',
    borderLeft: active && !collapsed ? '3px solid #8A2BE2' : (active ? '1px solid rgba(138,43,226,0.3)' : '1px solid transparent'),
    transition: 'all 0.18s', whiteSpace: 'nowrap', overflow: 'hidden',
  }),
  sbFooter: {
    padding: '12px 8px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    flexShrink: 0,
  },
  settingsBtn: (collapsed) => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: collapsed ? '10px' : '9px 11px',
    justifyContent: collapsed ? 'center' : 'flex-start',
    borderRadius: 10, cursor: 'pointer',
    fontSize: 13, color: 'rgba(255,255,255,0.4)',
    background: 'transparent', border: '1px solid transparent',
    transition: 'all 0.18s', whiteSpace: 'nowrap', width: '100%',
  }),
  main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  topbar: {
    height: 52, display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '0 20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)', flexShrink: 0,
  },
  topTitle: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500 },
  langBtn: {
    padding: '5px 14px', borderRadius: 20,
    border: '1px solid rgba(0,229,255,0.25)',
    background: 'transparent', color: '#00e5ff',
    cursor: 'pointer', fontWeight: 600, fontSize: 12,
    fontFamily: 'inherit',
  },
  content: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
  // Chat
  chatArea: { flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column' },
  welcome: { margin: 'auto', textAlign: 'center', maxWidth: 520, padding: '20px 0' },
  welcomeTitle: {
    fontSize: 38, fontWeight: 300, margin: '16px 0 10px',
    color: '#fff', lineHeight: 1.2,
  },
  welcomeSub: { color: '#6a6a8a', fontSize: 14, lineHeight: 1.75, marginBottom: 28 },
  quickBtns: { display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  quickBtn: {
    padding: '9px 18px', borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: 'rgba(255,255,255,0.7)', fontSize: 13,
    cursor: 'pointer', transition: 'all 0.18s', fontFamily: 'inherit',
  },
  msgWrap: (sender) => ({
    marginBottom: 18,
    display: 'flex',
    justifyContent: sender === 'user' ? 'flex-end' : 'flex-start',
    maxWidth: '100%',
  }),
  msgBubble: (sender) => ({
    maxWidth: '72%', padding: '12px 18px', borderRadius: 20,
    background: sender === 'user' ? 'rgba(138,43,226,0.18)' : 'rgba(255,255,255,0.03)',
    border: sender === 'user' ? '1px solid rgba(138,43,226,0.3)' : '1px solid rgba(255,255,255,0.06)',
    fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap',
  }),
  msgLabel: (sender) => ({
    fontSize: 10, fontWeight: 600, marginBottom: 4,
    color: sender === 'user' ? '#00e5ff' : '#9b6dff',
  }),
  // Input bar
  inputBar: {
    padding: '12px 20px 16px',
    background: 'rgba(255,255,255,0.02)',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    flexShrink: 0,
  },
  inputInner: {
    maxWidth: 760, margin: '0 auto',
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'rgba(14,14,26,0.9)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 28, padding: '6px 6px 6px 18px',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 0 32px rgba(138,43,226,0.06)',
  },
  inputField: {
    flex: 1, background: 'transparent', border: 'none',
    color: '#fff', outline: 'none', fontSize: 14,
    fontFamily: 'inherit',
  },
  iconBtn: {
    background: 'transparent', border: 'none',
    color: 'rgba(255,255,255,0.3)', cursor: 'pointer',
    fontSize: 16, padding: '6px', borderRadius: 8,
    transition: 'color 0.2s',
  },
  sendBtn: {
    height: 40, padding: '0 22px', borderRadius: 20,
    border: 'none', cursor: 'pointer', fontWeight: 700,
    fontSize: 13, fontFamily: 'inherit',
    background: 'linear-gradient(270deg, #1a8fff, #9b6dff)',
    color: '#fff', flexShrink: 0, transition: 'opacity 0.2s',
  },
  // Pages
  pageWrap: { flex: 1, padding: '32px 28px', overflowY: 'auto' },
  pageTitle: {
    fontSize: 26, fontWeight: 600, textAlign: 'center',
    background: 'linear-gradient(90deg,#00b4d8,#9b6dff)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text', marginBottom: 6,
  },
  pageSub: { textAlign: 'center', color: '#6a6a8a', fontSize: 13, marginBottom: 28 },
  // Projects grid
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16, marginTop: 8 },
  projCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14, padding: 22, cursor: 'pointer',
    transition: 'all 0.2s',
  },
  projTitle: { fontSize: 15, fontWeight: 600, color: '#e0e0f0', marginBottom: 8 },
  projDesc: { fontSize: 12.5, color: '#6a6a8a', lineHeight: 1.6, marginBottom: 14 },
  tag: (color) => ({
    display: 'inline-block', fontSize: 10, fontWeight: 600,
    padding: '3px 10px', borderRadius: 20,
    background: color + '22', color: color,
    border: `1px solid ${color}44`,
  }),
  // Search
  searchWrap: { maxWidth: 640, margin: '0 auto', marginTop: 8 },
  searchBox: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'rgba(14,14,26,0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 28, padding: '12px 20px',
  },
  searchInput: {
    flex: 1, background: 'transparent', border: 'none',
    color: '#fff', outline: 'none', fontSize: 14, fontFamily: 'inherit',
  },
  // Image Studio
  dropZone: {
    maxWidth: 560, margin: '0 auto', marginTop: 8,
    border: '1.5px dashed rgba(0,229,255,0.25)',
    borderRadius: 16, padding: '60px 32px',
    textAlign: 'center',
    background: 'rgba(0,229,255,0.03)',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  // Library
  libCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12, padding: '18px 20px',
    marginBottom: 14,
  },
  libCode: {
    background: 'rgba(0,0,0,0.4)', borderRadius: 8,
    padding: '10px 14px', fontFamily: 'monospace',
    fontSize: 11.5, color: '#00e5ff', marginTop: 10,
    overflowX: 'auto', lineHeight: 1.6,
    border: '1px solid rgba(0,229,255,0.1)',
  },
  libTabs: { display: 'flex', gap: 8, marginBottom: 20, justifyContent: 'center' },
  libTab: (active) => ({
    padding: '7px 18px', borderRadius: 20, cursor: 'pointer',
    fontSize: 12, fontFamily: 'inherit',
    background: active ? 'rgba(155,109,255,0.2)' : 'transparent',
    border: active ? '1px solid rgba(155,109,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
    color: active ? '#9b6dff' : 'rgba(255,255,255,0.5)',
    transition: 'all 0.18s',
  }),
  // Settings
  settingsCard: {
    maxWidth: 600, margin: '0 auto', marginTop: 8,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, overflow: 'hidden',
  },
  settingsRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  settingsRowTitle: { fontSize: 14, color: '#e0e0f0', marginBottom: 3 },
  settingsRowSub: { fontSize: 12, color: '#6a6a8a' },
  select: {
    background: 'rgba(14,14,26,0.8)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, color: '#e0e0f0',
    padding: '6px 12px', fontSize: 12, cursor: 'pointer',
    outline: 'none',
  },
};

// ── Main component ────────────────────────────────────────────────────────────
export default function Home() {
  const [promptInput, setPromptInput]   = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [started, setStarted]           = useState(false);
  const [lang, setLang]                 = useState('en');
  const [activeNav, setActiveNav]       = useState('chat');
  const [collapsed, setCollapsed]       = useState(false);
  const [libTab, setLibTab]             = useState('All Resources');
  const [searchVal, setSearchVal]       = useState('');
  const chatEndRef = useRef(null);

  // ── DT-3D Engine Specific States ──
  const [enginePrompt, setEnginePrompt] = useState('');
  const [engineLoading, setEngineLoading] = useState(false);
  const canvasRef = useRef(null);
  const threeEngineRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Dynamic Three.js Setup when entering the 3D Engine view
  useEffect(() => {
    if (activeNav === 'engine3d' && typeof window !== 'undefined') {
      if (!window.THREE) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = () => initThreeEngine();
        document.head.appendChild(script);
      } else {
        initThreeEngine();
      }
    }
    return () => destroyThreeEngine();
  }, [activeNav]);

  const initThreeEngine = () => {
    if (!canvasRef.current || !window.THREE) return;
    const THREE = window.THREE;
    destroyThreeEngine();

    const width = canvasRef.current.clientWidth || 500;
    const height = canvasRef.current.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0b0a16');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    canvasRef.current.appendChild(renderer.domElement);

    // Lux neon lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    const neonPurple = new THREE.PointLight(0x9b6dff, 2, 50);
    neonPurple.position.set(5, 8, 5);
    scene.add(neonPurple);

    const neonCyan = new THREE.PointLight(0x00e5ff, 1.5, 50);
    neonCyan.position.set(-5, -3, 5);
    scene.add(neonCyan);

    const group = new THREE.Group();
    scene.add(group);

    // Initial default layout mesh
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0x2e1560, roughness: 0.1, metalness: 0.8 });
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      group.rotation.y += 0.006;
      renderer.render(scene, camera);
    };
    animate();

    threeEngineRef.current = { scene, camera, renderer, group, animationFrameId };
  };

  const render3DScene = (sceneData) => {
    if (!threeEngineRef.current || !window.THREE) return;
    const THREE = window.THREE;
    const { group } = threeEngineRef.current;

    // Clear old elements safely
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    if (!sceneData || !sceneData.objects) return;

    sceneData.objects.forEach(obj => {
      let geo;
      if (obj.type === 'sphere') geo = new THREE.SphereGeometry(obj.scale[0] || 1, 32, 32);
      else if (obj.type === 'cylinder') geo = new THREE.CylinderGeometry(obj.scale[0] || 1, obj.scale[1] || 1, obj.scale[2] || 2, 32);
      else geo = new THREE.BoxGeometry(...(obj.scale || [1, 1, 1]));

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(obj.color || '#7b2fff'),
        roughness: 0.2,
        metalness: 0.7
      });

      const mesh = new THREE.Mesh(geo, mat);
      if (obj.position) mesh.position.set(...obj.position);
      group.add(mesh);
    });
  };

  const destroyThreeEngine = () => {
    if (threeEngineRef.current) {
      cancelAnimationFrame(threeEngineRef.current.animationFrameId);
      if (threeEngineRef.current.renderer && threeEngineRef.current.renderer.domElement) {
        threeEngineRef.current.renderer.dispose();
        if (canvasRef.current && canvasRef.current.contains(threeEngineRef.current.renderer.domElement)) {
          canvasRef.current.removeChild(threeEngineRef.current.renderer.domElement);
        }
      }
      threeEngineRef.current = null;
    }
  };

  const generate3DLayout = async () => {
    const txt = enginePrompt.trim();
    if (!txt || engineLoading) return;
    setEngineLoading(true);

    try {
      const res = await fetch('/api/generate3d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: txt })
      });
      const data = await res.json();
      if (data.success && data.scene) {
        render3DScene(data.scene);
      } else {
        alert(data.error || 'Execution Error in 3D Engine Subsystem.');
      }
    } catch {
      alert('Cloud Connection Refused: Verify API limits.');
    } finally {
      setEngineLoading(false);
    }
  };

  // Group nav items
  const groups = ['WORKSPACE', 'REPOS & LIBRARIES'];

  const sendChat = async (text) => {
    const txt = (text || promptInput).trim();
    if (!txt) return;
    if (!started) setStarted(true);
    let currentMessages = [...chatMessages, { sender: 'user', text: txt }];
    setChatMessages(currentMessages);
    setPromptInput('');
    const loadId = 'ld_' + Date.now();
    setChatMessages([...currentMessages, { sender: 'ai', id: loadId, text: lang === 'fa' ? 'در حال پردازش...' : 'D&T Core processing...' }]);
    try {
      const res  = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: txt,
          systemText: lang === 'fa'
            ? 'You are D&T AI Engineering Assistant. Answer in Persian.'
            : 'You are D&T AI Engineering Assistant. Help with Grasshopper, parametric design, and engineering.',
        }),
      });
      const data = await res.json();
      setChatMessages(prev => prev.map(m => m.id === loadId
        ? { sender: 'ai', text: res.ok && data.success ? data.reply : 'System Error: Connection failed.' }
        : m));
    } catch {
      setChatMessages(prev => prev.map(m => m.id === loadId
        ? { sender: 'ai', text: 'Connection Error: Cloud function timeout.' }
        : m));
    }
  };

  // Page title map
  const pageTitles = {
    chat: 'AI Studio', projects: 'Projects Hub', engine3d: 'DT-3D Engine Portal',
    search: 'Deep Search', image: 'Image Studio',
    library: 'Extended Library', settings: 'System Settings',
  };

  return (
    <>
      <Head>
        <title>D&T Ai-TECH | Workspace Core</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          body{margin:0;padding:0;background:#07070a;overflow:hidden}
          ::-webkit-scrollbar{width:4px;height:4px}
          ::-webkit-scrollbar-track{background:transparent}
          ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px}
          button:focus{outline:none}
          .nav-item-btn:hover{background:rgba(255,255,255,0.05)!important;color:rgba(255,255,255,0.8)!important}
          .quick-btn:hover{border-color:rgba(138,43,226,0.5)!important;color:#C4A0FF!important;background:rgba(138,43,226,0.08)!important}
          .proj-card:hover{border-color:rgba(138,43,226,0.25)!important;background:rgba(138,43,226,0.05)!important}
          .drop-zone:hover{border-color:rgba(0,229,255,0.5)!important;background:rgba(0,229,255,0.07)!important}
          .icon-btn:hover{color:rgba(0,229,255,0.7)!important}
          .send-btn:hover{opacity:0.88}
        `}</style>
      </Head>

      <div style={S.root}>

        {/* ══ SIDEBAR ══ */}
        <aside style={S.sidebar(collapsed)}>
          <div style={S.sbGlow} />

          {/* Header */}
          <div style={S.sbHeader}>
            <button style={S.hamburger} onClick={() => setCollapsed(c => !c)}>☰</button>
            {!collapsed && (
              <>
                <LogoSVG size={30} />
                <span style={S.brandName}>D&T Ai-TECH</span>
              </>
            )}
          </div>

          {/* Nav */}
          <nav style={S.nav}>
            {groups.map(group => {
              const items = NAV.filter(n => n.group === group);
              return (
                <div key={group}>
                  {!collapsed && <div style={S.navGroup}>{group}</div>}
                  {items.map(item => (
                    <button
                      key={item.id}
                      className="nav-item-btn"
                      style={S.navItem(activeNav === item.id, collapsed)}
                      onClick={() => setActiveNav(item.id)}
                      title={collapsed ? item.label : undefined}
                    >
                      <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
                      {!collapsed && <span>{item.label}</span>}
                    </button>
                  ))}
                </div>
              );
            })}
          </nav>

          {/* Footer / Settings */}
          <div style={S.sbFooter}>
            <button
              className="nav-item-btn"
              style={S.settingsBtn(collapsed)}
              onClick={() => setActiveNav('settings')}
              title={collapsed ? 'System Settings' : undefined}
            >
              <span style={{ fontSize: 15 }}>⚙️</span>
              {!collapsed && <span style={{ fontSize: 13 }}>System Settings</span>}
            </button>
          </div>
        </aside>

        {/* ══ MAIN ══ */}
        <main style={S.main}>
          {/* Topbar */}
          <div style={S.topbar}>
            <span style={S.topTitle}>{pageTitles[activeNav] || 'AI Studio'}</span>
            <button style={S.langBtn} onClick={() => setLang(l => l === 'en' ? 'fa' : 'en')}>
              {lang === 'en' ? 'FA / EN' : 'EN / FA'}
            </button>
          </div>

          {/* Content area */}
          <div style={S.content}>

            {/* ── CHAT ── */}
            {activeNav === 'chat' && (
              <>
                <div style={S.chatArea} ref={chatEndRef}>
                  {!started ? (
                    <div style={S.welcome}>
                      <LogoSVG size={80} />
                      <h1 style={S.welcomeTitle}>
                        {lang === 'fa' ? 'کجا شروع کنیم؟' : 'Where should we start?'}
                      </h1>
                      <p style={S.welcomeSub}>
                        {lang === 'fa'
                          ? 'دستیار مهندسی محاسباتی هوشمند پلتفرم D&T Ai-TECH.'
                          : 'Advanced computational engineering copilot for generating Grasshopper Python workflows and circuit optimization.'}
                      </p>
                      <div style={S.quickBtns}>
                        {QUICK_PROMPTS.map(q => (
                          <button key={q} className="quick-btn" style={S.quickBtn} onClick={() => sendChat(q)}>{q}</button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ maxWidth: 740, width: '100%', margin: '0 auto' }}>
                      {chatMessages.map((msg, i) => (
                        <div key={i} style={S.msgWrap(msg.sender)}>
                          <div style={S.msgBubble(msg.sender)}>
                            <div style={S.msgLabel(msg.sender)}>
                              {msg.sender === 'user' ? (lang === 'fa' ? 'شما' : 'You') : 'D&T Ai-TECH'}
                            </div>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                  )}
                </div>
                {/* Input */}
                <div style={S.inputBar}>
                  <div style={S.inputInner}>
                    <button className="icon-btn" style={S.iconBtn} title="Attach">📎</button>
                    <button className="icon-btn" style={S.iconBtn} title="Image">🖼</button>
                    <input
                      style={S.inputField}
                      value={promptInput}
                      onChange={e => setPromptInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendChat()}
                      placeholder={lang === 'fa' ? 'سوال خود را اینجا مطرح کنید...' : 'Ask D&T Ai-TECH or upload assets...'}
                    />
                    <button className="send-btn" style={S.sendBtn} onClick={() => sendChat()}>SEND</button>
                  </div>
                </div>
              </>
            )}

            {/* ── DT-3D ENGINE VIEW ── */}
            {activeNav === 'engine3d' && (
              <div style={S.pageWrap}>
                <h2 style={S.pageTitle}>DT-3D Engine Portal</h2>
                <p style={S.pageSub}>Translate computational prompts into procedural, live-rendered 3D topologies</p>
                
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '16px', height: 'calc(100% - 60px)' }}>
                  {/* Prompt Control Panel */}
                  <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#9b6dff' }}>ENGINE GENERATION PROMPT</label>
                    <textarea 
                      style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px', color: '#fff', outline: 'none', resize: 'none', fontSize: '13.5px', fontFamily: 'inherit', lineHeight: '1.6' }}
                      value={enginePrompt}
                      onChange={e => setEnginePrompt(e.target.value)}
                      placeholder="e.g., Futuristic exhibition stall with neon purple framing and sphere arrays"
                    />
                    <button 
                      style={{ background: 'linear-gradient(90deg, #9b6dff, #00e5ff)', color: '#fff', border: 'none', borderRadius: '24px', padding: '14px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', letterSpacing: '0.5px' }}
                      onClick={generate3DLayout}
                      disabled={engineLoading}
                    >
                      {engineLoading ? 'SYNTHESIZING TOPOLOGY...' : 'GENERATE 3D SCENE'}
                    </button>
                  </div>

                  {/* Three.js Live Workspace */}
                  <div style={{ flex: '2 1 450px', height: '100%', position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(138,43,226,0.25)', boxShadow: '0 0 40px rgba(138,43,226,0.04)' }}>
                    <div ref={canvasRef} style={{ width: '100%', height: '100%', minHeight: '400px' }} />
                    <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(7,7,10,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', color: 'rgba(255,255,255,0.5)', pointerEvents: 'none' }}>
                      ✦ DT-3D Realtime WebGL Canvas
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── PROJECTS HUB ── */}
            {activeNav === 'projects' && (
              <div style={S.pageWrap}>
                <h2 style={S.pageTitle}>Projects Hub</h2>
                <p style={S.pageSub}>Manage advanced multi-dimensional computational workspaces</p>
                <div style={S.grid3}>
                  {PROJECTS.map(p => (
                    <div key={p.title} className="proj-card" style={S.projCard}>
                      <div style={S.projTitle}>{p.title}</div>
                      <div style={S.projDesc}>{p.desc}</div>
                      <span style={S.tag(p.color)}>{p.tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── DEEP SEARCH ── */}
            {activeNav === 'search' && (
              <div style={S.pageWrap}>
                <h2 style={S.pageTitle}>Deep Search Core</h2>
                <p style={S.pageSub}>Cross-examine massive parametric databases and engineering manifests</p>
                <div style={S.searchWrap}>
                  <div style={S.searchBox}>
                    <span style={{ color: '#00e5ff', fontSize: 16 }}>🔍</span>
                    <input
                      style={S.searchInput}
                      value={searchVal}
                      onChange={e => setSearchVal(e.target.value)}
                      placeholder="Search components or algorithmic libraries..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── IMAGE STUDIO ── */}
            {activeNav === 'image' && (
              <div style={S.pageWrap}>
                <h2 style={S.pageTitle}>Image Studio</h2>
                <p style={S.pageSub}>Upload circuit blueprints, wireframes, or architectural sketches for AI dissection</p>
                <div
                  className="drop-zone"
                  style={S.dropZone}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <div style={{ fontSize: 32, marginBottom: 12, color: '#00e5ff' }}>🖼</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
                    Drop technical asset here or click to choose file
                  </div>
                  <input id="file-input" type="file" style={{ display: 'none' }} />
                </div>
              </div>
            )}

            {/* ── EXTENDED LIBRARY ── */}
            {activeNav === 'library' && (
              <div style={S.pageWrap}>
                <h2 style={S.pageTitle}>Extended Library</h2>
                <p style={S.pageSub}>Centralized repository housing foundational scripts, prompt systems and templates</p>
                <div style={S.libTabs}>
                  {['All Resources', 'Rhino / GH Scripts', 'AI Engineering Prompts'].map(t => (
                    <button key={t} style={S.libTab(libTab === t)} onClick={() => setLibTab(t)}>{t}</button>
                  ))}
                </div>
                {LIBRARY.map(item => (
                  <div key={item.title} style={S.libCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#e0e0f0' }}>{item.title}</span>
                      <span style={S.tag('#9b6dff')}>{item.tag}</span>
                    </div>
                    <pre style={S.libCode}>{item.code}</pre>
                  </div>
                ))}
              </div>
            )}

            {/* ── SYSTEM SETTINGS ── */}
            {activeNav === 'settings' && (
              <div style={S.pageWrap}>
                <h2 style={S.pageTitle}>System Settings</h2>
                <p style={S.pageSub}>Configure your D&T intelligent engine core variables</p>
                <div style={S.settingsCard}>
                  {[
                    { title: 'Interface Theme', sub: 'Switch between premium space-dark and depth-blue layouts', control: <select style={S.select}><option>Gemini Dark Core</option><option>Depth Blue</option></select> },
                    { title: 'Primary Workspace Language', sub: 'Set default direction, aligning rules and syntax translation', control: <select style={S.select} value={lang} onChange={e => setLang(e.target.value)}><option value="en">English (US)</option><option value="fa">Persian (FA)</option></select> },
                    { title: 'Subscription Licensing', sub: 'Current tier deployment limits and operational tokens', control: <span style={{ padding: '7px 16px', borderRadius: 20, background: 'linear-gradient(90deg,#9b6dff,#1a8fff)', color: '#fff', fontSize: 12, fontWeight: 600 }}>Experimental Sandbox Tier</span> },
                  ].map(row => (
                    <div key={row.title} style={S.settingsRow}>
                      <div>
                        <div style={S.settingsRowTitle}>{row.title}</div>
                        <div style={S.settingsRowSub}>{row.sub}</div>
                      </div>
                      {row.control}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>{/* /content */}
        </main>
      </div>
    </>
  );
}
