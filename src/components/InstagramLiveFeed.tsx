import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Instagram, ExternalLink, Sparkles } from 'lucide-react';

export const InstagramLiveFeed: React.FC<{ id?: string }> = ({ id = 'instagram' }) => {
  useEffect(() => {
    // Ensure Elfsight script is loaded and initialized
    const scriptId = 'elfsight-platform-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://elfsightcdn.com/platform.js';
      script.async = true;
      document.body.appendChild(script);
    }

    // Trigger Elfsight widget initialization if platform is already loaded
    if ((window as any).elfsight && typeof (window as any).elfsight.init === 'function') {
      (window as any).elfsight.init();
    }
  }, []);

  return (
    <section id={id} className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-[#E8DDFD]/20 via-[#FBFFF8] to-[#E8F8EA]/30">
      
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-r from-[#E8DDFD]/40 via-[#E8F8EA]/50 to-[#9877E6]/20 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Section title */}
        <div className="text-center mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 border border-purple-500/20 text-xs font-sans text-wine font-medium mb-3"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-600" />
            <span>Instagram Oficial</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] tracking-widest uppercase text-emerald-700 font-bold">Ao Vivo</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            viewport={{ once: true }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl text-cafe leading-tight mb-3"
          >
            Siga nosso universo no Instagram
          </motion.h2>

          <p className="font-body text-cafe/70 text-sm md:text-base max-w-lg mx-auto">
            Acompanhe em tempo real os bastidores, novidades, pratos do dia e momentos inesquecíveis da casa.
          </p>
        </div>

        {/* Official Elfsight Live Widget */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="rounded-[32px] md:rounded-[36px] bg-white/90 backdrop-blur-md shadow-[0_20px_60px_rgba(43,86,53,0.08)] border border-[#745AA7]/15 p-4 sm:p-6 md:p-8 overflow-hidden min-h-[400px]"
        >
          {/* Elfsight Container with user widget ID */}
          <div 
            className="elfsight-app-6e4287e0-54d3-42c6-ac7b-81b5ee1c47a2" 
            data-elfsight-app-lazy
          />
        </motion.div>

        {/* Bottom CTA to Instagram */}
        <div className="mt-8 text-center">
          <a
            href="https://www.instagram.com/bistrot.deville/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-sans text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-[0.98] border-2 border-white"
            style={{ backgroundColor: '#D7F5DC', color: '#583985' }}
          >
            <Instagram className="w-4 h-4 shrink-0" style={{ color: '#583985' }} />
            <span style={{ color: '#583985' }}>Seguir @bistrot.deville no Instagram</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1 shrink-0" style={{ color: '#583985' }} />
          </a>
        </div>

      </div>
    </section>
  );
};
