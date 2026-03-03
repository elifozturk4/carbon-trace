"use client";

import { useState, useRef } from "react";
import { useApp, ACTIVITY_POINTS } from "@/lib/AppContext";
import { submitActivityToChain, getTxExplorerUrl } from "@/lib/stellar";
import { uploadImageToIPFS, getIPFSUrl, validateImageFile } from "@/lib/ipfs";
import { ActivityType } from "@/types";

// ---- İKONLAR ----
const BikeIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/>
    <path d="M15 6h-4l-3 11.5"/><path d="M9 6l2.5 6h7"/><path d="M18.5 17.5L14 8"/>
  </svg>
);
const RecycleIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 19H4.5a2.5 2.5 0 010-5H7"/><path d="M17 5h2.5a2.5 2.5 0 010 5H17"/>
    <path d="M12 2l3 3-3 3"/><path d="M12 22l-3-3 3-3"/><path d="M12 5v14"/>
    <path d="M5 12H2l3-3"/><path d="M19 12h3l-3 3"/>
  </svg>
);
const PlantIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22V12"/>
    <path d="M12 12C12 8 8 5 4 6c0 4 3 7 8 6z"/>
    <path d="M12 12C12 8 16 5 20 6c0 4-3 7-8 6z"/>
  </svg>
);
const BusIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="13" rx="2"/>
    <path d="M3 9h18"/><circle cx="7.5" cy="19.5" r="1.5"/><circle cx="16.5" cy="19.5" r="1.5"/>
    <path d="M7.5 18v-1.5M16.5 18v-1.5M8 4V2M16 4V2"/>
  </svg>
);

interface ActivityDef {
  type: ActivityType;
  label: string;
  question: string;
  confirmText: string;
  photoHint: string;       // "Bisikletinin yanında bir fotoğraf çek"
  desc: string;
  points: number;
  emoji: string;
  icon: React.ReactNode;
  accentColor: string;
  bgColor: string;
}

const ACTIVITIES: ActivityDef[] = [
  {
    type: "BIKE_TO_WORK",
    label: "İşe Bisikletle",
    question: "Bugün işe bisikletle gittin mi?",
    confirmText: "Evet, kaydedeyim!",
    photoHint: "📸 Bisikletinin veya park ettiğin yerin fotoğrafını çek",
    desc: "Sıfır emisyonlu işe gidiş",
    points: ACTIVITY_POINTS.BIKE_TO_WORK,
    emoji: "🚲",
    icon: <BikeIcon />,
    accentColor: "#7fff47",
    bgColor: "rgba(127,255,71,0.06)",
  },
  {
    type: "RECYCLE",
    label: "Geri Dönüşüm",
    question: "Bugün geri dönüşüm yaptın mı?",
    confirmText: "Evet, kaydedeyim!",
    photoHint: "📸 Geri dönüşüm kutusuna atarken veya atık torbanın fotoğrafını çek",
    desc: "Atık ayrıştırma yaptım",
    points: ACTIVITY_POINTS.RECYCLE,
    emoji: "♻️",
    icon: <RecycleIcon />,
    accentColor: "#47d4ff",
    bgColor: "rgba(71,212,255,0.06)",
  },
  {
    type: "PLANT_TREE",
    label: "Ağaç Diktim",
    question: "Bugün ağaç diktın mı?",
    confirmText: "Evet, kaydedeyim!",
    photoHint: "📸 Diktiğin fidanın ya da ağacın fotoğrafını çek",
    desc: "Doğaya katkı sağladım",
    points: ACTIVITY_POINTS.PLANT_TREE,
    emoji: "🌱",
    icon: <PlantIcon />,
    accentColor: "#ffdd47",
    bgColor: "rgba(255,221,71,0.06)",
  },
  {
    type: "PUBLIC_TRANSPORT",
    label: "Toplu Taşıma",
    question: "Bugün toplu taşıma kullandın mı?",
    confirmText: "Evet, kaydedeyim!",
    photoHint: "📸 Otobüs/metro bileti ya da durakta çekilmiş fotoğrafın",
    desc: "Otobüs/metro kullandım",
    points: ACTIVITY_POINTS.PUBLIC_TRANSPORT,
    emoji: "🚌",
    icon: <BusIcon />,
    accentColor: "#ff7f47",
    bgColor: "rgba(255,127,71,0.06)",
  },
];

