import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuSection from '../components/MenuSection';
import { fetchMenuData, MenuItem, getCategoriesFromMenu, createCategorySlug } from '../lib/googleSheets';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const highlight = searchParams.get('highlight');
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<{ title: string; description: string; slug: string } | undefined>(undefined);

  useEffect(() => {
    async function loadMenu() {
      try {
        const data = await fetchMenuData();
        
        if (!data || data.length === 0) {
          console.error('Menü verisi boş');
          setLoading(false);
          return;
        }
        
        const categoryNames = getCategoriesFromMenu(data);
        console.log('Bulunan kategoriler:', categoryNames);
        console.log('Aranan slug:', slug);
        
        // Slug'a göre kategori bul
        const foundCategory = categoryNames.find(cat => {
          const catSlug = createCategorySlug(cat);
          console.log(`Kategori: ${cat}, Slug: ${catSlug}, Eşleşme: ${catSlug === slug}`);
          return catSlug === slug;
        });
        
        if (foundCategory) {
          setCategory({
            title: foundCategory,
            description: getCategoryDescription(foundCategory),
            slug: createCategorySlug(foundCategory),
          });
          setMenuItems(data.filter(item => item.category === foundCategory));
        } else {
          console.warn('Kategori bulunamadı. Mevcut kategoriler:', categoryNames);
        }
      } catch (error) {
        console.error('Menü yüklenirken hata:', error);
        // Hata durumunda da loading'i false yap
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadMenu();
    }
  }, [slug]);

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

  useEffect(() => {
    if (highlight && !loading && category) {
      setTimeout(() => {
        const itemId = `item-${highlight.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
        const element = document.getElementById(itemId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-4', 'ring-gold-200');
          setTimeout(() => {
            element.classList.remove('ring-4', 'ring-gold-200');
          }, 2000);
        }
      }, 500);
    }
  }, [highlight, loading, category]);

  // Loading state'i önce kontrol et
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <motion.div 
            className="inline-block h-12 w-12 rounded-full border-4 border-solid border-sky border-r-transparent mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-sky font-serif text-xl">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Loading bittikten sonra kategori kontrolü yap
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-navy mb-4">Kategori Bulunamadı</h1>
          <p className="text-navy/60 mb-4 font-sans">Aradığınız kategori bulunamadı veya henüz yüklenmedi.</p>
          <Link to="/" className="text-sky hover:text-sky/80 underline font-sans">
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="relative">
        <Header />
        
        <main className="max-w-5xl mx-auto px-6 py-8 pb-16">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-sky hover:text-sky/80 transition-colors mb-8 group font-sans"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Kategorilere Dön</span>
          </Link>

          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <img
                src={`/products/icons/${getCategoryIconName(slug || '')}.png`}
                alt={category.title}
                className="w-full h-full object-contain"
                style={{ filter: 'brightness(0) saturate(100%) invert(8%) sepia(75%) saturate(3000%) hue-rotate(220deg) brightness(0.4) contrast(1.5)' }}
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif mb-3" style={{ color: '#000000', fontWeight: 900 }}>
              {category.title}
            </h1>
            <p className="text-navy/70 max-w-2xl mx-auto font-sans">
              {category.description}
            </p>
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="h-px w-12 bg-beige"></div>
              <div className="w-2 h-2 rounded-full bg-beige"></div>
              <div className="h-px w-12 bg-beige"></div>
            </div>
          </motion.div>

          {menuItems.length > 0 ? (
            <MenuSection title="" items={menuItems} />
          ) : (
            <div className="text-center py-20">
              <p className="text-navy/60 font-sans">Bu kategoride henüz ürün bulunmamaktadır.</p>
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

function getCategoryIconName(slug: string): string {
  const icons: Record<string, string> = {
    'cesitler': 'nuts',
    'menuler': 'star',
    'tatlilar': 'cake',
    'sicak-mezeler': 'flame',
    'ana-yemekler': 'meat',
    'soguk-mezeler': 'dish',
    'salatalar': 'salad',
    'icecekler': 'coffee',
    'meyveler': 'fruits',
  };
  return icons[slug] || 'dish';
}

