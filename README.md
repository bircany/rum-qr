# Rum Meyhanesi - QR Menü

Rum Meyhanesi için tasarlanmış modern, şık ve zarif bir QR kod menü web sitesi. **Google Sheets entegrasyonu** ile menünüzü kolayca güncelleyin!

## 🎨 Tasarım Özellikleri

- **Renk Paleti**: Beyaz ve krem tonları (#FAF8F3), altın/bej vurgular (#D7BFAE)
- **Estetik**: Minimalist, klasik, lüks, Akdeniz/sahil temalı, zamansız
- **Responsive**: Mobil-öncelikli tasarım (QR kod taraması için mükemmel)
- **Animasyonlar**: Framer Motion ile yumuşak geçişler ve hover efektleri
- **Tipografi**: Serif (Playfair Display) ve modern sans-serif (Inter) kombinasyonu

## 🚀 Hızlı Başlangıç

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini açın

## 📱 Özellikler

### ✨ Ana Sayfa
- **Kategori Kartları**: Google Sheets'teki tüm kategoriler otomatik gösterilir
- **Arama**: Menüde hızlı arama (ürün adı, açıklama, kategori)
- **Animasyonlar**: Smooth scroll ve card hover efektleri

### 📂 Kategori Sayfaları
- **Dinamik Routing**: Her kategori için ayrı sayfa (`/kategori/mezeler`)
- **Alt Kategoriler**: Örn: İçecekler > Rakı, Şarap, Votka
- **Ürün Kartları**: Resim, açıklama, fiyat bilgisi
- **Highlight**: Aramadan gelen ürünler otomatik vurgulanır

### 🔍 Arama Özelliği
- Gerçek zamanlı arama
- Ürün adı, açıklama ve kategoriye göre filtreleme
- Dropdown ile hızlı sonuçlar
- Seçilen ürüne otomatik scroll

### 🎯 Google Sheets Entegrasyonu
- **Canlı Güncelleme**: Google Sheets'i düzenleyin, sayfa yenileyin!
- **Kolay Yönetim**: Teknik bilgi gerektirmez
- **Görsel Destek**: Resim URL'leri ile ürün görselleri
- **Yedek Veri**: Bağlantı sorunu olursa örnek menü gösterilir

## 🛠️ Teknolojiler

- **React 18** - Modern UI kütüphanesi
- **TypeScript** - Type-safe kod
- **Vite** - Hızlı build aracı
- **React Router** - Sayfa yönlendirme
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Animasyonlar
- **Google Sheets API** - Dinamik veri kaynağı

## 📝 Kategoriler

Google Sheets'teki tüm kategoriler otomatik olarak gösterilir:
- 🍲 Başlangıçlar
- 🧆 Mezeler
- 🔥 Ara Sıcaklar
- 🥗 Salatalar
- 🍖 Ana Yemekler
- ⭐ Spesyaller
- 🍰 Tatlılar
- ☕ İçecekler
- 🍷 Alkoller
- 🥜 Aperatifler
- 🍇 Meyveler

## 🎯 Üretim Build

```bash
npm run build
npm run preview  # Build'i önizle
```

Build edilen dosyalar `dist/` klasöründe oluşturulur.

### Deployment Önerileri:
- **Vercel**: Zero-config deployment (önerilen)
- **Netlify**: Kolay CI/CD
- **GitHub Pages**: Ücretsiz hosting

## 📂 Proje Yapısı

```
RumMeyhanesi/
├── src/
│   ├── components/        # UI komponentleri
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── MenuItem.tsx
│   │   ├── MenuSection.tsx
│   │   └── SearchBar.tsx
│   ├── pages/            # Sayfa komponentleri
│   │   ├── HomePage.tsx
│   │   └── CategoryPage.tsx
│   ├── lib/              # Yardımcı kütüphaneler
│   │   └── googleSheets.ts
│   ├── App.tsx           # Router yapılandırması
│   └── main.tsx          # Entry point
└── public/               # Statik dosyalar
```

## 🎨 Renk Paleti

```css
Cream Tones:
- cream-50:  #FDFCFA
- cream-100: #FAF8F3 (ana arkaplan)
- cream-200: #F5F2EB
- cream-300: #EBE6DC

Gold Accents:
- gold-100: #E8D5C4
- gold-200: #D7BFAE (vurgu rengi)
- gold-300: #C4A890

Charcoal:
- charcoal: #2B2B2B (ana metin)
- charcoal-light: #4A4A4A
```

## 📄 Lisans

© 2025 Rum Meyhanesi — Yeni Nesil Meyhane Deneyimi

**Yapımcı:** Modern QR Menü Sistemi | Akdeniz esintisi ile 🍷