// ---- MODAL STATE TİPİ ----
type ModalState =
  | { step: "idle" }
  | { step: "confirm"; def: ActivityDef }
  | { step: "loading"; def: ActivityDef; uploadingPhoto: boolean }
  | { step: "success"; def: ActivityDef; txHash: string; ipfsHash?: string };

// ---- FOTOĞRAF YÜKLEME ALANI ----
function PhotoUploader({
  accentColor,
  photoHint,
  onFileSelect,
  selectedFile,
  preview,
}: {
  accentColor: string;
  photoHint: string;
  onFileSelect: (f: File | null) => void;
  selectedFile: File | null;
  preview: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    const err = validateImageFile(file);
    if (err) { setError(err); return; }
    setError(null);
    onFileSelect(file);
  };

  return (
    <div>
      <p style={{ fontSize: 12, color: "var(--sage)", marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>
        {photoHint}
      </p>

      {/* Önizleme varsa göster */}
      {preview ? (
        <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 4 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="önizleme" style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
          <button
            onClick={() => onFileSelect(null)}
            style={{
              position: "absolute", top: 8, right: 8,
              background: "rgba(10,26,15,0.8)", border: "none",
              borderRadius: "50%", width: 28, height: 28,
              cursor: "pointer", color: "white", fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>
      ) : (
        // Sürükle-bırak / tıkla alanı
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault(); setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          style={{
            border: `2px dashed ${dragOver ? accentColor : "rgba(127,255,71,0.2)"}`,
            borderRadius: 12, padding: "24px 16px",
            textAlign: "center", cursor: "pointer",
            background: dragOver ? "rgba(127,255,71,0.04)" : "transparent",
            transition: "all 0.15s",
            marginBottom: 4,
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
          <p style={{ fontSize: 13, color: "var(--fog)", marginBottom: 4 }}>
            Fotoğraf seç veya buraya sürükle
          </p>
          <p style={{ fontSize: 11, color: "var(--sage)" }}>JPG, PNG, WEBP — max 5MB</p>
        </div>
      )}

      {error && (
        <p style={{ fontSize: 12, color: "#ff8080", marginTop: 4 }}>⚠️ {error}</p>
      )}

      {/* Gizli file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = ""; // aynı dosyayı tekrar seçebilmek için
        }}
      />

      {/* Fotoğraf isteğe bağlı notu */}
      <p style={{ fontSize: 11, color: "var(--sage)", fontFamily: "'DM Mono', monospace", marginTop: 6, textAlign: "center" }}>
        Fotoğraf isteğe bağlı — ama IPFS&apos;e kaydedilir 🌐
      </p>
    </div>
  );
}

// ---- ONAY MODALI ----
function ConfirmModal({
  modal,
  onConfirm,
  onClose,
}: {
  modal: ModalState;
  onConfirm: (file: File | null) => void;
  onClose: () => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (f: File | null) => {
    setSelectedFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  if (modal.step === "idle") return null;
  const def = (modal as { def: ActivityDef }).def;

  return (
    <div
      onClick={modal.step === "confirm" ? onClose : undefined}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(10,26,15,0.88)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        animation: "fadeIn 0.15s ease",
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--canopy)",
          border: `1px solid ${def.accentColor}44`,
          borderRadius: 24, padding: 32,
          maxWidth: 440, width: "100%",
          animation: "slideUp 0.2s ease",
        }}
      >

        {/* ADIM 1: Onay + fotoğraf yükleme */}
        {modal.step === "confirm" && (
          <>
            {/* Başlık */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: def.bgColor, border: `1px solid ${def.accentColor}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: def.accentColor, flexShrink: 0,
              }}>
                {def.icon}
              </div>
              <div>
                <h2 style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontWeight: 700, fontSize: 18, color: "var(--paper)", marginBottom: 2,
                }}>
                  {def.question}
                </h2>
                <p style={{ fontSize: 13, color: "var(--fog)" }}>
                  <strong style={{ color: def.accentColor }}>+{def.points} YP</strong> kazanacaksın
                </p>
              </div>
            </div>

            {/* Fotoğraf yükleme alanı */}
            <div style={{
              padding: 16, borderRadius: 14,
              background: "rgba(127,255,71,0.03)",
              border: "1px solid rgba(127,255,71,0.08)",
              marginBottom: 20,
            }}>
              <PhotoUploader
                accentColor={def.accentColor}
                photoHint={def.photoHint}
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                preview={preview}
              />
            </div>

            {/* Onur notu */}
            <p style={{
              fontSize: 12, color: "var(--sage)",
              textAlign: "center", marginBottom: 20,
              fontFamily: "'DM Mono', monospace",
            }}>
              🤝 Onur sistemi — dürüstlüğüne güveniyoruz
            </p>

            {/* Butonlar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() => onConfirm(selectedFile)}
                style={{
                  padding: "15px", borderRadius: 12, border: "none", cursor: "pointer",
                  background: def.accentColor, color: "var(--forest)",
                  fontFamily: "'Clash Display', sans-serif",
                  fontWeight: 700, fontSize: 15,
                }}
              >
                {def.confirmText} {def.emoji}
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: "12px", borderRadius: 12,
                  border: "1px solid rgba(127,255,71,0.15)",
                  cursor: "pointer", background: "transparent",
                  color: "var(--fog)", fontSize: 13,
                }}
              >
                Hayır, vazgeçtim
              </button>
            </div>
          </>
        )}

        {/* ADIM 2: Yükleniyor */}
        {modal.step === "loading" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{
              width: 64, height: 64,
              border: `3px solid ${def.accentColor}33`,
              borderTopColor: def.accentColor,
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 24px",
            }} />
            <h2 style={{
              fontFamily: "'Clash Display', sans-serif",
              fontWeight: 700, fontSize: 20, color: "var(--paper)", marginBottom: 8,
            }}>
              {modal.uploadingPhoto ? "Fotoğraf IPFS'e yükleniyor..." : "Zincire yazılıyor..."}
            </h2>
            <p style={{ fontSize: 13, color: "var(--fog)" }}>
              {modal.uploadingPhoto
                ? "Fotoğrafın merkeziyetsiz ağa kaydediliyor 🌐"
                : "Stellar ağına gönderiliyor, lütfen bekle"}
            </p>
          </div>
        )}

        {/* ADIM 3: Başarı */}
        {modal.step === "success" && (
          <div style={{ textAlign: "center" }}>
            {/* Büyük tik */}
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "rgba(127,255,71,0.12)",
              border: "2px solid rgba(127,255,71,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
              animation: "popIn 0.3s ease",
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                stroke="var(--lime)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>

            <h2 style={{
              fontFamily: "'Clash Display', sans-serif",
              fontWeight: 700, fontSize: 22, color: "var(--paper)", marginBottom: 6,
            }}>
              Kaydedildi! {def.emoji}
            </h2>
            <p style={{ fontSize: 14, color: "var(--fog)", marginBottom: 20 }}>
              <strong style={{ color: def.accentColor, fontSize: 20 }}>+{def.points}</strong> Yeşil Puan kazandın 🎉
            </p>

            {/* Kayıt detayları */}
            <div style={{
              padding: 14, borderRadius: 12,
              background: "rgba(127,255,71,0.05)",
              border: "1px solid rgba(127,255,71,0.12)",
              marginBottom: 20, textAlign: "left",
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              {/* TX hash */}
              <div>
                <p style={{ fontSize: 11, color: "var(--sage)", fontFamily: "'DM Mono', monospace", marginBottom: 3 }}>
                  STELLAR TX
                </p>
                <p style={{ fontSize: 12, color: "var(--lime)", fontFamily: "'DM Mono', monospace", wordBreak: "break-all" }}>
                  {modal.txHash}
                </p>
              </div>

              {/* IPFS hash varsa göster */}
              {modal.ipfsHash && (
                <div>
                  <p style={{ fontSize: 11, color: "var(--sage)", fontFamily: "'DM Mono', monospace", marginBottom: 3 }}>
                    IPFS FOTOĞRAF
                  </p>
                  <a
                    href={getIPFSUrl(modal.ipfsHash)}
                    target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 12, color: "#47d4ff", fontFamily: "'DM Mono', monospace", wordBreak: "break-all" }}
                  >
                    {modal.ipfsHash.slice(0, 20)}... ↗
                  </a>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              style={{
                width: "100%", padding: "14px", borderRadius: 12,
                border: "none", cursor: "pointer",
                background: "var(--lime)", color: "var(--forest)",
                fontFamily: "'Clash Display', sans-serif",
                fontWeight: 700, fontSize: 15,
              }}
            >
              Harika, devam et! 🌍
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes popIn   { from { transform: scale(0.5) } to { transform: scale(1) } }
        @keyframes spin    { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  );
}

// ---- KART BİLEŞENİ ----
function ActivityCard({ def, disabled, count, onOpen }: {
  def: ActivityDef; disabled: boolean; count: number;
  onOpen: (def: ActivityDef) => void;
}) {
  return (
    <div style={{
      background: "var(--canopy)", border: "1px solid rgba(127,255,71,0.12)",
      borderRadius: 20, padding: 24,
      display: "flex", flexDirection: "column", gap: 18,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: def.bgColor, border: `1px solid ${def.accentColor}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: def.accentColor,
        }}>
          {def.icon}
        </div>
        {count > 0 && (
          <div style={{
            background: def.bgColor, border: `1px solid ${def.accentColor}44`,
            borderRadius: 20, padding: "4px 10px",
            fontSize: 12, color: def.accentColor, fontFamily: "'DM Mono', monospace",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: def.accentColor, display: "inline-block" }} />
            {count}× bugün
          </div>
        )}
      </div>

      <div>
        <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: 18, color: "var(--paper)", marginBottom: 4 }}>
          {def.label}
        </h3>
        <p style={{ fontSize: 13, color: "var(--fog)", lineHeight: 1.5 }}>{def.desc}</p>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: 34, color: def.accentColor, lineHeight: 1 }}>
          +{def.points}
        </span>
        <span style={{ fontSize: 12, color: "var(--fog)", fontFamily: "'DM Mono', monospace" }}>YEŞİL PUAN</span>
      </div>

      <button
        onClick={() => !disabled && onOpen(def)}
        disabled={disabled}
        style={{
          width: "100%", padding: "15px", borderRadius: 12, border: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          background: disabled ? "rgba(127,255,71,0.06)" : def.accentColor,
          color: disabled ? "var(--sage)" : "var(--forest)",
          fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: 15,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          transition: "opacity 0.15s",
        }}
        onMouseEnter={e => !disabled && (e.currentTarget.style.opacity = "0.88")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        {disabled ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Cüzdanını Bağla
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
            Kaydet & {def.points} YP Kazan
          </>
        )}
      </button>
    </div>
  );
}

// ---- ANA BİLEŞEN ----
export default function ActivityButtons() {
  const { state, dispatch } = useApp();
  const disabled = state.walletStatus !== "CONNECTED";
  const [modal, setModal] = useState<ModalState>({ step: "idle" });

  const countOf = (type: ActivityType) =>
    state.activities.filter((a) => a.type === type).length;

  const handleOpen = (def: ActivityDef) =>
    setModal({ step: "confirm", def });

  const handleConfirm = async (photoFile: File | null) => {
    if (modal.step !== "confirm") return;
    const def = modal.def;
    let ipfsHash: string | undefined;

    // ---- ADIM 1: Fotoğraf varsa IPFS'e yükle ----
    if (photoFile) {
      setModal({ step: "loading", def, uploadingPhoto: true });
      try {
        ipfsHash = await uploadImageToIPFS(photoFile);
      } catch (err) {
        // Pinata yapılandırılmamışsa veya hata varsa fotoğrafsız devam et
        console.warn("IPFS yükleme başarısız, fotoğrafsız devam ediliyor:", err);
        ipfsHash = undefined;
      }
    }

    // ---- ADIM 2: Blockchain'e kaydet ----
    setModal({ step: "loading", def, uploadingPhoto: false });
    try {
      const { txHash } = await submitActivityToChain(def.type, state.walletAddress!);

      dispatch({
        type: "ADD_ACTIVITY",
        payload: {
          id: txHash,
          type: def.type,
          timestamp: Date.now(),
          greenPoints: def.points,
          txHash,
          // ipfsHash types/index.ts'e eklenecek
        },
      });

      setModal({ step: "success", def, txHash, ipfsHash });
    } catch {
      setModal({ step: "idle" });
    }
  };

  return (
    <section>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: 22, color: "var(--paper)", marginBottom: 4 }}>
          Aktivite Kaydet
        </h2>
        <p style={{ fontSize: 13, color: "var(--fog)" }}>
          {disabled
            ? "Kaydetmek için önce sağ üstten cüzdanını bağla →"
            : "Bir aktivite seç, isterisen fotoğraf ekle, onay ver."}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {ACTIVITIES.map((def) => (
          <ActivityCard
            key={def.type}
            def={def}
            disabled={disabled}
            count={countOf(def.type)}
            onOpen={handleOpen}
          />
        ))}
      </div>

      <ConfirmModal
        modal={modal}
        onConfirm={handleConfirm}
        onClose={() => setModal({ step: "idle" })}
      />
    </section>
  );
}
