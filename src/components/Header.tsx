import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header 
      className="py-12 px-6 text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-5xl md:text-6xl font-bold mb-2 tracking-tight gradient-text">
          Rum Meyhanesi
        </h1>
        
        <p className="font-sans text-xs md:text-sm tracking-[0.15em] uppercase mb-6 font-light" style={{ color: '#9ECCFA' }}>
          ELEGANT MEYHANE DENEYİMİ
        </p>
        
        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-2">
          <div className="h-px w-10" style={{ backgroundColor: '#E6D8C7' }}></div>
          <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: '#E6D8C7' }}></div>
          <div className="h-px w-10" style={{ backgroundColor: '#E6D8C7' }}></div>
        </div>
      </div>
    </motion.header>
  );
}

