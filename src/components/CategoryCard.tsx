import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  title: string
  description: string
  itemCount: number
  slug: string
  icon: string
}

export default function CategoryCard({ 
  title, 
  description, 
  itemCount, 
  slug,
  icon
}: CategoryCardProps) {
  return (
    <Link to={`/kategori/${slug}`}>
      <motion.div 
        className="group relative h-72 rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ 
          background: 'linear-gradient(145deg, #F8F3EA 0%, #E6D8C7 50%, #F8F3EA 100%)',
          boxShadow: '0 4px 8px rgba(11, 25, 87, 0.1)',
          position: 'relative'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(11, 25, 87, 0.15)';
          e.currentTarget.style.background = 'linear-gradient(145deg, #E6D8C7 0%, #F8F3EA 50%, #E6D8C7 100%)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(11, 25, 87, 0.1)';
          e.currentTarget.style.background = 'linear-gradient(145deg, #F8F3EA 0%, #E6D8C7 50%, #F8F3EA 100%)';
        }}
      >
        {/* Altın tonları subtle overlay */}
        <div className="absolute inset-0 opacity-25 pointer-events-none" style={{
          background: 'radial-gradient(circle at top left, rgba(230, 216, 199, 0.6) 0%, rgba(230, 216, 199, 0.2) 40%, transparent 70%)'
        }}></div>
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
          background: 'linear-gradient(45deg, rgba(230, 216, 199, 0.3) 0%, transparent 50%)'
        }}></div>
        <div className="relative h-full flex flex-col justify-between p-8 z-10">
          <div>
            {/* Icon */}
            <div className="w-16 h-16 mb-4 relative">
              <img
                src={`/products/icons/${icon}.png`}
                alt={title}
                className="w-full h-full object-contain"
                style={{ filter: 'brightness(0) saturate(100%) invert(8%) sepia(75%) saturate(3000%) hue-rotate(220deg) brightness(0.4) contrast(1.5)' }}
              />
            </div>
            
            {/* Title */}
            <h3 className="text-3xl font-serif font-bold mb-2 leading-tight" style={{ color: '#0B1957', fontWeight: 900, textShadow: '0 1px 2px rgba(11, 25, 87, 0.1)' }}>
              {title}
            </h3>
            
            {/* Description */}
            <p className="text-sm font-sans font-normal leading-relaxed" style={{ color: '#000000' }}>
              {description}
            </p>
          </div>

          {/* Item Count & Arrow */}
          <div className="flex items-center justify-between mt-4">
            <span className="font-semibold font-sans text-sm" style={{ color: '#0B1957' }}>
              {itemCount} Ürün
            </span>
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all gradient-button"
              style={{ background: 'linear-gradient(to right, #0B1957, #9ECCFA)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to left, #0B1957, #9ECCFA)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, #0B1957, #9ECCFA)';
              }}
            >
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: '#F8F3EA' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

