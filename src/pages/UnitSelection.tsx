import React from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

export default function UnitSelection() {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  return (
    <div
      className="grain min-h-screen text-cafe font-sans overflow-hidden flex flex-col justify-between relative selection:bg-rose-light"
      style={{
        background: `
          radial-gradient(circle at 82% 8%, rgba(220, 203, 250, 0.44), transparent 32rem),
          radial-gradient(circle at 12% 22%, rgba(232, 248, 234, 0.95), transparent 34rem),
          linear-gradient(135deg, #E8F8EA 0%, #F7FCF2 46%, #F0E8FE 100%)
        `,
      }}
    >
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-[#E8F8EA] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#E8DDFD]/60 blur-[120px] rounded-full pointer-events-none" />

      {/* Elegant Header */}
      <header className="relative z-20 text-center pt-12 md:pt-16 pb-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="inline-block"
        >
          <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.45em] uppercase text-wine/80 mb-2 block font-medium">
            Bienvenue au
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-[0.12em] text-cafe leading-none font-medium">
            BISTROT DE VILLE
          </h1>
          <div className="ornament max-w-xl mx-auto mt-3">
            <span className="font-sans text-[8px] sm:text-[10px] tracking-[0.22em] uppercase text-wine/75">
              Escolha entre a unidade São Paulo ou Unidade Campos do Jordão
            </span>
          </div>
        </motion.div>
      </header>

      {/* Main Selection Area */}
      <main className="relative z-10 flex-1 flex flex-col md:flex-row items-stretch justify-center max-w-7xl mx-auto w-full px-6 md:px-12 py-6 gap-6 md:gap-8">
        {/* São Paulo Card - Vila Mariana (Tudo 100% Clicável) */}
        <div
          onClick={() => handleNavigate('/sp')}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleNavigate('/sp');
            }
          }}
          className="flex-1 relative rounded-[32px] overflow-hidden flex flex-col justify-end p-8 sm:p-12 min-h-[420px] md:min-h-0 border border-[#745AA7]/15 shadow-[0_20px_50px_rgba(43,86,53,0.12)] transition-all duration-300 hover:border-[#745AA7]/50 hover:shadow-[0_25px_60px_rgba(116,90,167,0.22)] hover:scale-[1.015] active:scale-[0.99] cursor-pointer group select-none"
        >
          {/* Native Router Link covering entire card */}
          <Link
            to="/sp"
            aria-label="Acessar Unidade São Paulo - Vila Mariana"
            className="absolute inset-0 z-30 w-full h-full cursor-pointer focus:outline-none"
          />

          {/* Background Image with Zoom */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src="/sao_paulo_mais_bem_avaliado.jpeg?v=20261005a"
              alt="Fachada florida do Bistrot de Ville - Vila Mariana"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            {/* Elegant overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#140F22]/90 via-[#140F22]/40 to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-75" />
          </div>

          {/* Card Content (pointer-events-none ensures any click penetrates directly to the link) */}
          <div className="relative z-10 space-y-4 pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md">
              <MapPin size={13} className="text-gold" />
              <span className="font-sans text-[10px] tracking-widest uppercase font-semibold text-champagne">São Paulo</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-champagne tracking-tight group-hover:text-gold transition-colors duration-300">
              Vila Mariana
            </h2>

            <p className="font-body text-champagne/70 text-sm leading-relaxed max-w-md">
              O charme e sofisticação parisienses no coração da capital paulista. Alta gastronomia, luz de velas e noites memoráveis de jazz ao vivo.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-light text-cafe border border-white/20 font-sans text-[10px] sm:text-[11px] tracking-widest uppercase font-semibold group-hover:bg-white group-hover:text-wine transition-all duration-300 shadow-lg">
                Visitar Unidade <ArrowRight size={14} className="transition-transform group-hover:translate-x-1.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Campos do Jordão Card - Um belo chateau em meio às montanhas (Tudo 100% Clicável) */}
        <div
          onClick={() => handleNavigate('/campos')}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleNavigate('/campos');
            }
          }}
          className="flex-1 relative rounded-[32px] overflow-hidden flex flex-col justify-end p-8 sm:p-12 min-h-[420px] md:min-h-0 border border-[#745AA7]/15 shadow-[0_20px_50px_rgba(43,86,53,0.12)] transition-all duration-300 hover:border-[#745AA7]/50 hover:shadow-[0_25px_60px_rgba(116,90,167,0.22)] hover:scale-[1.015] active:scale-[0.99] cursor-pointer group select-none"
        >
          {/* Native Router Link covering entire card */}
          <Link
            to="/campos"
            aria-label="Acessar Unidade Campos do Jordão - Um belo chateau em meio às montanhas"
            className="absolute inset-0 z-30 w-full h-full cursor-pointer focus:outline-none"
          />

          {/* Background Image with Zoom */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src="/hero_campos_chateau.jpeg?v=20261018a"
              alt="Um Chateau Francês em meio às montanhas de Campos do Jordão"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {/* Elegant overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#140F22]/95 via-[#140F22]/45 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />
          </div>

          {/* Card Content (pointer-events-none ensures any click penetrates directly to the link) */}
          <div className="relative z-10 space-y-4 pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md">
              <MapPin size={13} className="text-gold" />
              <span className="font-sans text-[10px] tracking-widest uppercase font-semibold text-champagne">Campos do Jordão</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-champagne tracking-tight group-hover:text-gold transition-colors duration-300 leading-tight">
              Um Chateau Francês em meio às montanhas de Campos do Jordão
            </h2>

            <p className="font-body text-champagne/70 text-sm leading-relaxed max-w-md">
              Uma experiência acolhedora, cercada por araucárias centenárias, hortênsias e animais soltos no jardim. Escolha entre os ambientes interno e externo e tenha uma experiência maravilhosa.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-light text-cafe border border-white/20 font-sans text-[10px] sm:text-[11px] tracking-widest uppercase font-semibold group-hover:bg-white group-hover:text-wine transition-all duration-300 shadow-lg">
                Visitar Unidade <ArrowRight size={14} className="transition-transform group-hover:translate-x-1.5" />
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 text-center py-8 px-4 text-cafe/50 text-[9px] font-sans tracking-[0.3em] uppercase">
        <p>© {new Date().getFullYear()} Bistrot de Ville. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
