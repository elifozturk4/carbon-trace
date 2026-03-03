// ================================================================
// stellar.ts — @stellar/freighter-api v5 DOĞRU kullanim
// Kaynak: https://docs.freighter.app/docs/guide/usingfreighterwebapp
// ================================================================

export const STELLAR_NETWORK = {
  TESTNET: {
    networkPassphrase: "Test SDF Network ; September 2015",
    horizonUrl: "https://horizon-testnet.stellar.org",
    sorobanRpcUrl: "https://soroban-testnet.stellar.org",
  },
  MAINNET: {
    networkPassphrase: "Public Global Stellar Network ; September 2015",
    horizonUrl: "https://horizon.stellar.org",
    sorobanRpcUrl: "https://soroban-mainnet.stellar.org",
  },
} as const;

export const ACTIVE_NETWORK = STELLAR_NETWORK.TESTNET;
export const CONTRACT_ADDRESS = "PLACEHOLDER_CONTRACT_ADDRESS";

// ----------------------------------------------------------------
// Freighter yüklü mü?
// isConnected() → { isConnected: boolean } döner
// ----------------------------------------------------------------
export async function isFreighterInstalled(): Promise<boolean> {
  try {
    const { isConnected } = await import("@stellar/freighter-api");
    const res = await isConnected();
    return "isConnected" in res && res.isConnected === true;
  } catch {
    return false;
  }
}

// ----------------------------------------------------------------
// Cüzdana bağlan
// requestAccess() popup açar → { address, error } döner
// ----------------------------------------------------------------
export async function connectFreighterWallet(): Promise<string> {
  const { isConnected, requestAccess } = await import("@stellar/freighter-api");

  // Eklenti yüklü mü?
  const connRes = await isConnected();
  if (!connRes.isConnected) {
    throw new Error("FREIGHTER_NOT_INSTALLED");
  }

  // Popup aç, kullanıcıdan izin iste
  const accessRes = await requestAccess();

  // Kullanıcı reddettiyse
  if (accessRes.error) {
    throw new Error("REJECTED");
  }

  // Adres geldiyse döndür
  if (accessRes.address) {
    return accessRes.address;
  }

  throw new Error("REJECTED");
}

// ----------------------------------------------------------------
// Sayfa yenilenince otomatik yeniden bağlan
// getAddress() → önceden izin verilmişse direkt adres döner
// ----------------------------------------------------------------
export async function checkFreighterConnection(): Promise<string | null> {
  try {
    const { isConnected, getAddress } = await import("@stellar/freighter-api");

    const connRes = await isConnected();
    if (!connRes.isConnected) return null;

    const addrRes = await getAddress();
    if (addrRes.error || !addrRes.address) return null;

    return addrRes.address;
  } catch {
    return null;
  }
}

// ----------------------------------------------------------------
// Mock Soroban tx — Aşama 3'te gerçek tx olacak
// ----------------------------------------------------------------
export async function submitActivityToChain(
  _activityType: string,
  _walletAddress: string
): Promise<{ txHash: string }> {
  await new Promise((r) => setTimeout(r, 1200));
  return { txHash: "mock_" + Math.random().toString(36).slice(2, 18).toUpperCase() };
}

// ----------------------------------------------------------------
// Mock liderlik tablosu
// ----------------------------------------------------------------
export interface LeaderboardEntry {
  wallet: string;
  totalPoints: number;
  activityCount: number;
  isCurrentUser?: boolean;
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  await new Promise((r) => setTimeout(r, 800));
  return [
    { wallet: "GCEZ...G4YG", totalPoints: 480, activityCount: 9 },
    { wallet: "GBXK...M2PQ", totalPoints: 350, activityCount: 7 },
    { wallet: "GADF...K9WR", totalPoints: 280, activityCount: 6 },
    { wallet: "GCMN...X3TS", totalPoints: 210, activityCount: 4 },
    { wallet: "GDPL...A7FV", totalPoints: 180, activityCount: 4 },
    { wallet: "GBRT...Q2NJ", totalPoints: 130, activityCount: 3 },
  ];
}

// ----------------------------------------------------------------
// Yardımcılar
// ----------------------------------------------------------------
export function shortenAddress(address: string): string {
  if (address.length < 12) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function getTxExplorerUrl(txHash: string): string {
  if (txHash.startsWith("mock_")) return "#";
  return "https://stellar.expert/explorer/testnet/tx/" + txHash;
}
