# 🌿 Carbon Trace

**Stellar blok zinciri üzerinde çalışan, düşük karbonlu yaşamı ödüllendiren bir sürdürülebilirlik uygulaması.**

---

## 📖 Bu Proje Ne?

Carbon Trace, günlük hayatında çevre dostu davranışlar sergileyen kullanıcıları **Yeşil Puan (YP)** ile ödüllendiren bir **dApp**'tir (merkeziyetsiz uygulama).

Uygulama şu şekilde çalışır:

1. Kullanıcı Stellar cüzdanını bağlar
2. "İşe Bisikletle Gittim" veya "Geri Dönüşüm Yaptım" gibi butonlara basar
3. Bu aktivite **Stellar blok zincirine** kaydedilir
4. Kullanıcı **Yeşil Puan** kazanır ve istatistiklerini takip edebilir

Bütün kayıtlar blok zincirinde tutulduğu için değiştirilemez, şeffaf ve doğrulanabilirdir — kimse "ben yaptım" diyip yapmış gibi gösteremez.

---

## 🧠 Temel Kavramlar (Hiç Bilmiyorum Diyenler İçin)

### Blok Zinciri (Blockchain) Nedir?

Binlerce bilgisayarda aynı anda saklanan, değiştirilemeyen bir kayıt defteridir. Bir şeyi zincire yazdığında artık silinemez veya değiştirilemez. Bu yüzden "sen şu aktiviteyi gerçekten yaptın" demek için güvenilir bir kanıt sunar.

### Stellar Nedir?

Bitcoin ve Ethereum gibi bir blok zinciridir ama özellikle **hızlı ve ucuz işlemler** için tasarlanmıştır. İşlemler 3-5 saniyede tamamlanır ve ücreti bir kuruşun çok küçük bir parçasıdır. Carbon Trace bu zinciri kullanır.

### Soroban Nedir?

Stellar'ın **akıllı kontrat** platformudur. Akıllı kontrat, blok zinciri üzerinde çalışan bir programdır — aracıya gerek kalmadan "eğer A olursa B'yi yap" mantığıyla otomatik çalışır. Carbon Trace'de Soroban kontratı şunu yapacak: "Kullanıcı aktivite bildirirse, hesabına Yeşil Puan ekle."

### dApp Nedir?

"Decentralized Application" — merkeziyetsiz uygulama. Normal uygulamalardan farkı, verilerinin bir şirketin sunucusunda değil blok zincirinde saklanmasıdır. Carbon Trace kapansa bile zincirdeki kayıtlar sonsuza kadar erişilebilir kalır.

### Freighter Nedir?

Stellar için bir **tarayıcı cüzdan eklentisidir** (Chrome/Firefox). MetaMask'ı duymuşsan, Freighter onun Stellar versiyonudur. Kullanıcılar bu cüzdanla uygulamaya giriş yapar ve işlemleri imzalar.

### Yeşil Puan (YP) Nedir?

Uygulamaya özgü bir puan sistemidir. Her aktivitenin belirli bir YP değeri vardır:

| Aktivite | Yeşil Puan |
|---|---|
| İşe Bisikletle Git | +50 YP |
| Geri Dönüşüm | +30 YP |
| Ağaç Dik | +100 YP |
| Toplu Taşıma | +25 YP |

---

## 🏗️ Proje Yapısı

```
carbon-trace/
│
├── app/                        ← Next.js sayfa dosyaları
│   ├── layout.tsx              ← Tüm sayfaları saran dış çerçeve (header dahil)
│   ├── page.tsx                ← Ana sayfa (hero, istatistikler, grid düzeni)
│   └── globals.css             ← Tasarım sistemi (renkler, fontlar, animasyonlar)
│
├── components/                 ← Tekrar kullanılabilir UI bileşenleri
│   ├── WalletConnect.tsx       ← Üst bar: cüzdan bağla/kes butonu
│   ├── ActivityButtons.tsx     ← Bisiklet ve Geri Dönüşüm aktivite kartları
│   ├── GreenStats.tsx          ← Kullanıcının puan ve istatistik paneli
│   └── ActionLog.tsx           ← Yapılan aktivitelerin geçmiş listesi
│
├── lib/                        ← Uygulama mantığı
│   ├── AppContext.tsx          ← Global state yönetimi (cüzdan durumu, aktiviteler)
│   └── stellar.ts              ← Stellar/Freighter bağlantı katmanı (Aşama 2 hazırlığı)
│
├── types/                      ← TypeScript tip tanımları
│   └── index.ts                ← ActivityType, UserStats, WalletStatus vb.
│
├── next.config.mjs             ← Next.js yapılandırması
├── tailwind.config.ts          ← Tailwind CSS özel renk ve font tanımları
└── tsconfig.json               ← TypeScript yapılandırması (strict mode)
```

