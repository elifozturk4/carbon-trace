"use client";

import { useApp, ACTIVITY_LABELS } from "@/lib/AppContext";
import { ActivityRecord } from "@/types";
import { getTxExplorerUrl } from "@/lib/stellar";

const TYPE_EMOJI: Record<string, string> = {
  BIKE_TO_WORK: "🚲",
  RECYCLE: "♻️",
  PLANT_TREE: "🌱",
  PUBLIC_TRANSPORT: "🚌",
};

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff} sn önce`;
  if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
  return `${Math.floor(diff / 3600)} sa önce`;
}

function LogRow({ entry }: { entry: ActivityRecord }) {
  const explorerUrl = entry.txHash ? getTxExplorerUrl(entry.txHash) : null;
  const isMock = entry.txHash?.startsWith("mock_");

  return (
    <div className="log-row" style={{ display: "flex", alignItems: "center", padding: "12px 16px", gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(127,255,71,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
        {TYPE_EMOJI[entry.type]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, color: "var(--mist)", fontWeight: 500, marginBottom: 2 }}>
          {ACTIVITY_LABELS[entry.type]}
        </p>
        {/* TX Hash — Aşama 3'te gerçek explorer linkine dönüşür */}
        {explorerUrl && !isMock ? (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 11, color: "var(--lime)", fontFamily: "'DM Mono', monospace", textDecoration: "none" }}
          >
            {entry.txHash!.slice(0, 16)}... ↗
          </a>
        ) : (
          <p style={{ fontSize: 11, color: "var(--sage)", fontFamily: "'DM Mono', monospace" }}>
            {isMock ? "mock tx · " : "yerel · "}{entry.id.slice(-6)}
          </p>
        )}
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: "var(--lime)", fontWeight: 500 }}>
          +{entry.greenPoints} YP
        </p>
        <p style={{ fontSize: 11, color: "var(--sage)" }}>{timeAgo(entry.timestamp)}</p>
      </div>
    </div>
  );
}

export default function ActionLog() {
  const { state } = useApp();
  const { activities, walletStatus } = state;
  const connected = walletStatus === "CONNECTED";

  return (
    <div className="card fade-up fade-up-4" style={{ overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 16px" }}>
        <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 600, fontSize: 18, color: "var(--paper)" }}>
          Aktivite Geçmişi
        </h2>
        {activities.length > 0 && (
          <span className="stat-chip">{activities.length} kayıt</span>
        )}
      </div>

      <div style={{ maxHeight: 340, overflowY: "auto" }}>
        {!connected ? (
          <div style={{ padding: "32px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔗</div>
            <p style={{ fontSize: 14, color: "var(--fog)" }}>Aktivite kaydetmeye başlamak için cüzdanını bağla</p>
            <p style={{ fontSize: 12, color: "var(--sage)", marginTop: 6, fontFamily: "'DM Mono', monospace" }}>
              Tüm işlemler Stellar Soroban&apos;a kaydedilir
            </p>
          </div>
        ) : activities.length === 0 ? (
          <div style={{ padding: "32px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🌿</div>
            <p style={{ fontSize: 14, color: "var(--fog)" }}>Henüz aktivite yok</p>
            <p style={{ fontSize: 12, color: "var(--sage)", marginTop: 6 }}>
              Başlamak için yukarıdan ilk aktiviteni kaydet
            </p>
          </div>
        ) : (
          activities.map((entry) => <LogRow key={entry.id} entry={entry} />)
        )}
      </div>

      <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(127,255,71,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "var(--sage)", fontFamily: "'DM Mono', monospace" }}>v0.2.0 · Freighter</span>
        <span style={{ fontSize: 11, color: "var(--sage)", fontFamily: "'DM Mono', monospace" }}>Aşama 3: gerçek tx →</span>
      </div>
    </div>
  );
}
