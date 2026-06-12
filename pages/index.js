import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = {
  deepPurple: "#2B0066",
  neonPurple: "#8A2BE2",
  brightBlue: "#A5F3FC",
  platinum: "#E2E8F0",
  darkSlate: "#1A1921",
  white: "#FFFFFF",
};

const NAV_ITEMS = [
  { id: "chat", icon: "💬", label: "Chat" },
  { id: "projects", icon: "📁", label: "Projects" },
  { id: "workspace", icon: "✦", label: "Workspace" },
  { id: "analysis", icon: "📊", label: "Analysis" },
];

const CHAT_MESSAGES = [
  {
    role: "ai",
    text:
      "D&T AI-TECH Studio ready. Your system is now connected.",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("workspace");

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      
      {/* SIDEBAR */}
      <div
        style={{
          width: 240,
          background: "linear-gradient(160deg,#2B0066,#8A2BE2)",
          color: "white",
          padding: 20,
        }}
      >
        {/* LOGO */}
        <div style={{ marginBottom: 30 }}>
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: 40, height: 40, marginBottom: 10 }}
          />
          <div style={{ fontWeight: "bold" }}>D&T AI-TECH</div>
        </div>

        {/* NAV */}
        {NAV_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              padding: 10,
              marginBottom: 8,
              cursor: "pointer",
              background: activeTab === item.id ? "#ffffff33" : "transparent",
              borderRadius: 8,
            }}
          >
            {item.icon} {item.label}
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 20 }}>
        <h2>AI Studio</h2>

        {activeTab === "workspace" && (
          <div>
            <h3>Workspace</h3>
            <p>Ready to build.</p>
          </div>
        )}

        {activeTab === "chat" && (
          <div>
            <h3>Chat</h3>
            {CHAT_MESSAGES.map((m, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <b>{m.role}:</b> {m.text}
              </div>
            ))}
          </div>
        )}

        {activeTab === "projects" && <h3>Projects panel</h3>}
        {activeTab === "analysis" && <h3>Analysis panel</h3>}
      </div>
    </div>
  );
}
