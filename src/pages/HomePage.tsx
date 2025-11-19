import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import { fetchMenuData, MenuItem, getCategoriesFromMenu, createCategorySlug } from '../lib/googleSheets';

// Özel kategoriler için bilgiler (Kuver ve Fix Menü)
const specialCategories: Record<string, { title: string; description: string; slug: string }> = {
  'kuver': { title: 'Kuver', description: 'Kişi başı kuver ücreti', slug: 'kuver' },
  'fix-menu': { title: 'Fix Menü', description: 'Özel menü seçenekleri', slug: 'fix-menu' },
};

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
            {categories
              .filter(cat => {
                // Kuver ve Fix Menü ürünlerini içeren kategorileri normal kategorilerden ayırma
                // Çünkü bunlar "Çeşitler" ve "Menüler" kategorilerinde
                return true; // Tüm kategorileri göster
              })
              .map((category) => {
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

