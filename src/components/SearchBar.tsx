import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItem } from '../lib/googleSheets';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  items: MenuItem[];
  categoryInfo: Record<string, { title: string; slug: string }>;
}

export default function SearchBar({ items, categoryInfo }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems([]);
      setIsOpen(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = items.filter(item =>
      item.productName.toLowerCase().includes(query) ||
      item.productDescription.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
    setFilteredItems(results.slice(0, 5));
    setIsOpen(results.length > 0);
  }, [searchQuery, items]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectItem = (item: MenuItem) => {
    const categoryEntry = Object.values(categoryInfo).find(c => c.title === item.category);
    if (categoryEntry) {
      navigate(`/kategori/${categoryEntry.slug}?highlight=${encodeURIComponent(item.productName)}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  return (
    <div className="mb-12" ref={searchRef}>
      <div className="max-w-2xl mx-auto relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Menüde ara... (Örn: Yeni Rakı, Adana Kebap)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 pl-14 rounded-2xl border focus:border-sky focus:outline-none transition-all font-sans shadow-sm"
            style={{ 
              backgroundColor: '#F8F3EA',
              borderColor: '#E6D8C7',
              color: '#0B1957',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              if (input.value === '') {
                input.style.setProperty('color', '#0B1957', 'important');
              }
            }}
            onFocus={(e) => e.target.style.borderColor = '#9ECCFA'}
            onBlur={(e) => e.target.style.borderColor = '#E6D8C7'}
          />
          <div className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: '#0B1957' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 rounded-2xl shadow-lg border overflow-hidden"
              style={{ 
                backgroundColor: '#F8F3EA',
                borderColor: '#E6D8C7',
                boxShadow: '0 4px 12px rgba(11, 25, 87, 0.1)' 
              }}
            >
              {filteredItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectItem(item)}
                  className="w-full px-6 py-4 text-left transition-colors last:border-b-0 group"
                  style={{ 
                    borderBottom: index < filteredItems.length - 1 ? '1px solid #E6D8C7' : 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E6D8C7'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-serif text-lg mb-1 transition-colors" style={{ color: '#0B1957' }}>
                        {item.productName}
                      </h4>
                      <p className="text-sm line-clamp-1" style={{ color: '#9ECCFA' }}>
                        {item.productDescription}
                      </p>
                      <span className="text-xs mt-1 inline-block" style={{ color: '#9ECCFA' }}>
                        {item.category}
                      </span>
                    </div>
                    <span className="text-lg font-serif font-semibold flex-shrink-0" style={{ color: '#0B1957' }}>
                      ₺{item.productPrice}
                    </span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

