import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import { fetchMenuData, MenuItem, getCategoriesFromMenu, createCategorySlug } from '../lib/googleSheets';

export default function HomePage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Array<{ title: string; description: string; slug: string }>>([]);

  useEffect(() => {
    async function loadMenu() {
      try {
        const data = await fetchMenuData();
        setMenuItems(data);
        
        // Kategorileri dinamik olarak oluştur
        const categoryNames = getCategoriesFromMenu(data);
        const categoryList = categoryNames.map(cat => ({
          title: cat,
          description: getCategoryDescription(cat),
          slug: createCategorySlug(cat),
        }));
        setCategories(categoryList);
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

  const getCategoryDescription = (categoryName: string): string => {
    const descriptions: Record<string, string> = {
      'Çeşitler': 'Çeşitli seçenekler',
      'Menüler': 'Özel menü seçenekleri',
      'Tatlılar': 'Geleneksel ve özel tatlılar',
      'Sıcak Mezeler': 'Sıcak mezeler ve atıştırmalıklar',
      'Ana Yemekler': 'Közden gelen lezzetler',
      'Soğuk Mezeler': 'Soğuk mezeler ve lezzetler',
      'Salatalar': 'Taze ve sağlıklı salatalar',
      'İçecekler': 'Sıcak, soğuk ve alkollü içecekler',
      'Meyveler': 'Taze mevsim meyveleri',
    };
    return descriptions[categoryName] || 'Lezzetli seçenekler';
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
          <SearchBar items={menuItems} categoryInfo={Object.fromEntries(
            categories.map(cat => [cat.slug, cat])
          )} />

          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((category) => {
                const items = getItemsByCategory(category.title);
                if (items.length === 0) return null;
                
                return (
                  <CategoryCard
                    key={category.slug}
                    title={category.title}
                    description={category.description}
                    itemCount={items.length}
                    slug={category.slug}
                    icon={getIconName(category.slug)}
                  />
                );
              })}
          </div>
        </main>
        
        <Footer />
        
        {/* Fixed Reservation Button - Mobile Friendly */}
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50 bg-gradient-to-t from-[#F8F3EA] via-[#F8F3EA]/95 to-transparent pb-6 pt-10 pointer-events-none">
          <a 
            href="https://wa.me/905347665616" 
            target="_blank" 
            rel="noopener noreferrer"
            className="pointer-events-auto block w-full max-w-md mx-auto bg-navy text-cream border border-navy/20 rounded-xl px-6 py-4 shadow-xl shadow-navy/20 backdrop-blur-md transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            style={{ backgroundColor: '#0B1957', color: '#F8F3EA' }}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-green-900/20 animate-pulse">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs text-cream/70 font-sans tracking-wider uppercase">Özel Günler İçin</span>
                <span className="text-lg font-serif font-medium tracking-wide">İleri Tarihli Rezervasyon</span>
              </div>
              <div className="ml-auto">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-cream/70">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

// Icon mapping - Dinamik kategori slug'larına göre icon seç
function getIconName(slug: string): string {
  const iconMap: Record<string, string> = {
    'cesitler': 'nuts',
    'menuler': 'star',
    'menu': 'star',
    'tatlilar': 'cake',
    'tatli': 'cake',
    'sicak-mezeler': 'flame',
    'sicak-meze': 'flame',
    'ana-yemekler': 'meat',
    'ana-yemek': 'meat',
    'soguk-mezeler': 'dish',
    'soguk-meze': 'dish',
    'salatalar': 'salad',
    'salata': 'salad',
    'icecekler': 'coffee',
    'icecek': 'coffee',
    'meyveler': 'fruits',
    'meyve': 'fruits',
  };
  
  // Slug'dan eşleşme bul
  for (const [key, icon] of Object.entries(iconMap)) {
    if (slug.includes(key) || key.includes(slug)) {
      return icon;
    }
  }
  
  return 'dish';
}

