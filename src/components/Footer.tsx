import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer 
      className="py-12 px-6 text-center mt-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-2xl mx-auto">
        {/* QR Code placeholder */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white rounded-xl shadow-soft p-6 inline-block">
            <div className="w-32 h-32 bg-cream rounded-lg flex items-center justify-center">
              <span className="text-xs text-navy/60 font-sans">QR Kod</span>
            </div>
          </div>
        </div>
        
        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-20 bg-beige"></div>
          <div className="w-2 h-2 rotate-45 bg-beige"></div>
          <div className="h-px w-20 bg-beige"></div>
        </div>
        
        <p className="font-sans text-sm text-navy/70 tracking-wide">
          © 2025 Rum Meyhanesi — Yeni Nesil Meyhane Deneyimi
        </p>
        
        <p className="font-sans text-xs text-navy/50 mt-3">
          Akdeniz'in ruhunu sofranıza taşıyoruz
        </p>
      </div>
    </motion.footer>
  );
}

