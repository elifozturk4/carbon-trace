"use client";

import { useEffect, useState } from "react";
import { fetchLeaderboard, LeaderboardEntry } from "@/lib/stellar";
import { useApp } from "@/lib/AppContext";

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span style={{ fontSize: 20 }}>🥇</span>;
  if (rank === 2) return <span style={{ fontSize: 20 }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: 20 }}>🥉</span>;
  return (
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "var(--fog)", width: 28, display: "inline-block", textAlign: "center" }}>
      {rank}
    </span>
  );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.max(4, (value / max) * 100);
  return (
    <div style={{ height: 4, background: "rgba(127,255,71,0.1)", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: "var(--lime)", borderRadius: 2, transition: "width 0.8s ease" }} />
    </div>
  );
}

export default function LeaderboardPage() {
  const { state, userStats } = useApp();
  const [mockData, setMockData] = useState<LeaderboardEntry[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  // Sadece mock veriyi bir kez çek
  useEffect(() => {
    fetchLeaderboard().then((data) => {
      setMockData(data);
      setLastUpdated(new Date());
      setLoading(false);
    });
  }, []);

  // Mock veri + kullanıcının gerçek verisi birleştir
  // userStats her değişince otomatik güncellenir
  const entries: LeaderboardEntry[] = (() => {
    const list = [...mockData];

    if (state.walletAddress && userStats.totalGreenPoints > 0) {
      list.push({
        wallet: state.walletAddress.slice(0, 4) + "..." + state.walletAddress.slice(-4),
        totalPoints: userStats.totalGreenPoints,
        activityCount: userStats.activitiesCount,
        isCurrentUser: true,
      });
    }

    return list.sort((a, b) => b.totalPoints - a.totalPoints);
  })();

  const maxPoints = entries[0]?.totalPoints || 1;
  const myRank = entries.findIndex((e) => e.isCurrentUser) + 1;

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px" }}>

      <div className="fade-up" style={{ marginBottom: 40 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(127,255,71,0.08)", border: "1px solid rgba(127,255,71,0.2)", borderRadius: 20, padding: "5px 14px", marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: "var(--lime)", fontFamily: "'DM Mono', monospace" }}>
            🏆 KÜRESEL SIRALAMA
          </span>
        </div>
        <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: 42, color: "var(--paper)", letterSpacing: "-1px", marginBottom: 10 }}>
          Liderlik Tablosu
        </h1>
        <p style={{ fontSize: 15, color: "var(--fog)", lineHeight: 1.6 }}>
          En fazla Yeşil Puan kazanan kullanıcılar.
        </p>
      </div>

      {/* Senin kendi kartın */}
      {state.walletStatus === "CONNECTED" && myRank > 0 && (
        <div className="card fade-up fade-up-1" style={{ padding: "16px 20px", marginBottom: 24, border: "1px solid rgba(127,255,71,0.35)" }}>
          <p style={{ fontSize: 11, color: "var(--lime)", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>SENİN SIRAN</p>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <RankBadge rank={myRank} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "var(--lime)", flex: 1 }}>
              {state.walletAddress?.slice(0, 4)}...{state.walletAddress?.slice(-4)}
            </span>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: 24, color: "var(--lime)" }}>
                {userStats.totalGreenPoints} YP
              </div>
              <div style={{ fontSize: 11, color: "var(--sage)" }}>{userStats.activitiesCount} aktivite</div>
            </div>
          </div>
        </div>
      )}

      {/* Aktivite yoksa uyar */}
      {state.walletStatus === "CONNECTED" && userStats.totalGreenPoints === 0 && (
        <div style={{ padding: "14px 18px", marginBottom: 24, background: "rgba(127,255,71,0.04)", border: "1px solid rgba(127,255,71,0.12)", borderRadius: 12 }}>
          <p style={{ fontSize: 13, color: "var(--fog)" }}>
            💡 Henüz aktivite kaydetmedin. <a href="/" style={{ color: "var(--lime)" }}>Ana sayfaya dön</a> ve ilk aktiviteni ekle!
          </p>
        </div>
      )}

      {/* Son güncelleme */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: "var(--sage)", fontFamily: "'DM Mono', monospace" }}>
          {lastUpdated ? `Son güncelleme: ${lastUpdated.toLocaleTimeString("tr-TR")}` : ""}
        </span>
      </div>

      {/* Tablo */}
      <div className="card fade-up fade-up-2" style={{ overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "48px 1fr 80px 100px", gap: 12, padding: "12px 20px", borderBottom: "1px solid rgba(127,255,71,0.1)" }}>
          <span style={{ fontSize: 11, color: "var(--sage)", fontFamily: "'DM Mono', monospace" }}>SIRA</span>
          <span style={{ fontSize: 11, color: "var(--sage)", fontFamily: "'DM Mono', monospace" }}>CÜZDAN</span>
          <span style={{ fontSize: 11, color: "var(--sage)", fontFamily: "'DM Mono', monospace", textAlign: "right" }}>AKTİVİTE</span>
          <span style={{ fontSize: 11, color: "var(--sage)", fontFamily: "'DM Mono', monospace", textAlign: "right" }}>YEŞİL PUAN</span>
        </div>

        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "48px 1fr 80px 100px", gap: 12, padding: "16px 20px", borderBottom: "1px solid rgba(127,255,71,0.05)" }}>
              <div style={{ width: 24, height: 20, background: "rgba(127,255,71,0.06)", borderRadius: 4 }} />
              <div style={{ height: 20, background: "rgba(127,255,71,0.06)", borderRadius: 4, width: "60%" }} />
              <div style={{ height: 20, background: "rgba(127,255,71,0.06)", borderRadius: 4 }} />
              <div style={{ height: 20, background: "rgba(127,255,71,0.06)", borderRadius: 4 }} />
            </div>
          ))
        ) : (
          entries.map((entry, idx) => {
            const isMe = !!entry.isCurrentUser;
            return (
              <div
                key={idx}
                style={{
                  display: "grid", gridTemplateColumns: "48px 1fr 80px 100px",
                  gap: 12, padding: "16px 20px",
                  borderBottom: idx < entries.length - 1 ? "1px solid rgba(127,255,71,0.05)" : "none",
                  background: isMe ? "rgba(127,255,71,0.05)" : "transparent",
                }}
                onMouseEnter={e => !isMe && (e.currentTarget.style.background = "rgba(127,255,71,0.03)")}
                onMouseLeave={e => !isMe && (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <RankBadge rank={idx + 1} />
                </div>
                <div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: isMe ? "var(--lime)" : "var(--mist)" }}>
                    {entry.wallet}
                    {isMe && <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.7 }}>(Sen)</span>}
                  </span>
                  <ProgressBar value={entry.totalPoints} max={maxPoints} />
                </div>
                <div style={{ textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: 13, color: "var(--fog)" }}>{entry.activityCount}×</span>
                </div>
                <div style={{ textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                  <span style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 600, fontSize: 18, color: idx === 0 ? "var(--lime)" : "var(--mist)" }}>
                    {entry.totalPoints}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
