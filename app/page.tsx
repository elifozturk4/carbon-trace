"use client";

import ActivityButtons from "@/components/ActivityButtons";
import GreenStats from "@/components/GreenStats";
import ActionLog from "@/components/ActionLog";
import { useApp } from "@/lib/AppContext";

function HeroStat({ value, label, sublabel }: { value: string; label: string; sublabel?: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: 36, color: "var(--lime)", letterSpacing: "-1px", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: "var(--fog)", marginTop: 4 }}>{label}</div>
      {sublabel && <div style={{ fontSize: 11, color: "var(--sage)", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{sublabel}</div>}
    </div>
  );
}

export default function Home() {
  const { state } = useApp();
  const connected = state.walletStatus === "CONNECTED";

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 80px" }}>

      {/* Hero */}
      <div className="fade-up" style={{ marginBottom: 56, maxWidth: 560 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(127,255,71,0.08)", border: "1px solid rgba(127,255,71,0.2)", borderRadius: 20, padding: "5px 14px", marginBottom: 20 }}>
          <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--lime)", display: "inline-block" }} />
          <span style={{ fontSize: 12, color: "var(--lime)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}>
            STELLAR TESTNET · SOROBAN
          </span>
        </div>

        <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: 52, color: "var(--paper)", lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: 16 }}>
          Karbon ayak izini<br/>
          <span style={{ color: "var(--lime)" }}>zincire kaydet.</span>
        </h1>
        <p style={{ fontSize: 16, color: "var(--fog)", lineHeight: 1.7, maxWidth: 440 }}>
          Düşük karbonlu aktivitelerini kaydet, Yeşil Puan kazan ve sürdürülebilirlik geçmişini Stellar blok zincirinde doğrulanabilir şekilde oluştur.
        </p>
      </div>

      {/* Ağ istatistikleri bandı */}
      <div className="card fade-up fade-up-1" style={{ display: "flex", justifyContent: "space-around", padding: "24px 32px", marginBottom: 40, flexWrap: "wrap", gap: 20 }}>
        <HeroStat value="12.4B" label="Toplam Yeşil Puan" sublabel="ağ genelinde" />
        <div style={{ width: 1, background: "rgba(127,255,71,0.1)", alignSelf: "stretch" }} />
        <HeroStat value="847" label="Kayıtlı Aktivite" sublabel="tüm kullanıcılar" />
        <div style={{ width: 1, background: "rgba(127,255,71,0.1)", alignSelf: "stretch" }} />
        <HeroStat value="214" label="Aktif Cüzdan" sublabel="bu ay" />
        <div style={{ width: 1, background: "rgba(127,255,71,0.1)", alignSelf: "stretch" }} />
        <HeroStat value="4.2t" label="CO₂ Azaltımı" sublabel="tahmini" />
      </div>

      {/* Ana grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="fade-up fade-up-2">
            <ActivityButtons />
          </div>
          <ActionLog />
        </div>

        <div style={{ position: "sticky", top: 24 }}>
          <GreenStats />
          {!connected && (
            <div className="card" style={{ marginTop: 16, padding: "20px", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>🌍</div>
              <p style={{ fontSize: 14, color: "var(--mist)", fontWeight: 500, marginBottom: 6 }}>
                Etki yaratmaya hazır mısın?
              </p>
              <p style={{ fontSize: 13, color: "var(--fog)", lineHeight: 1.5 }}>
                Stellar cüzdanını bağla, aktivitelerini kaydetmeye ve Yeşil Puan kazanmaya başla.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
