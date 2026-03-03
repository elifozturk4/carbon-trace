// ================================================================
// ipfs.ts — Pinata üzerinden IPFS'e fotoğraf yükleme
// Pinata ücretsiz plan: 1GB, sınırsız dosya
// Kayıt: https://app.pinata.cloud → API Keys → New Key
// ================================================================

// Pinata API'ye istek at — fotoğrafı IPFS'e yükle
export async function uploadImageToIPFS(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("PINATA_NOT_CONFIGURED");
  }

  // FormData ile dosyayı Pinata'ya gönder
  const formData = new FormData();
  formData.append("file", file);

  // Dosyaya metadata ekle (opsiyonel ama iyi pratik)
  const metadata = JSON.stringify({
    name: `carbon-trace-${Date.now()}`,
    keyvalues: { app: "carbon-trace", type: "activity-proof" },
  });
  formData.append("pinataMetadata", metadata);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      pinata_api_key: apiKey,
      pinata_secret_api_key: apiSecret,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("IPFS yükleme hatası: " + err);
  }

  const data = await res.json();
  // data.IpfsHash → "QmXyz..." formatında IPFS hash'i döner
  return data.IpfsHash as string;
}

// IPFS hash'inden görüntülenebilir URL üret
// Pinata gateway kullanarak tarayıcıda açılabilir hale getirir
export function getIPFSUrl(hash: string): string {
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
}

// Dosya boyutu kontrolü — max 5MB
export function validateImageFile(file: File): string | null {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (!ALLOWED.includes(file.type)) {
    return "Sadece JPG, PNG, WEBP veya GIF yükleyebilirsin.";
  }
  if (file.size > MAX_SIZE) {
    return "Dosya 5MB'dan küçük olmalı.";
  }
  return null;
}
