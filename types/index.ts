// ===================================================
// Düşünce Zinciri: Tip tanımları - tüm app bu tipleri kullanır.
// Soroban entegrasyonu geldiğinde bu tipler on-chain veriye map olacak.
// ===================================================

// Desteklenen aktivite tipleri
export type ActivityType = "BIKE_TO_WORK" | "RECYCLE" | "PLANT_TREE" | "PUBLIC_TRANSPORT";

// Tek bir aktivite kaydı (on-chain log entry)
export interface ActivityRecord {
  id: string;
  type: ActivityType;
  timestamp: number; // Unix ms
  greenPoints: number;
  txHash?: string; // Sonraki aşamada Stellar tx hash burada olacak
}

// Kullanıcı istatistik özeti
export interface UserStats {
  walletAddress: string | null;
  totalGreenPoints: number;
  activitiesCount: number;
  breakdown: Record<ActivityType, number>;
}

// Cüzdan bağlantı durumu
export type WalletStatus = "DISCONNECTED" | "CONNECTING" | "CONNECTED" | "ERROR";

// Freighter cüzdan yanıtı (sonraki aşamada kullanılacak)
export interface FreighterResponse {
  publicKey: string;
  network: "MAINNET" | "TESTNET" | "FUTURENET";
}
