"use client";

import { useApp, ACTIVITY_LABELS, ACTIVITY_POINTS } from "@/lib/AppContext";
import { ActivityType } from "@/types";

const ROWS: ActivityType[] = ["BIKE_TO_WORK", "RECYCLE", "PLANT_TREE", "PUBLIC_TRANSPORT"];

const ICONS: Record<ActivityType, string> = {
  BIKE_TO_WORK: "🚲",
  RECYCLE: "♻️",
  PLANT_TREE: "🌱",
  PUBLIC_TRANSPORT: "🚌",
};

export default function GreenStats() {
  const { userStats, state } = useApp();
  const connected = state.walletStatus === "CONNECTED";

  return (
    <div className="card fade-up fade-up-3" style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 600, fontSize: 18, color: "var(--paper)" }}>
          İstatistiklerim
        </h2>
        <span className="stat-chip">{connected ? "CANLI" : "ÇEVRIMDIŞI"}</span>
      </div>

      {/* Toplam puan */}
      <div style={{ textAlign: "center", padding: "20px 0 24px", borderBottom: "1px solid rgba(127,255,71,0.08)", marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: "var(--fog)", fontFamily: "'DM Mono', monospace", marginBottom: 8, letterSpacing: "0.08em" }}>
          TOPLAM YEŞİL PUAN
        </p>
        <div className="animate-count" key={userStats.totalGreenPoints} style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6 }}>
          <span style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: 64, color: "var(--lime)", lineHeight: 1, letterSpacing: "-2px" }}>
            {connected ? userStats.totalGreenPoints : "—"}
          </span>
          {connected && <span style={{ fontSize: 14, color: "var(--fog)", fontFamily: "'DM Mono', monospace" }}>YP</span>}
        </div>
        {connected && (
          <p style={{ fontSize: 12, color: "var(--sage)", marginTop: 8 }}>
            {userStats.activitiesCount} aktivite zincire kaydedildi
          </p>
        )}
      </div>

      {/* Aktivite dağılımı */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {ROWS.map((type) => {
          const count = connected ? userStats.breakdown[type] : 0;
          const earned = count * ACTIVITY_POINTS[type];
          const hasActivity = count > 0;
          return (
            <div key={type} style={{ display: "flex", alignItems: "center", padding: "10px 8px", borderRadius: 10, background: hasActivity ? "rgba(127,255,71,0.05)" : "transparent", transition: "background 0.2s" }}>
              <span style={{ fontSize: 16, width: 28 }}>{ICONS[type]}</span>
              <span style={{ flex: 1, fontSize: 13, color: hasActivity ? "var(--mist)" : "var(--sage)" }}>
                {ACTIVITY_LABELS[type]}
              </span>
              {connected ? (
                <>
                  <span style={{ fontSize: 12, color: "var(--fog)", marginRight: 12, fontFamily: "'DM Mono', monospace" }}>×{count}</span>
                  <span style={{ fontSize: 13, fontFamily: "'DM Mono', monospace", color: hasActivity ? "var(--lime)" : "var(--sage)", fontWeight: 500 }}>
                    {hasActivity ? `+${earned}` : "—"}
                  </span>
                </>
              ) : (
                <span style={{ fontSize: 12, color: "var(--sage)" }}>—</span>
              )}
            </div>
          );
        })}
      </div>

      {!connected && (
        <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(127,255,71,0.04)", border: "1px solid rgba(127,255,71,0.1)", borderRadius: 12, textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "var(--fog)" }}>Canlı istatistikleri görmek için cüzdanını bağla</p>
        </div>
      )}
    </div>
  );
}
