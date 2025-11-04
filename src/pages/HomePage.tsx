import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import { fetchMenuData, MenuItem } from '../lib/googleSheets';

export const categoryInfo: Record<string, { title: string; description: string; slug: string }> = {
  'baslangiclar': { title: 'Başlangıçlar', description: 'Sıcak çorbalar ile başlayın', slug: 'baslangiclar' },
  'mezeler': { title: 'Mezeler', description: 'Soğuk mezeler ve lezzetler', slug: 'mezeler' },
  'ara-sicaklar': { title: 'Ara Sıcaklar', description: 'Sıcak atıştırmalıklar', slug: 'ara-sicaklar' },
  'salatalar': { title: 'Salatalar', description: 'Taze ve sağlıklı', slug: 'salatalar' },
  'ana-yemekler': { title: 'Ana Yemekler', description: 'Közden gelen lezzetler', slug: 'ana-yemekler' },
  'spesyaller': { title: 'Spesyaller', description: 'Özel tariflerimiz', slug: 'spesyaller' },
  'tatlilar': { title: 'Tatlılar', description: 'Geleneksel tatlılar', slug: 'tatlilar' },
  'icecekler': { title: 'İçecekler', description: 'Sıcak ve soğuk içecekler', slug: 'icecekler' },
  'alkoller': { title: 'Alkoller', description: 'Rakı, şarap, bira ve daha fazlası', slug: 'alkoller' },
  'aperatifler': { title: 'Aperatifler', description: 'Kuruyemiş çeşitleri', slug: 'aperatifler' },
  'meyveler': { title: 'Meyveler', description: 'Taze mevsim meyveleri', slug: 'meyveler' },
};

export default function HomePage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      try {
        const data = await fetchMenuData();
        setMenuItems(data);
      } catch (error) {
        console.error('Menü yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  const getItemsByCategory = (categoryTitle: string) => {
    return menuItems.filter(item => item.category === categoryTitle);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <motion.div 
            className="inline-block h-12 w-12 rounded-full border-4 border-solid border-sky border-r-transparent mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-sky font-serif text-xl">Menümüz hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F3EA' }}>
      <div className="relative" style={{ 
        background: 'linear-gradient(to bottom, #E6D8C7 0%, #F8F3EA 50%, #F8F3EA 100%)',
        position: 'relative'
      }}>
        {/* Altın tonları overlay */}
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center top, rgba(230, 216, 199, 0.5) 0%, rgba(248, 243, 234, 0.3) 40%, transparent 70%)'
        }}></div>
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          background: 'linear-gradient(135deg, rgba(230, 216, 199, 0.2) 0%, transparent 50%, rgba(230, 216, 199, 0.15) 100%)'
        }}></div>
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 py-12 relative z-10">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-xl md:text-2xl font-sans mb-3 font-semibold" style={{
              background: 'linear-gradient(to right, #0B1957 0%, #0B1957 70%, #2a4a7a 90%, #4a6a9a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textAlign: 'center',
              marginBottom: '0.5rem',
              color: '#0B1957'
            }}>
              Zarif Lezzetler, Şık Atmosfer
            </h2>
            <p className="max-w-2xl mx-auto font-sans text-sm md:text-base font-light leading-relaxed" style={{
              background: 'linear-gradient(to right, #0B1957 0%, #1a2a5a 50%, #2a4a7a 80%, #4a6a9a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textAlign: 'center',
              letterSpacing: '0.3px',
              color: '#0B1957'
            }}>
              Geleneksel lezzetlerin modern dokunuşlarla buluştuğu mekan. Her tabak, bir hikaye anlatır.
            </p>
          </motion.div>

          {/* Search Bar */}
          <SearchBar items={menuItems} categoryInfo={categoryInfo} />

          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Object.entries(categoryInfo).map(([key, category]) => {
              const items = getItemsByCategory(category.title);
              if (items.length === 0) return null;
              
              return (
                <CategoryCard
                  key={key}
                  title={category.title}
                  description={category.description}
                  itemCount={items.length}
                  slug={category.slug}
                  icon={getIconName(key)}
                />
              );
            })}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

// Icon mapping - MuteRestaurant'taki icon isimlerini kullan
function getIconName(key: string): string {
  const iconMap: Record<string, string> = {
    'baslangiclar': 'soup',
    'mezeler': 'dish',
    'ara-sicaklar': 'flame',
    'salatalar': 'salad',
    'ana-yemekler': 'meat',
    'spesyaller': 'star',
    'tatlilar': 'cake',
    'icecekler': 'coffee',
    'alkoller': 'wine',
    'aperatifler': 'nuts',
    'meyveler': 'fruits',
  };
  return iconMap[key] || 'dish';
}

