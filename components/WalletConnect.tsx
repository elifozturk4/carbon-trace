"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/AppContext";
import {
  connectFreighterWallet,
  checkFreighterConnection,
  shortenAddress,
} from "@/lib/stellar";

export default function WalletConnect() {
  const { state, dispatch } = useApp();
  const { walletStatus, walletAddress } = state;
  const isConnected = walletStatus === "CONNECTED";
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sayfa açılınca zaten bağlı mı kontrol et
  useEffect(() => {
    checkFreighterConnection().then((key) => {
      if (key) {
        dispatch({ type: "SET_WALLET_ADDRESS", payload: key });
        dispatch({ type: "SET_WALLET_STATUS", payload: "CONNECTED" });
      }
    });
  }, [dispatch]);

  const handleConnect = async () => {
    setErrorMsg(null);
    dispatch({ type: "SET_WALLET_STATUS", payload: "CONNECTING" });
    try {
      const publicKey = await connectFreighterWallet();
      dispatch({ type: "SET_WALLET_ADDRESS", payload: publicKey });
      dispatch({ type: "SET_WALLET_STATUS", payload: "CONNECTED" });
    } catch (err: unknown) {
      dispatch({ type: "SET_WALLET_STATUS", payload: "DISCONNECTED" });
      const msg = err instanceof Error ? err.message : "";
      if (msg === "FREIGHTER_NOT_INSTALLED") {
        setErrorMsg("INSTALL");
      } else {
        // REJECTED veya başka bir hata — popup'ta reddetmiş olabilir
        setErrorMsg("Freighter popup'ında bağlantıyı onaylamayı unutma.");
      }
    }
  };

  const handleDisconnect = () => {
    dispatch({ type: "DISCONNECT_WALLET" });
    setErrorMsg(null);
  };

  return (
    <header style={{ background: "var(--canopy)", borderBottom: "1px solid rgba(127,255,71,0.1)" }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto", padding: "0 24px",
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "var(--lime)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6 2 3 8 3 12c0 5 4 9 9 9s9-4 9-9C21 5 17 2 12 2z" fill="#0a1a0f"/>
              <path d="M12 2v18M8 6c2 2 4 8 4 14M16 6c-2 2-4 8-4 14" stroke="#0a1a0f" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 600, fontSize: 18, color: "var(--paper)", letterSpacing: "-0.3px" }}>
            Carbon<span style={{ color: "var(--lime)" }}>Trace</span>
          </span>
          <nav style={{ display: "flex", gap: 4, marginLeft: 24 }}>
            {[{ href: "/", label: "Ana Sayfa" }, { href: "/leaderboard", label: "🏆 Sıralama" }].map((link) => (
              <a key={link.href} href={link.href} style={{ fontSize: 13, color: "var(--fog)", textDecoration: "none", padding: "4px 10px", borderRadius: 6 }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--mist)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--fog)")}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Cüzdan */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isConnected && walletAddress && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(127,255,71,0.08)", border: "1px solid rgba(127,255,71,0.2)", borderRadius: 10, padding: "6px 12px" }}>
              <span className="pulse-dot" style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "var(--lime)" }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "var(--lime)" }}>
                {shortenAddress(walletAddress)}
              </span>
            </div>
          )}
          {isConnected ? (
            <button className="btn-outline" onClick={handleDisconnect} style={{ padding: "8px 16px", fontSize: 13 }}>
              Bağlantıyı Kes
            </button>
          ) : (
            <button className="btn-lime" onClick={handleConnect} disabled={walletStatus === "CONNECTING"} style={{ padding: "10px 20px", fontSize: 14 }}>
              {walletStatus === "CONNECTING" ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 14, height: 14, border: "2px solid var(--forest)", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                  Bağlanıyor...
                </span>
              ) : "🔗 Cüzdanı Bağla"}
            </button>
          )}
        </div>
      </div>

      {/* Hata bandı */}
      {errorMsg === "INSTALL" && (
        <div style={{ background: "rgba(255,80,80,0.08)", borderTop: "1px solid rgba(255,80,80,0.2)", padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#ff8080" }}>⚠️ Freighter eklentisi bulunamadı. Yükle ve sayfayı yenile.</span>
          <a href="https://www.freighter.app/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "var(--lime)", textDecoration: "underline" }}>
            freighter.app →
          </a>
        </div>
      )}
      {errorMsg && errorMsg !== "INSTALL" && (
        <div style={{ background: "rgba(255,200,0,0.06)", borderTop: "1px solid rgba(255,200,0,0.15)", padding: "10px 24px" }}>
          <span style={{ fontSize: 13, color: "#ffcc00" }}>⚠️ {errorMsg}</span>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </header>
  );
}