---

## 🛠️ Kullanılan Teknolojiler

| Teknoloji | Ne İşe Yarıyor? |
|---|---|
| **Next.js 14** | React tabanlı web framework. Sayfaları ve routing'i yönetir. App Router mimarisi kullanır. |
| **TypeScript** | JavaScript'in tip güvenli versiyonu. Hataları geliştirme aşamasında yakalar. Strict mode açık. |
| **Tailwind CSS** | Utility-first CSS framework. Sınıf isimleriyle hızlı stil yazılmasını sağlar. |
| **React Context API** | Global state yönetimi. Cüzdan durumu ve aktivite listesi tüm bileşenler tarafından paylaşılır. `useReducer` ile yönetilir. |
| **@stellar/stellar-sdk** | Stellar blok zinciriyle iletişim için resmi JavaScript kütüphanesi. Şu an kurulu ama henüz aktif kullanılmıyor (Aşama 2'ye hazırlık). |
| **Clash Display + DM Sans + DM Mono** | Google Fonts'tan üç farklı font ailesi. Başlıklar, metin ve kod değerleri için ayrı ayrı kullanılır. |

---

## 🎨 Tasarım Sistemi

Uygulama **"Doğa Blockchain ile Buluşuyor"** teması üzerine kuruludur.

**Renk Paleti:**

```
--forest:  #0a1a0f  → Ana arka plan (derin orman yeşili)
--canopy:  #0f2518  → Kart ve header arka planı
--lime:    #7fff47  → Ana aksan rengi (canlı yeşil)
--mist:    #c8e6c0  → Ana metin rengi
--fog:     #8fb898  → İkincil metin rengi
--sage:    #3a6b45  → Pasif/devre dışı öğeler
```

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- Node.js 18 veya üzeri
- npm veya yarn

### Adımlar

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Geliştirme sunucusunu başlat
npm run dev

# 3. Tarayıcıda aç
# http://localhost:3000
```

### Diğer Komutlar

```bash
npm run build    # Production build oluşturur
npm run start    # Production build'i çalıştırır
npm run lint     # Kod kalitesi kontrolü
```

> **Not:** Eğer `.next` klasörü varsa ve hata alıyorsan önce `rm -rf .next node_modules` komutunu çalıştırıp `npm install` ile yeniden başla.

---

## 📋 Bileşenler Detaylı Açıklaması

### `WalletConnect.tsx` — Üst Bar

Sayfanın en üstündeki navigasyon çubuğudur. İki durumu vardır:

- **Bağlı değil:** "Cüzdanı Bağla" butonu görünür. Tıklandığında Freighter cüzdana bağlanma isteği gönderir.
- **Bağlı:** Cüzdan adresi kısaltılmış halde (`GCEZ...G4YG` formatında) gösterilir. "Bağlantıyı Kes" butonu çıkar.

> Şu an gerçek Freighter bağlantısı yoktur, mock (sahte) bir adres kullanılır. Aşama 2'de gerçek bağlantı kurulacak.

### `ActivityButtons.tsx` — Aktivite Kartları

Yan yana iki büyük kart içerir:

- **İşe Bisikletle Git** → +50 YP
- **Geri Dönüşüm** → +30 YP

Cüzdan **bağlı değilse** kartlar devre dışıdır (`disabled`) ve üzerlerine tıklanamaz. Cüzdan bağlandığında aktif hale gelir ve her tıklamada `logActivity()` fonksiyonu çağrılarak aktivite kaydedilir.

### `GreenStats.tsx` — İstatistik Paneli

Kullanıcının kişisel istatistiklerini gösterir:

- Toplam Yeşil Puan (büyük sayı olarak)
- Her aktivite türü için ayrı ayrı kaç kez yapıldığı ve kaç YP kazanıldığı

Cüzdan bağlı değilken veriler `—` olarak gösterilir.

### `ActionLog.tsx` — Aktivite Geçmişi

Yapılan aktivitelerin zaman damgalı listesidir. Her kayıt şunları gösterir:

- Aktivite ikonu ve adı
- Kaç YP kazanıldığı
- Ne kadar önce yapıldığı ("3 sn önce", "2 dk önce" gibi)
- İşlem ID'si (Aşama 2'de gerçek Stellar transaction hash'i olacak)

### `AppContext.tsx` — Global State

Tüm uygulamanın ortak hafızasıdır. React'ın Context API'si ve `useReducer` hook'u ile yönetilir. Şunları tutar:

- `walletStatus`: Cüzdan durumu (DISCONNECTED / CONNECTING / CONNECTED / ERROR)
- `walletAddress`: Bağlı cüzdanın Stellar adresi
- `activities`: Yapılan aktivitelerin listesi
- `userStats`: Hesaplanan istatistikler (toplam puan, aktivite sayıları)

### `stellar.ts` — Blockchain Katmanı

Stellar ağı ile iletişim için hazırlanan dosyadır. Şu an içinde:

- Stellar ağ yapılandırmaları (Testnet ve Mainnet adresleri)
- Freighter bağlantı fonksiyonu (placeholder — henüz gerçek kod yok)
- Cüzdan adresini kısaltma yardımcı fonksiyonu

---

## 🗺️ Geliştirme Yol Haritası

Bu proje 4 aşamalı olarak planlanmıştır:

```
✅ Aşama 1 — Frontend (Şu an burada)
   Tüm UI bileşenleri, tasarım sistemi, state yönetimi.
   Blockchain bağlantısı yok, veriler tarayıcıda tutulur.

⏳ Aşama 2 — Cüzdan Entegrasyonu
   Freighter cüzdan eklentisiyle gerçek bağlantı.
   Kullanıcının kendi Stellar adresiyle giriş yapması.
   stellar.ts içindeki TODO'ların tamamlanması.

⏳ Aşama 3 — Akıllı Kontrat
   Rust ile Soroban akıllı kontratının yazılması.
   Stellar Testnet'e deploy edilmesi.
   Her aktivite kaydının gerçek bir blockchain işlemi olması.
   txHash alanının doldurulması ve Stellar Explorer'a linklenmesi.

⏳ Aşama 4 — Mainnet & Ürün
   Testnet'ten Mainnet'e geçiş.
   Liderlik tablosu, sosyal paylaşım, ek aktivite türleri.
   PWA (Progressive Web App) desteği.
```

---

## 🔧 Geliştirici Notları

### Neden SSR'da `@stellar/stellar-sdk` import edilmiyor?

`@stellar/stellar-sdk` kütüphanesi Node.js ortamına özgü modüller (`Buffer`, `crypto`, `fs`) kullandığı için Next.js'in sunucu tarafı render (SSR) aşamasında çalıştırıldığında hata verir. Bu yüzden:

- `stellar.ts` dosyasında SDK import edilmez, ağ değerleri hardcoded yazılır
- `next.config.mjs`'de webpack'e SDK'nın server bundle'dan dışarıda tutulması söylenir
- Aşama 2'de SDK yalnızca `"use client"` direktifine sahip bileşenlerde `dynamic import` ile kullanılacak

### Neden `src/` klasörü yok?

Next.js hem `src/app/` hem de `app/` yapısını destekler ama Windows ortamında ikisi aynı anda tanındığında çakışma yaşanır. Proje düz `app/`, `components/`, `lib/` yapısını kullanır.

### TypeScript Strict Mode

`tsconfig.json`'da `"strict": true` aktiftir. Bu şu anlama gelir: `null` kontrolü, tip dönüşümü ve olası hatalar için en katı kurallar uygulanır. Daha güvenli kod yazılmasını sağlar.

---

## 📁 Önemli Dosya Değişkenleri

Aşama 2'ye geçerken değiştirilmesi gereken yerler:

```typescript
// lib/stellar.ts
export const CONTRACT_ADDRESS = "PLACEHOLDER_CONTRACT_ADDRESS";
// ↑ Deploy edilen Soroban kontrat adresi buraya gelecek

export const ACTIVE_NETWORK = STELLAR_NETWORK.TESTNET;
// ↑ Mainnet'e geçerken STELLAR_NETWORK.MAINNET yapılacak

// components/WalletConnect.tsx
const mockPublicKey = "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGCEN5ASAIZUEQTFBN4G4YG";
// ↑ Bu satır silinip window.freighter.getPublicKey() çağrısı gelecek
```

---

## 📄 Lisans

MIT — Özgürce kullanabilir, değiştirebilir ve dağıtabilirsin.

---

<div align="center">
  <p>🌿 Küçük adımlar, büyük fark yaratır.</p>
  <p>Built with Next.js · Stellar · Soroban</p>
</div>
