import { motion } from 'framer-motion';
import { MenuItem as MenuItemType } from '../lib/googleSheets';
import { useState } from 'react';

interface MenuItemProps {
  item: MenuItemType;
  index: number;
}

export default function MenuItem({ item, index }: MenuItemProps) {
  const [imageError, setImageError] = useState(false);
  
  const itemId = `item-${item.productName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
  
  return (
    <motion.div
      id={itemId}
      className="group bg-white rounded-2xl overflow-hidden border border-beige/30 hover:border-sky/50 transition-all duration-500 hover:shadow-soft-lg hover:scale-[1.02] scroll-mt-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sky/0 to-sky/0 group-hover:from-sky/5 group-hover:to-sky/10 transition-all duration-500 pointer-events-none"></div>
      
      <div className="relative flex gap-4 p-5 md:p-6">
        {item.productImage && (
          <div className="relative flex-shrink-0">
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden border-2 border-beige/30 group-hover:border-sky/50 transition-colors duration-300">
              {!imageError ? (
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-cream flex items-center justify-center">
                  <span className="text-3xl">🍽️</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div className="flex justify-between items-start gap-3 mb-2">
            <h3 className="text-lg md:text-xl font-serif font-semibold text-navy group-hover:text-sky transition-colors flex-1">
              {item.productName}
            </h3>
            
            <span className="text-lg md:text-xl font-bold text-sky whitespace-nowrap flex-shrink-0 font-serif">
              ₺{item.productPrice}
            </span>
          </div>

          <p className="text-sm md:text-base text-navy/60 leading-relaxed italic group-hover:text-navy transition-colors line-clamp-2 font-sans">
            {item.productDescription}
          </p>
          
          {item.subCategory && (
            <span className="inline-block mt-2 px-3 py-1 bg-sky/20 text-sky rounded-full text-xs font-sans font-medium">
              {item.subCategory}
            </span>
          )}
        </div>
      </div>

      <div className="h-1 bg-gradient-to-r from-transparent via-sky to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </motion.div>
  );
}

