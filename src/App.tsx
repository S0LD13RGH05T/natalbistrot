import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import {
  X, Phone, Instagram, MapPin, Clock,
  ChevronRight, ChevronLeft, ShoppingBag, Plus, Minus, Send, MessageCircle,
  ArrowRight, Star, ChevronDown, Award, Sparkles, ChefHat, ExternalLink, Calendar
} from 'lucide-react';
import { MenuItem, menuData, mergeMenuWithSavedChanges } from './data/menu';
import { getMenuItems, getSiteSettings, SiteSettings } from './lib/api';
import { Link, useParams } from 'react-router-dom';
import { GoogleReviews } from './components/GoogleReviews';
import { InstagramLiveFeed } from './components/InstagramLiveFeed';

export const CANVA_MENU_URL_SP = 'https://wildcat-pybfww.my.canva.site/card-pio-s-o-paulo-2026';
export const CANVA_MENU_URL_CAMPOS = 'https://canva.link/b2wflsyg4qpq9fo';

export const getCanvaMenuUrl = (unit?: string) => {
  return unit === 'campos' || unit === 'campos_jordao'
    ? CANVA_MENU_URL_CAMPOS
    : CANVA_MENU_URL_SP;
};

// Default fallback
export const CANVA_MENU_URL = CANVA_MENU_URL_SP;

// ─── Types ────────────────────────────────────────────────────────────────────
interface CartItem extends MenuItem { quantity: number; selectedOption?: string; }

const formatPrice = (price: MenuItem['price']) => {
  if (typeof price !== 'number') return 'Variado';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = ({ showMenu }: { showMenu?: boolean }) => {
  const { unit: urlUnit } = useParams<{ unit: string }>();
  const activeUnit = urlUnit || 'campos';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { id: 'histoire',   label: 'Nossa História' },
    { id: 'avaliacoes', label: 'Avaliações' },
    { id: 'instagram',  label: 'Instagram' },
    { id: 'menu',       label: 'Cardápio' },
    { id: 'vinhos',     label: 'Vinhos' },
    { id: 'galeria',    label: 'Galeria' },
    { id: 'reservas',   label: 'Reservas' },
  ];

  const scrollTo = (id: string) => {
    const targetElement = (id === 'menu' && !showMenu) 
      ? (document.getElementById('cardapio-sucessos') || document.getElementById('menu'))
      : document.getElementById(id);

    if (targetElement) {
      setTimeout(() => targetElement.scrollIntoView({ behavior: 'smooth' }), 100);
      return;
    }

    if (id === 'menu' && !showMenu) {
      window.open(getCanvaMenuUrl(activeUnit), '_blank', 'noopener,noreferrer');
      return;
    }
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  return (
    <>
      <motion.nav
        animate={{
          top:             scrolled ? 14 : 0,
          left:            scrolled ? '50%' : '0%',
          translateX:      scrolled ? '-50%' : '0%',
          width:           scrolled ? '88%' : '100%',
          maxWidth:        scrolled ? '1100px' : '9999px',
          borderRadius:    scrolled ? 999 : 0,
          paddingTop:      scrolled ? 12 : 24,
          paddingBottom:   scrolled ? 12 : 24,
          backgroundColor: scrolled ? 'rgba(232,221,253,0.78)' : 'rgba(232,221,253,0.58)',
          boxShadow:       scrolled
            ? '0 18px 52px rgba(116,90,167,0.20), inset 0 1px 0 rgba(251,255,248,0.54)'
            : '0 12px 36px rgba(116,90,167,0.12), inset 0 1px 0 rgba(251,255,248,0.42)',
          borderWidth:     1,
          borderColor:     scrolled ? 'rgba(251,255,248,0.58)' : 'rgba(251,255,248,0.34)',
        }}
        transition={{
          duration: 0.55,
          ease: [0.32, 0.72, 0, 1],
          backgroundColor: { duration: 0.45 },
          borderRadius:    { duration: 0.55 },
          width:           { duration: 0.55 },
          top:             { duration: 0.55 },
          boxShadow:       { duration: 0.45 },
        }}
        style={{
          position: 'fixed',
          zIndex: 50,
          backdropFilter: scrolled ? 'blur(26px) saturate(1.45)' : 'blur(18px) saturate(1.32)',
          WebkitBackdropFilter: scrolled ? 'blur(26px) saturate(1.45)' : 'blur(18px) saturate(1.32)',
          backgroundImage: 'linear-gradient(135deg, rgba(232,221,253,0.66), rgba(251,255,248,0.22) 48%, rgba(221,244,225,0.34))',
          borderStyle: 'solid',
          left: scrolled ? '50%' : '0',
          transform: scrolled ? 'translateX(-50%)' : 'translateX(0)',
        }}
        role="navigation"
        aria-label="Navegação principal"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link to="/" className="flex min-w-0 flex-col leading-none" title="Escolha entre a unidade São Paulo ou Unidade Campos do Jordão">
            <span className={`font-serif text-[1.05rem] sm:text-xl tracking-[0.1em] sm:tracking-[0.12em] transition-colors duration-500 ${scrolled ? 'text-wine' : 'text-cafe'}`}>
              BISTROT DE VILLE
            </span>
            <span className={`font-sans text-[6px] sm:text-[7.5px] tracking-[0.12em] sm:tracking-[0.18em] uppercase mt-0.5 truncate max-w-[220px] sm:max-w-none transition-colors duration-500 ${scrolled ? 'text-wine/65' : 'text-wine/70'}`}>
              Escolha entre a unidade São Paulo ou Unidade Campos do Jordão
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-10">
            {links.map(l => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className={`font-sans text-[10px] tracking-[0.22em] uppercase transition-colors duration-300 ${
                  scrolled
                    ? 'text-wine/75 hover:text-wine'
                    : 'text-cafe/75 hover:text-wine'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="flex shrink-0 items-center">
            <Link
              to={`/${activeUnit}/reservar`}
              className={`inline-flex items-center justify-center font-sans text-[0.58rem] sm:text-[0.68rem] tracking-[0.15em] sm:tracking-[0.18em] uppercase rounded-full transition-all duration-300 ${
                scrolled
                  ? 'bg-rose-light text-cafe hover:bg-rose-light/85'
                  : 'bg-rose-light/95 text-cafe shadow-[0_16px_42px_rgba(116,90,167,0.18)] hover:bg-rose-light'
              }`}
              style={{ padding: '0.58rem 1.05rem' }}
            >
              Reservar Mesa
            </Link>
          </div>
        </div>
      </motion.nav>

    </>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = ({ onOpenMenu, showMenu, currentEvent = 'natal' }: { onOpenMenu: () => void; showMenu?: boolean; currentEvent?: 'natal' | 'reveillon' }) => {
  const { unit: urlUnit } = useParams<{ unit: string }>();
  const activeUnit = urlUnit || 'campos';
  const dbUnit = activeUnit === 'campos' || activeUnit === 'campos_jordao' ? 'campos_jordao' : 'sao_paulo';
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="home" ref={ref} className="relative h-screen min-h-[700px] flex items-end overflow-hidden">
      {/* Parallax background */}
      <motion.div className="absolute inset-0 z-0 md:p-5" style={{ y }}>
        <picture className="block w-full h-full md:rounded-[22px] md:overflow-hidden hero-desktop-frame">
          <source 
            media="(min-width: 768px)" 
            srcSet={dbUnit === 'campos_jordao' ? '/hero_campos_mobile.jpeg?v=20261020b' : '/hero_mobile_bistrot.jpeg?v=20261020b'} 
          />
          <img
            src={dbUnit === 'campos_jordao' ? '/hero_campos_mobile.jpeg?v=20261020b' : '/hero_mobile_bistrot.jpeg?v=20261020b'}
            alt={dbUnit === 'campos_jordao' ? "Restaurante Mais Bem Avaliado de Campos do Jordão" : "Restaurante Mais Bem Avaliado de São Paulo"}
            className="hero-mobile-image w-full h-full object-cover"
            loading="eager"
          />
        </picture>
        <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-black/65 via-black/20 to-black/75" />
        <div className="hero-desktop-soft-shadow absolute inset-5 rounded-[22px] hidden md:block" />
      </motion.div>

      {/* Hero Title (parte superior) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15 }}
        className="absolute top-20 sm:top-24 md:top-32 left-0 right-0 z-20 px-4 md:px-8 text-center pointer-events-none flex flex-col items-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-champagne mb-3 sm:mb-4 shadow-lg">
          <MapPin size={12} className="text-gold" />
          <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.35em] uppercase font-semibold">
            {dbUnit === 'campos_jordao' ? 'Campos do Jordão · Chateau' : 'São Paulo · Vila Mariana'}
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-champagne max-w-4xl tracking-tight leading-[1.15] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] font-normal">
          {dbUnit === 'campos_jordao'
            ? 'Natal de charme em meio às montanhas de Campos do Jordão'
            : 'Restaurante Mais Bem Avaliado de São Paulo'}
        </h1>
        {/* 5 Estrelas embaixo */}
        <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={22}
              className="text-[#FBBF24] fill-[#FBBF24] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
            />
          ))}
        </div>

        {/* Botões Natal / Réveillon */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-5 sm:mt-6 pointer-events-auto z-30">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-sans text-[11px] sm:text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300 shadow-2xl cursor-pointer ${
              currentEvent === 'natal'
                ? 'bg-[#745AA7] text-white border-2 border-white/80 shadow-[0_8px_30px_rgba(116,90,167,0.6)] scale-105'
                : 'bg-black/55 text-champagne/80 border border-white/25 hover:bg-black/75 hover:text-white hover:border-white/50 backdrop-blur-md'
            }`}
          >
            <Sparkles size={14} className={currentEvent === 'natal' ? 'text-[#FBBF24]' : 'text-gold/80'} />
            <span>Natal</span>
          </Link>
          <Link
            to="/reveillon"
            className={`inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-sans text-[11px] sm:text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-300 shadow-2xl cursor-pointer ${
              currentEvent === 'reveillon'
                ? 'bg-[#745AA7] text-white border-2 border-white/80 shadow-[0_8px_30px_rgba(116,90,167,0.6)] scale-105'
                : 'bg-black/55 text-champagne/80 border border-white/25 hover:bg-black/75 hover:text-white hover:border-white/50 backdrop-blur-md'
            }`}
          >
            <Sparkles size={14} className={currentEvent === 'reveillon' ? 'text-[#FBBF24]' : 'text-gold/80'} />
            <span>Réveillon</span>
          </Link>
        </div>
      </motion.div>

      {/* Hero CTA buttons */}
      <div className="absolute bottom-16 left-0 right-0 z-20 flex flex-wrap items-center justify-center gap-3 px-6 pointer-events-auto">
        <Link
          to={`/${activeUnit}/reservar`}
          className="btn-rose-light text-xs py-3 px-6 shadow-xl"
        >
          Reservar Agora
        </Link>
        <a
          href={getCanvaMenuUrl(activeUnit)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline-champagne text-xs py-3 px-6 shadow-xl bg-black/40 backdrop-blur-md inline-flex items-center gap-2 group hover:bg-black/60 transition-all text-champagne"
        >
          <span>Ver Cardápio (PDF)</span>
          <ExternalLink size={13} className="text-gold/80 group-hover:text-gold transition-colors" />
        </a>
        {showMenu && (
          <button
            onClick={onOpenMenu}
            className="btn-outline-champagne text-xs py-3 px-6 shadow-xl bg-black/40 backdrop-blur-md inline-flex items-center gap-2 group hover:bg-black/60 transition-all text-champagne"
          >
            <span>Cardápio Digital</span>
          </button>
        )}
      </div>

      {/* Scroll cue */}
      <motion.button
        type="button"
        onClick={() => document.getElementById('histoire')?.scrollIntoView({ behavior: 'smooth' })}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-champagne/60 hover:text-champagne transition-colors cursor-pointer"
        aria-label="Rolar para baixo"
      >
        <span className="font-sans text-[8px] tracking-[0.5em] uppercase">Découvrir</span>
        <ChevronDown size={16} />
      </motion.button>
    </section>
  );
};

// ─── Stats Strip ──────────────────────────────────────────────────────────────
const StatsStrip = () => (
  <section className="bg-wine py-8 md:py-12 border-y border-wine/10">
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 items-stretch text-center">
        {[
          {
            content: (
              <>
                <Award className="w-5 h-5 text-wine mb-2 stroke-[1.5] opacity-90" />
                <div className="font-serif text-base sm:text-lg md:text-xl text-wine font-medium leading-snug">
                  Restaurante Premiado
                </div>
              </>
            ),
          },
          {
            content: (
              <>
                <Sparkles className="w-5 h-5 text-wine mb-2 stroke-[1.5] opacity-90" />
                <div className="font-serif text-xs sm:text-sm md:text-base text-wine font-medium leading-snug">
                  Considerado a melhor experiência gastronômica da Cidade
                </div>
              </>
            ),
          },
          {
            content: (
              <>
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 sm:w-5 h-4 sm:h-5 text-wine fill-wine stroke-[1.5]" />
                  ))}
                </div>
                <div className="font-sans text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.16em] uppercase text-cafe/75 font-semibold">
                  Pontuação máxima do Google
                </div>
              </>
            ),
          },
          {
            content: (
              <>
                <ChefHat className="w-5 h-5 text-wine mb-2 stroke-[1.5] opacity-90" />
                <div className="font-serif text-xs sm:text-sm md:text-base text-wine font-medium leading-snug">
                  Menu desenvolvido por chefs Le Cordon Bleu
                </div>
              </>
            ),
          },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center text-center p-3"
          >
            {s.content}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Notre Histoire ────────────────────────────────────────────────────────────
const Histoire = () => {
  const { unit: urlUnit } = useParams<{ unit: string }>();
  const activeUnit = urlUnit || 'campos';
  const dbUnit = activeUnit === 'campos' || activeUnit === 'campos_jordao' ? 'campos_jordao' : 'sao_paulo';

  return (
    <section id="histoire" className="section-warm-bg py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Images side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main image */}
            <div className="parallax-img aspect-[4/5] overflow-hidden rounded-2xl card-shadow">
              <img
                src={dbUnit === 'campos_jordao' ? '/story_campos_natal.jpg?v=20261020a' : '/story-couple-bistrot.jpeg'}
                alt={dbUnit === 'campos_jordao' ? 'A Magia do Natal no Bistrot de Ville em Campos do Jordão' : 'Bistrot de Ville'}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center center' }}
                loading="lazy"
              />
            </div>
            {/* Floating accent card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              className="absolute -bottom-8 -right-4 md:-right-10 w-40 md:w-56 bg-wine rounded-2xl p-5 card-shadow"
            >
              <div className="font-serif text-4xl md:text-5xl text-wine leading-none mb-1">
                {dbUnit === 'campos_jordao' ? '1' : '8'}
              </div>
              <div className="font-sans text-[9px] tracking-[0.3em] uppercase text-cafe/60">
                {dbUnit === 'campos_jordao' ? 'Unidade Chateau\nNas Montanhas' : 'Anos de\nCulinária Francesa'}
              </div>
            </motion.div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
            className="lg:pl-8 space-y-8"
          >
            <div>
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-rose-light mb-4" style={{ color: '#745AA7' }}>
                Nossa História
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-cafe leading-tight">
                {dbUnit === 'campos_jordao' ? (
                  <>
                    A magia do<br />
                    <em className="italic font-light">Natal em Campos do Jordão</em>
                  </>
                ) : (
                  <>
                    Un Coin de<br />
                    <em className="italic font-light">Paris em São Paulo</em>
                  </>
                )}
              </h2>
            </div>

            <div className="w-10 h-px bg-gold" />

            {dbUnit === 'campos_jordao' ? (
              <>
                <p className="font-body text-cafe/70 text-base leading-loose">
                  O Natal chegou ao Bistrot De Ville. Em um charmoso château reformado com a identidade clássica da casa, trazemos a magia e a energia festiva do Natal para o clima aconchegante de Campos do Jordão. Criado por Carol Barbosa e Roma, o espaço une a técnica impecável da escola Le Cordon Bleu em uma ceia de Natal especial.
                </p>
                <p className="font-body text-cafe/60 text-sm leading-loose">
                  Mais do que um restaurante, o Bistrot De Ville em Campos do Jordão é uma experiência sensorial única nesta época do ano: lareira acesa, vinhos selecionados e uma ceia de Natal exclusiva, magistralmente preparada por nossos chefs formados pelo Cordon Bleu, celebrando o melhor da gastronomia sob o céu estrelado da Mantiqueira.
                </p>
              </>
            ) : (
              <>
                <p className="font-body text-cafe/70 text-base leading-loose">
                  O Bistrot De Ville nasceu do encontro entre paixão, gastronomia e inspiração francesa.
                  Criado por Carol Barbosa e Roma, o restaurante carrega a essência de um sonho construído a dois. Carol trouxe sua sensibilidade, seu cuidado com os alimentos e sua paixão pela cozinha. Roma trouxe a vivência em Paris e o olhar apurado para a cultura francesa.
                  Após estudos, pesquisas e a experiência na Le Cordon Bleu, o casal desenvolveu uma proposta autoral, unindo técnica, afeto e personalidade. Cada detalhe da arquitetura aos pratos foi pensado por eles, com inspiração nos bistrôs da Belle Époque em Paris.
                </p>
                <p className="font-body text-cafe/60 text-sm leading-loose">
                  O que começou como loja online em 2020 cresceu, virou café, ganhou forma de Bistrot e hoje também vive nas montanhas de Campos do Jordão, em um charmoso Chateau reformado com a identidade da casa.
                  Mais do que um restaurante, o Bistrot De Ville é uma experiência: gastronomia de inspiração francesa, ambiente acolhedor e detalhes que contam a história de Carol e Roma em cada canto.
                </p>
              </>
            )}

            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { icon: Star, label: 'Gastronomia Premiada' },
                { icon: MessageCircle, label: 'Ambiente Acolhedor' },
                { icon: Clock, label: dbUnit === 'campos_jordao' ? 'Qui a Dom 12h–17h e 19h–22h' : 'Terça a Dom até 22h' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-cafe/60">
                  <Icon size={14} className="text-gold shrink-0" />
                  <span className="font-sans text-xs tracking-wide">{label}</span>
                </div>
              ))}
            </div>

            <Link to={`/${activeUnit}/reservar`} className="btn-outline-wine inline-flex">
              Reservar uma Mesa <ChevronRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Ambientes (Campos do Jordão) ─────────────────────────────────────────────
const AmbientesSection = ({ id = 'ambientes' }: { id?: string } = {}) => {
  const { unit: urlUnit } = useParams<{ unit: string }>();
  const activeUnit = urlUnit || 'campos';

  return (
    <section id={id} className="section-warm-bg py-28 md:py-40 border-t border-gold/15">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Images side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main image */}
            <div className="parallax-img aspect-[3/4] overflow-hidden rounded-2xl card-shadow bg-cafe/5 border border-gold/20">
              <img
                src="/natal_dois_ambientes.jpg?v=20261020a"
                alt="Um Natal, Dois Ambientes - Bistrot de Ville Campos do Jordão"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
            {/* Floating accent card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -right-4 md:-right-8 w-44 md:w-56 bg-white/75 backdrop-blur-md rounded-2xl p-4 md:p-5 shadow-xl border border-white/60"
            >
              <div className="font-serif text-4xl md:text-5xl text-wine leading-none mb-1 font-semibold">
                2
              </div>
              <div className="font-sans text-[9px] tracking-[0.25em] uppercase text-cafe/75 font-medium whitespace-pre-line leading-relaxed">
                {'Ambientes Encantadores\nInterno & Externo'}
              </div>
            </motion.div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
            className="lg:pl-8 space-y-8"
          >
            <div>
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-rose-light mb-4" style={{ color: '#745AA7' }}>
                Espaços &amp; Atmosfera
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-cafe leading-tight">
                Um Natal Mágico<br />
                <em className="italic font-light">nas Montanhas de Campos do Jordão</em>
              </h2>
            </div>

            <div className="w-10 h-px bg-gold" />

            <div className="space-y-4">
              <p className="font-body text-cafe/80 text-base leading-relaxed">
                O Bistrot de Ville (unidade Campos) veste-se de pura magia para celebrar a época mais encantadora do ano. Em meio à grandiosidade das montanhas, preparamos um evento natalino inesquecível, onde cada detalhe foi pensado para aquecer o coração e criar memórias eternas ao lado de quem você ama.
              </p>
              <p className="font-body text-cafe/80 text-base leading-relaxed font-medium">
                Venha vivenciar a nossa celebração em dois ambientes deslumbrantes e acolhedores:
              </p>
              <div className="space-y-4 pt-1">
                <div className="p-4 rounded-xl bg-cafe/5 border border-gold/15 space-y-1.5">
                  <strong className="text-cafe font-semibold font-serif text-base sm:text-lg block">
                    Ambiente Interno – O Refúgio Clássico de Inverno
                  </strong>
                  <p className="font-body text-cafe/75 text-sm sm:text-base leading-relaxed">
                    Entre no clima de um conto de fadas natalino. O salão é adornado por uma refinada decoração inspirada na Belle Époque francesa, repleta de tesouros garimpados em antiquários da França. O crepitar e o calor acolhedor da lareira completam a atmosfera festiva, oferecendo o cenário perfeito para um jantar de Natal intimista e sofisticado.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-cafe/5 border border-gold/15 space-y-1.5">
                  <strong className="text-cafe font-semibold font-serif text-base sm:text-lg block">
                    Ambiente Externo – Um Conto de Natal sob as Estrelas
                  </strong>
                  <p className="font-body text-cafe/75 text-sm sm:text-base leading-relaxed">
                    Inspirado na beleza dos jardins de Monet e cercado por araucárias centenárias e uma iluminação natalina deslumbrante, nosso jardim se transforma em um verdadeiro cenário mágico ao ar livre. Desfrute de mesas aconchegantes dispostas ao redor de lareiras e aquecedores, enquanto uma tela de cinema ao ar livre exibe clipes musicais temáticos para embalar a noite. Para coroar o clima bucólico e encantador, coelhos, esquilos e aves exóticas circulam livremente pela natureza.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-cafe/5 border border-gold/15 space-y-1.5">
                  <strong className="text-cafe font-semibold font-serif text-base sm:text-lg block">
                    A Noite de Natal Perfeita
                  </strong>
                  <p className="font-body text-cafe/75 text-sm sm:text-base leading-relaxed">
                    Para tornar a sua noite ainda mais mágica, preparamos uma programação especial com música ao vivo, espalhando melodias encantadoras por todas as áreas do bistrot — seja junto à lareira interna ou sob o céu estrelado do jardim.
                  </p>
                </div>
              </div>
              <p className="font-body text-cafe/85 text-sm sm:text-base leading-relaxed pt-2 border-t border-gold/20 font-serif italic text-base">
                Escolha o seu ambiente favorito, reserve a sua mesa e venha viver a magia do Natal com sofisticação, sabor e muito afeto no Bistrot de Ville!
              </p>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { icon: Sparkles, label: 'Belle Époque Francesa' },
                { icon: Star, label: 'Jardins de Monet & Cinema' },
                { icon: Clock, label: 'Música ao Vivo nos Fins de Semana' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-cafe/60">
                  <Icon size={14} className="text-gold shrink-0" />
                  <span className="font-sans text-xs tracking-wide">{label}</span>
                </div>
              ))}
            </div>

            <Link to={`/${activeUnit}/reservar`} className="btn-outline-wine inline-flex">
              Reservar Agora <ChevronRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Menu Natalino em 6 Tempos (Campos do Jordão) ─────────────────────────────
const Menu6TemposSection = ({ id = 'menu-6-tempos' }: { id?: string } = {}) => {
  const { unit: urlUnit } = useParams<{ unit: string }>();
  const activeUnit = urlUnit || 'campos';

  return (
    <section id={id} className="py-24 md:py-36 border-t border-gold/15 relative overflow-hidden bg-french-green/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main image */}
            <div className="overflow-hidden rounded-2xl card-shadow bg-cafe/5 border border-gold/20">
              <img
                src="/menu_natal_6_tempos.jpg?v=20261020a"
                alt="Menu natalino em 6 Tempos - Bistrot de Ville Campos do Jordão"
                className="w-full h-auto object-cover object-center"
                loading="lazy"
              />
            </div>
            {/* Floating accent card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -right-4 md:-right-8 w-44 md:w-56 bg-white/75 backdrop-blur-md rounded-2xl p-4 md:p-5 shadow-xl border border-white/60"
            >
              <div className="font-serif text-4xl md:text-5xl text-wine leading-none mb-1 font-semibold">
                6
              </div>
              <div className="font-sans text-[9px] tracking-[0.25em] uppercase text-cafe/75 font-medium whitespace-pre-line leading-relaxed">
                {'Tempos Exclusivos\nMenu Natalino'}
              </div>
            </motion.div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
            className="lg:pl-8 space-y-6"
          >
            <div>
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: '#745AA7' }}>
                Natal no Bistrot de Ville
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-cafe leading-tight">
                Campos do Jordão<br />
                <em className="italic font-light">Uma experiência gastronômica em 6 tempos</em>
              </h2>
            </div>

            <div className="w-10 h-px bg-gold" />

            <div className="space-y-4">
              <p className="font-body text-cafe text-base sm:text-lg leading-relaxed font-medium">
                Uma noite mágica, uma gastronomia inesquecível e o encanto do Natal nas montanhas de Campos do Jordão.
              </p>
              <p className="font-body text-cafe/80 text-sm sm:text-base leading-relaxed">
                Para celebrar uma das noites mais especiais do ano, o Bistrot de Ville Campos do Jordão preparou uma experiência gastronômica exclusiva, que reúne sofisticação, tradição e os sabores que conquistaram nossos clientes ao longo de todo o ano.
              </p>
              <p className="font-body text-cafe/80 text-sm sm:text-base leading-relaxed">
                Nosso grande destaque é o Menu Especial de Natal em 6 Tempos, cuidadosamente desenvolvido pelos chefs proprietários do Bistrot de Ville, formados pela renomada escola francesa de gastronomia Le Cordon Bleu.
              </p>
              <p className="font-body text-cafe/80 text-sm sm:text-base leading-relaxed">
                A proposta nasceu de uma inspiração muito especial: reunir em uma única noite os pratos que fizeram maior sucesso em nossas unidades, aqueles que receberam os maiores elogios dos nossos clientes e se tornaram verdadeiros protagonistas da nossa gastronomia.
              </p>
              <p className="font-body text-cafe/80 text-sm sm:text-base leading-relaxed">
                Cada receita foi cuidadosamente revisitada, valorizando os sabores originais que conquistaram tantos paladares, mas recebendo toques especiais, adaptações natalinas e apresentações sofisticadas, pensadas exclusivamente para a celebração da noite de Natal.
              </p>

              <div className="p-4 sm:p-5 rounded-xl bg-cafe/5 border border-gold/20 space-y-2">
                <p className="font-body text-cafe/85 text-sm sm:text-base leading-relaxed">
                  São 6 tempos de uma verdadeira viagem gastronômica, em que a elegância da cozinha francesa encontra os sabores da Mantiqueira e a tradição das grandes celebrações natalinas.
                </p>
                <p className="font-body text-cafe/85 text-sm sm:text-base leading-relaxed">
                  Mais do que oferecer uma ceia, queremos proporcionar uma experiência memorável, em que cada etapa do menu seja uma descoberta, cada prato conte uma história e cada sabor desperte boas lembranças.
                </p>
              </div>

              <p className="font-body text-cafe/80 text-sm sm:text-base leading-relaxed">
                E para tornar essa noite ainda mais encantadora, o Bistrot de Ville recebe seus convidados em um cenário único nas montanhas de Campos do Jordão, com ambientes acolhedores, decoração especial, jardins cercados por araucárias centenárias e o charme das lareiras que tornam nosso restaurante tão especial.
              </p>
              <p className="font-body text-cafe/80 text-sm sm:text-base leading-relaxed">
                Neste Natal, os pratos mais amados do Bistrot de Ville estarão reunidos em uma única experiência, especialmente criada para celebrar a magia dessa data.
              </p>

              <div className="pt-3 pb-1 border-t border-gold/20">
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gold/15 border border-gold/30 text-cafe font-serif text-base sm:text-lg italic font-medium">
                  <Sparkles size={16} className="text-gold shrink-0" />
                  <span>✨ Natal Bistrot de Ville — Menu Exclusivo em 6 Tempos.</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { icon: ChefHat, label: 'Chefs Formados Le Cordon Bleu' },
                { icon: Sparkles, label: 'Menu Exclusivo em 6 Tempos' },
                { icon: Award, label: 'Alta Gastronomia na Mantiqueira' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-cafe/60">
                  <Icon size={14} className="text-gold shrink-0" />
                  <span className="font-sans text-xs tracking-wide">{label}</span>
                </div>
              ))}
            </div>

            <Link to={`/${activeUnit}/reservar`} className="btn-outline-wine inline-flex">
              Reservar Menu de Natal <ChevronRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Menu Préview ──────────────────────────────────────────────────────────────
const MenuPreview = ({
  onOpenFullMenu, menuItems, onAddToCart
}: { onOpenFullMenu: () => void; menuItems: MenuItem[]; onAddToCart: (item: MenuItem) => void }) => {
  const featured = useMemo(() => {
    const promoted = menuItems.filter(i => i.isPromoted);
    return (promoted.length ? promoted : menuItems).slice(0, 8);
  }, [menuItems]);
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAdd = (item: MenuItem) => {
    onAddToCart(item);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1400);
  };

  return (
    <section id="menu" className="dark-section-bg py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-4">Notre Sélection</p>
          <h2 className="font-serif text-5xl md:text-7xl text-cafe mb-6">Le Cardápio</h2>
          <div className="ornament max-w-xs mx-auto">
            <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-gold/60">Haute Cuisine Française</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {featured.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                viewport={{ once: true }}
                className="menu-list-card group cursor-pointer"
                onClick={() => handleAdd(item)}
              >
                <div className="flex items-center gap-4">
                  {item.image && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-champagne/40">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" crossOrigin="anonymous" />
                    </div>
                  )}
                  <div className="flex-1">
                    <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-gold/60 mb-2 block">{item.category}</span>
                    <h3 className="font-serif text-2xl text-cafe mb-2 group-hover:text-wine transition-colors duration-300">{item.name}</h3>
                    {item.description && (
                      <p className="font-body text-cafe/60 text-sm leading-relaxed line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-3">
                    <span className="font-serif text-xl text-gold">{formatPrice(item.price)}</span>
                    <AnimatePresence>
                      {addedId === item.id ? (
                        <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
                          className="font-sans text-[8px] tracking-widest uppercase text-rose-light" style={{ color: '#745AA7' }}>
                          ✓ Adicionado
                        </motion.span>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 rounded-full border border-wine/20 flex items-center justify-center text-wine/50 hover:border-wine/50 hover:text-wine transition-all"
                        >
                          <Plus size={14} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        {/* Footer CTA */}
        <div className="text-center mt-16">
          <button onClick={onOpenFullMenu} className="btn-rose-light">
            Cardápio Completo <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};


// ─── Cardápio & Sucessos ──────────────────────────────────────────────────────
const CardapioSucessosSection = ({ id = 'cardapio-sucessos' }: { id?: string } = {}) => {
  const { unit: urlUnit } = useParams<{ unit: string }>();
  const activeUnit = urlUnit || 'campos';

  return (
    <section id={id} className="section-warm-bg py-28 md:py-40 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            className="space-y-8 order-2 lg:order-1"
          >
            <div>
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-rose-light mb-4" style={{ color: '#745AA7' }}>
                Notre Carte &amp; Spécialités
              </p>
              <h2 className="font-serif text-5xl md:text-6xl text-cafe leading-tight">
                Nosso Cardápio
              </h2>
            </div>

            <div className="w-10 h-px bg-gold" />

            <div className="space-y-4 pt-1">
              {[
                'Chefs da Le Cordon Bleu',
                'Pratos elaborados pelos nossos chefs',
                'Gastronomia Francesa com um toque autoral',
                activeUnit === 'campos' || activeUnit === 'campos_jordao'
                  ? 'Melhor experiência gastronômica de Campos do Jordão'
                  : 'Melhor experiência gastronômica de São Paulo',
              ].map((phrase, i) => (
                <div key={i} className="flex items-center gap-3.5 border-l-2 border-gold/40 pl-4 py-1.5">
                  <Sparkles size={16} className="text-gold shrink-0" />
                  <span className="font-serif text-lg sm:text-xl text-cafe leading-snug font-medium">
                    {phrase}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <a
                href={getCanvaMenuUrl(activeUnit)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-rose-light inline-flex items-center gap-2"
              >
                <span>Acessar Cardápio Oficial</span>
                <ExternalLink size={14} />
              </a>
              <Link to={`/${activeUnit}/reservar`} className="inline-flex items-center gap-1.5 font-sans text-xs tracking-wider uppercase text-wine hover:text-cafe transition-colors font-semibold py-3 px-2">
                <span>Reservar Agora</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </motion.div>

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4 order-1 lg:order-2"
          >
            <div className="parallax-img aspect-[3/4] overflow-hidden rounded-2xl card-shadow col-span-1 mt-8 group relative">
              <img
                src="/cardapio_ravioli_camarao.jpg?v=20261020"
                alt="Ravioli Artesanal com Camarões e Vinho Branco"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                style={{ objectPosition: 'center center' }}
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <span className="text-[11px] font-serif text-white tracking-wide block">Ravioli Artesanal &amp; Camarões</span>
              </div>
            </div>
            <div className="parallax-img aspect-[3/4] overflow-hidden rounded-2xl card-shadow col-span-1 group relative">
              <img
                src="/cardapio_risoto.jpg"
                alt="Confit de Pato com Risoto de Brie e Damasco"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                style={{ objectPosition: 'center center' }}
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <span className="text-[11px] font-serif text-white tracking-wide block">Confit de Pato &amp; Risoto de Brie</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Vinhos & Sobremesas ──────────────────────────────────────────────────────
const VinhosSection = ({ id = 'vinhos' }: { id?: string } = {}) => {
  const { unit: urlUnit } = useParams<{ unit: string }>();
  const activeUnit = urlUnit || 'campos';

  return (
    <section id={id} className="section-warm-bg py-28 md:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            className="space-y-8 order-2 lg:order-1"
          >
            <div>
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-rose-light mb-4" style={{ color: '#745AA7' }}>
                La Cave
              </p>
              <h2 className="font-serif text-5xl md:text-6xl text-cafe leading-tight">
                Vinhos &amp;<br /><em className="italic font-light">Sobremesas</em>
              </h2>
            </div>

            <div className="w-10 h-px bg-gold" />

            <p className="font-body text-cafe/65 leading-loose">
              Nossa adega reúne mais de 120 rótulos cuidadosamente selecionados nas regiões de Bordeaux, Borgonha e Loire. Cada garrafa conta uma história. Deixe o nosso sommelier guiá-lo à harmonização perfeita.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {[
                { n: '120+', l: 'Rótulos' },
                { n: '12', l: 'Sobremesas' },
                { n: '6', l: 'Regiões Francesas' },
                { n: 'Melhor Carta de Vinhos', l: 'Melhor da região' },
              ].map((s, i) => (
                <div key={i} className="border-l-2 border-gold/30 pl-4">
                  <div className="font-serif text-2xl sm:text-3xl text-wine mb-0.5 leading-tight">{s.n}</div>
                  <div className="font-sans text-[9px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-cafe/50 leading-relaxed">{s.l}</div>
                </div>
              ))}
            </div>

            <Link to={`/${activeUnit}/reservar`} className="btn-rose-light">
              Reservar Agora <ChevronRight size={14} />
            </Link>
          </motion.div>

        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-4 order-1 lg:order-2"
        >
          <div className="parallax-img aspect-[3/4] overflow-hidden rounded-2xl card-shadow col-span-1 mt-8">
            <img
              src="/wine-glasses-bistrot.jpeg"
              alt="Taças de vinho"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center center' }}
              loading="lazy"
            />
          </div>
          <div className="parallax-img aspect-[3/4] overflow-hidden rounded-2xl card-shadow col-span-1">
            <img
              src="/dessert-chocolate-bistrot.jpeg"
              alt="Sobremesa com chocolate"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center center' }}
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
  );
};

// ─── Galeria ───────────────────────────────────────────────────────────────────
const Galeria = () => {
  const { unit: urlUnit } = useParams<{ unit: string }>();
  const activeUnit = urlUnit || 'campos';
  const dbUnit = activeUnit === 'campos' || activeUnit === 'campos_jordao' ? 'campos_jordao' : 'sao_paulo';
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const spImages = [
    { src: '/galeria-1.jpg', alt: 'Fachada Bistrot de Ville', category: 'Entrada & Flores' },
    { src: '/galeria-2.jpg', alt: 'Bougainvilleas em Flor', category: 'Fachada Externa' },
    { src: '/galeria-3.jpg', alt: 'Ravioli Verde com Camarões & Chablis', category: 'Alta Gastronomia' },
    { src: '/galeria-4.jpg', alt: 'Ambiente Clássico & Acolhedor', category: 'L\'Atmosphère' },
    { src: '/galeria-5.jpg', alt: 'Bar Bistrot & Detalhes Retrô', category: 'Charme Parisiense' },
    { src: '/galeria-6.jpg', alt: 'Cantinho Parisiense', category: 'Experiência Bistrô' },
    { src: '/galeria-7.jpg', alt: 'Espaço Intimista à Luz Quente', category: 'L\'Atmosphère' },
    { src: '/galeria-8.jpg', alt: 'Jardim de Flores & Mesas Externas', category: 'Área Externa' },
    { src: '/galeria-9.jpg', alt: 'Mousse de Chocolate & Café', category: 'Sobremesa & Café' },
  ];

  const camposImages = [
    { src: '/galeria-campos-5.jpg', alt: 'Fachada do Chateau & Jardins Floridos', category: 'Chateau & Flores' },
    { src: '/galeria-campos-1.jpg', alt: 'Jardim com Lareira ao Entardecer', category: 'L\'Atmosphère' },
    { src: '/galeria-campos-13.jpg', alt: 'Jardim Encantado com Coelhinhos Soltos', category: 'Natureza & Jardim' },
    { src: '/galeria-campos-2.jpg', alt: 'Música ao Vivo ao Redor da Lareira', category: 'Noites Especiais' },
    { src: '/galeria-campos-6.jpg', alt: 'Ambiente Interno Belle Époque', category: 'Charme & História' },
    { src: '/galeria-campos-10.jpg', alt: 'Momento Intimista à Luz da Janela', category: 'Ambiente Acolhedor' },
    { src: '/galeria-campos-11.jpg', alt: 'Experiência Gastronômica no Bistrot', category: 'Alta Gastronomia' },
    { src: '/galeria-campos-3.png', alt: 'Confit de Pato com Risoto de Brie', category: 'Pratos Autorais' },
    { src: '/galeria-campos-4.png', alt: 'Salmão Grelhado com Aspargos e Flores', category: 'Pratos Autorais' },
    { src: '/galeria-campos-7.jpg', alt: 'Chefs & Experiência Gastronômica', category: 'Cozinha Autoral' },
    { src: '/galeria-campos-8.jpg', alt: 'Cinema ao Ar Livre no Jardim', category: 'Experiência Única' },
    { src: '/galeria-campos-12.jpg', alt: 'Lareira sob as Estrelas com Telão de Cinema', category: 'Noites na Serra' },
    { src: '/galeria-campos-9.jpg', alt: 'Noite Iluminada sob as Araucárias', category: 'L\'Atmosphère' },
  ];

  const images = dbUnit === 'campos_jordao' ? camposImages : spImages;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((activeImageIndex + 1) % images.length);
    }
  };

  return (
    <section id="galeria" className="dark-section-bg py-28 md:py-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-4">L'Atmosphère</p>
          <h2 className="font-serif text-5xl md:text-6xl text-cafe">Galeria</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.6 }}
              viewport={{ once: true }}
              onClick={() => setActiveImageIndex(i)}
              className="gallery-item group relative rounded-2xl md:rounded-[28px] overflow-hidden aspect-[3/4] shadow-[0_10px_30px_rgba(43,86,53,0.08)] border border-wine/10 cursor-pointer"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#140F22]/85 via-[#140F22]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 md:p-6 text-left pointer-events-none">
                <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-gold font-semibold mb-1">
                  {img.category}
                </span>
                <span className="font-serif text-base md:text-xl text-champagne leading-snug">
                  {img.alt}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImageIndex(null)}
            className="fixed inset-0 z-50 bg-[#140F22]/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
          >
            <button
              onClick={() => setActiveImageIndex(null)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-10 cursor-pointer"
              aria-label="Fechar galeria"
            >
              <X size={20} />
            </button>

            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all z-10 cursor-pointer"
              aria-label="Foto anterior"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all z-10 cursor-pointer"
              aria-label="Próxima foto"
            >
              <ChevronRight size={24} />
            </button>

            <motion.div
              key={activeImageIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
            >
              <img
                src={images[activeImageIndex].src}
                alt={images[activeImageIndex].alt}
                className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/15"
              />
              <div className="text-center mt-4">
                <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold">
                  {images[activeImageIndex].category} · {activeImageIndex + 1} de {images.length}
                </p>
                <h3 className="font-serif text-xl md:text-2xl text-champagne mt-1">
                  {images[activeImageIndex].alt}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// ─── Reservas CTA ──────────────────────────────────────────────────────────────
const ReservasCTA = () => {
  const { unit: urlUnit } = useParams<{ unit: string }>();
  const activeUnit = urlUnit || 'campos';
  const dbUnit = activeUnit === 'campos' || activeUnit === 'campos_jordao' ? 'campos_jordao' : 'sao_paulo';

  return (
    <section id="reservas" className="relative py-40 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(min-width: 768px)" srcSet={dbUnit === 'campos_jordao' ? '/gallery-bistrot-1.jpeg' : '/hero_desktop_bistrot.jpeg'} />
          <img
            src="/hero_restaurant.png"
            alt="Jantar romântico no Bistrot"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </picture>
        <div className="absolute inset-0 bg-cafe/80 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <p className="font-sans text-[10px] tracking-[0.45em] uppercase text-gold">Présentation</p>
          <h2 className="font-serif text-5xl md:text-7xl text-champagne leading-tight">
            Reserve seu<br /><em className="italic font-light" style={{ color: '#E8DDFD' }}>Momento Especial</em>
          </h2>
          <p className="font-body text-champagne/60 text-lg leading-relaxed max-w-xl mx-auto">
            Para jantares especiais, pedidos de casamento ou qualquer celebração que mereça o cenário perfeito. Nossa equipe está pronta para tornar cada detalhe inesquecível.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to={`/${activeUnit}/reservar`} className="btn-rose-light text-xs py-4 px-8 shadow-xl inline-flex items-center justify-center gap-2">
              <span>Reservar Agora</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Contact info */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-champagne/40">
            <div className="flex items-center gap-2">
              <Clock size={13} className="text-gold shrink-0" />
              <span className="font-sans text-xs">
                {dbUnit === 'campos_jordao'
                  ? 'Quinta a Domingo: 12h–17h e 19h–22h'
                  : 'Terça a Sex 12h–22h · Sáb e Dom 10h–22h'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-gold" />
              <span className="font-sans text-xs">
                {dbUnit === 'campos_jordao'
                  ? 'Buscar no Google Maps ou Waze por Bistro de Ville Campos'
                  : 'R. Rio Grande, 218 · Vila Mariana'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={13} className="text-gold" />
              <span className="font-sans text-xs">(11) 98348-3472</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ─── Footer ────────────────────────────────────────────────────────────────────
const Footer = () => {
  const { unit: urlUnit } = useParams<{ unit: string }>();
  const activeUnit = urlUnit || 'campos';
  const dbUnit = activeUnit === 'campos' || activeUnit === 'campos_jordao' ? 'campos_jordao' : 'sao_paulo';

  return (
    <footer className="bg-cafe py-20 border-t border-wine/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <span className="font-serif text-2xl text-cafe tracking-[0.1em]">BISTROT DE VILLE</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-px w-8 bg-gold/50" />
                <span className="font-sans text-[8px] tracking-[0.35em] uppercase text-gold/60">Restaurante Français</span>
              </div>
            </div>
            <p className="font-body text-cafe/60 text-sm leading-relaxed max-w-xs">
              {dbUnit === 'campos_jordao'
                ? 'Gastronomia francesa premiada, ambiente acolhedor e romântico em meio às montanhas de Campos do Jordão.'
                : 'Gastronomia francesa premiada, ambiente íntimo e romântico na Vila Mariana, São Paulo.'
              }
            </p>
            <div className="flex gap-5 mt-6">
              <a href="#" aria-label="Instagram" className="text-wine/45 hover:text-wine transition-colors">
                <Instagram size={18} />
              </a>
              <a
                href={dbUnit === 'campos_jordao'
                  ? "https://wa.me/5511913633533?text=Gostaria%20de%20reservar%20uma%20mesa%20para%20a%20unidade%20de%20Campos%20do%20Jord%C3%A3o"
                  : "https://wa.me/5511983483472?text=Gostaria%20de%20reservar%20uma%20mesa%20para%20a%20unidade%20de%20S%C3%A3o%20Paulo."
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-wine/45 hover:text-wine transition-colors"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-sans text-[9px] tracking-[0.35em] uppercase text-gold mb-6">
              {dbUnit === 'campos_jordao' ? 'Endereço' : 'Localização'}
            </h4>
            <div className="flex gap-3 text-cafe/60 text-sm font-body">
              <MapPin size={14} className="text-gold shrink-0 mt-1" />
              {dbUnit === 'campos_jordao' ? (
                <div className="leading-relaxed space-y-1">
                  <p className="font-medium text-cafe">Campos do Jordão – SP</p>
                  <p className="text-xs text-cafe/75 leading-relaxed">
                    Ideal chegar pelo Google Maps ou Waze buscando por <strong>Bistro de Ville Campos</strong>
                  </p>
                </div>
              ) : (
                <p className="leading-relaxed">R. Rio Grande, 218<br />Vila Mariana<br />São Paulo – SP</p>
              )}
            </div>
          </div>

          {/* Horários */}
          <div>
            <h4 className="font-sans text-[9px] tracking-[0.35em] uppercase text-gold mb-6">Horários</h4>
            <div className="flex gap-3 text-cafe/60 text-sm font-body">
              <Clock size={14} className="text-gold shrink-0 mt-1" />
              <div className="leading-relaxed space-y-1">
                {dbUnit === 'campos_jordao' ? (
                  <>
                    <p className="font-medium text-cafe">Quinta-feira a Domingo</p>
                    <p className="text-xs sm:text-sm text-cafe/80">12h às 17h e das 19h às 22h</p>
                  </>
                ) : (
                  <>
                    <p>Terça a sexta-feira: 12:00 às 22:00</p>
                    <p>Sábado e domingo: 10:00 às 22:00</p>
                  </>
                )}
                <a
                  href={dbUnit === 'campos_jordao'
                    ? "https://wa.me/5511913633533?text=Gostaria%20de%20reservar%20uma%20mesa%20para%20a%20unidade%20de%20Campos%20do%20Jord%C3%A3o"
                    : "https://wa.me/5511983483472?text=Gostaria%20de%20reservar%20uma%20mesa%20para%20a%20unidade%20de%20S%C3%A3o%20Paulo."
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cafe/45 hover:text-wine transition-colors text-xs block pt-1"
                >
                  Reservas via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-wine/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-sans tracking-[0.36em] uppercase text-cafe/45">
          <p>© {new Date().getFullYear()} Bistrot de Ville. Todos os direitos reservados.</p>
          <a
            href="https://www.instagram.com/zyphorlabs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:text-wine transition-colors"
          >
            <span>Desenvolvido por Mateus Lima ·</span>
            <img src="/zyphor-logo.png" alt="Zyphor Labs" className="h-4 w-4 object-contain opacity-70" loading="lazy" />
            <span>Zyphor Labs</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

// ─── Full Menu Modal ───────────────────────────────────────────────────────────
const FullMenuModal = ({
  isOpen, onClose, onAddToCart, onOpenCart, cartCount, menuItems
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, option?: string, shouldOpenCart?: boolean) => void;
  onOpenCart: () => void;
  cartCount: number;
  menuItems: MenuItem[];
}) => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [addedId, setAddedId] = useState<string | null>(null);
  const categories = ['Todos', ...Array.from(new Set(menuItems.map(i => i.category)))];
  const filtered = activeCategory === 'Todos' ? menuItems : menuItems.filter(i => i.category === activeCategory);

  const handleAdd = (item: MenuItem) => {
    onAddToCart(item, undefined, false);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, clipPath: 'circle(8% at 50% 88%)' }}
          animate={{ opacity: 1, clipPath: 'circle(140% at 50% 50%)' }}
          exit={{ opacity: 0, clipPath: 'circle(8% at 50% 88%)' }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          className="full-menu-shell fixed inset-0 z-[100] flex flex-col"
          style={{ background: 'radial-gradient(circle at 16% 12%, rgba(205,188,244,0.62), transparent 32%), radial-gradient(circle at 92% 42%, rgba(221,244,225,0.72), transparent 34%), linear-gradient(135deg, #F1EAFE 0%, #E8F8EA 100%)' }}
        >
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-0 h-1 w-full origin-left bg-[#8f6ee8]"
          />
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ delay: 0.12, duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
            className="p-6 md:px-8 border-b border-wine/10 flex justify-between items-center sticky top-0 z-10 bg-rose-light/72 backdrop-blur-xl"
          >
            <div>
              <h2 className="font-serif text-3xl text-cafe">Le Cardápio Complet</h2>
              <p className="font-sans text-[8px] tracking-[0.4em] uppercase text-wine/60 mt-1">Bistrot de Ville</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full border border-wine/15 text-wine/70 hover:text-wine hover:border-wine/30 hover:bg-white/35 transition-all">
              <X size={18} />
            </button>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ delay: 0.22, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="px-6 md:px-8 py-4 overflow-x-auto no-scrollbar border-b border-wine/10 bg-champagne/50 backdrop-blur-md"
          >
            <div className="flex gap-2 min-w-max">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 font-sans text-[9px] tracking-[0.2em] uppercase rounded-full transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-french-green text-cafe' : 'text-cafe/55 hover:text-wine'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            <motion.div
              key={activeCategory}
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035, delayChildren: 0.1 } } }}
              className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5"
            >
              {filtered.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 22, scale: 0.985, filter: 'blur(6px)' },
                    show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
                  }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -5 }}
                  className="menu-list-card full-menu-item flex items-center gap-4 sm:gap-5 group cursor-pointer"
                  onClick={() => handleAdd(item)}
                >
                  {item.image && (
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-champagne/50 ring-1 ring-white/45">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" crossOrigin="anonymous" />
                      <span className="absolute left-2 top-2 rounded-full bg-rose-light/80 px-2 py-1 text-[8px] font-bold tracking-widest text-cafe/70">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-gold/60 mb-1 block">{item.category}</span>
                    <h3 className="font-serif text-xl text-cafe group-hover:text-wine transition-colors">{item.name}</h3>
                    {item.description && <p className="font-body text-cafe/60 text-sm mt-1 line-clamp-2">{item.description}</p>}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-3 text-right">
                    <span className="font-serif text-xl text-gold block">{formatPrice(item.price)}</span>
                    <AnimatePresence mode="wait">
                      {addedId === item.id ? (
                        <motion.span
                          key="added"
                          initial={{ opacity: 0, scale: 0.85, y: 4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: -4 }}
                          className="rounded-full bg-french-green px-3 py-2 font-sans text-[8px] tracking-widest uppercase text-cafe"
                        >
                          Adicionado
                        </motion.span>
                      ) : (
                        <motion.button
                          key="add"
                          whileTap={{ scale: 0.88 }}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleAdd(item);
                          }}
                          className="full-menu-add-button"
                          aria-label={`Adicionar ${item.name} à sacolinha`}
                        >
                          <Plus size={16} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 10 }}
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.94 }}
            onClick={onOpenCart}
            className="fixed bottom-6 right-6 z-[105] flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-[#E8DDFD]/95 text-cafe shadow-2xl backdrop-blur-xl transition-all"
            aria-label={`Abrir sacolinha com ${cartCount} item${cartCount === 1 ? '' : 's'}`}
          >
            <ShoppingBag size={22} strokeWidth={1.8} />
            <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full border border-white/70 bg-[#745AA7] px-1.5 font-sans text-[10px] font-bold leading-none text-champagne shadow-lg">
              {cartCount}
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Cart Drawer ───────────────────────────────────────────────────────────────
const CartDrawer = ({
  isOpen, onClose, cart, updateQuantity, onCheckout
}: { isOpen: boolean; onClose: () => void; cart: CartItem[]; updateQuantity: (id: string, opt: string | undefined, d: number) => void; onCheckout: () => void }) => {
  const total = cart.reduce((acc, item) => {
    const p = typeof item.price === 'number' ? item.price : (item.price as any)[item.selectedOption!];
    return acc + p * item.quantity;
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 z-[110] bg-cafe/70 backdrop-blur-sm" />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-[120] flex flex-col border-l border-champagne/10"
            style={{ backgroundColor: '#2B5635' }}
          >
            <div className="p-8 border-b border-champagne/10 flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl text-champagne">Mon Commande</h2>
                <p className="font-sans text-[8px] tracking-[0.3em] uppercase text-gold/50 mt-1">Seu Pedido</p>
              </div>
              <button onClick={onClose} className="text-champagne/40 hover:text-champagne transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-champagne/20">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="font-sans text-[9px] tracking-[0.4em] uppercase">Carrinho vazio</p>
                </div>
              ) : cart.map(item => (
                <div key={`${item.id}-${item.selectedOption}`} className="flex items-center gap-5 group">
                  <div className="flex-1">
                    <h4 className="font-serif text-lg text-champagne group-hover:text-gold transition-colors">{item.name}</h4>
                    {item.selectedOption && <span className="font-sans text-[8px] tracking-widest uppercase text-gold/60">{item.selectedOption}</span>}
                    <p className="font-serif text-gold mt-1">
                      R$ {(typeof item.price === 'number' ? item.price : (item.price as any)[item.selectedOption!]).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 border border-champagne/12 rounded-full px-4 py-2">
                    <button onClick={() => updateQuantity(item.id, item.selectedOption, -1)} className="text-champagne/40 hover:text-champagne transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="font-sans text-sm text-champagne min-w-[20px] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.selectedOption, 1)} className="text-champagne/40 hover:text-champagne transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t border-champagne/10 space-y-5">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-champagne/40">Total</span>
                  <span className="font-serif text-3xl text-gold">R$ {total.toFixed(2)}</span>
                </div>
                <button onClick={onCheckout} className="btn-rose-light w-full justify-center">
                  Finalizar Pedido <Send size={14} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ─── Order Form ────────────────────────────────────────────────────────────────
const OrderFormModal = ({
  isOpen, onClose, onSubmit
}: { isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }) => {
  const [form, setForm] = useState({ name: '', phone: '', address: '', payment: 'Pix', observation: '' });
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-cafe/85 backdrop-blur-xl" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg rounded-2xl p-10 max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: '#FBFFF8' }}
      >
        <div className="text-center mb-10">
          <h2 className="font-serif text-4xl text-wine mb-1">Finalizar Pedido</h2>
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-cafe/40">Informações para Retirada</p>
        </div>

        <form className="space-y-8" onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
          {[
            { label: 'Nome Completo', key: 'name', type: 'text', ph: 'Ex: Marie Dupont' },
            { label: 'WhatsApp', key: 'phone', type: 'tel', ph: '(11) 99999-9999' },
          ].map(f => (
            <div key={f.key} className="space-y-2">
              <label className="font-sans text-[9px] tracking-[0.3em] uppercase text-wine/60">{f.label}</label>
              <input
                required type={f.type}
                className="input-elegant"
                placeholder={f.ph}
                value={(form as any)[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              />
            </div>
          ))}

          <div className="space-y-2">
            <label className="font-sans text-[9px] tracking-[0.3em] uppercase text-wine/60">Observações</label>
            <textarea
              required className="input-elegant resize-none h-24 pt-2"
              placeholder="Horário desejado, preferências..."
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="font-sans text-[9px] tracking-[0.3em] uppercase text-wine/60">Pagamento</label>
            <select
              className="input-elegant"
              value={form.payment}
              onChange={e => setForm({ ...form, payment: e.target.value })}
            >
              {['Pix', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-outline-wine flex-1 justify-center">Voltar</button>
            <button type="submit" className="btn-rose-light flex-[2] justify-center">Enviar Pedido</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const { unit: urlUnit } = useParams<{ unit: string }>();
  const activeUnit = urlUnit || 'campos';
  const dbUnit = activeUnit === 'campos' || activeUnit === 'campos_jordao' ? 'campos_jordao' : 'sao_paulo';

  const [isMenuOpen, setIsMenuOpen]     = useState(false);
  const [isCartOpen, setIsCartOpen]     = useState(false);
  const [isOrderOpen, setIsOrderOpen]   = useState(false);
  const [cart, setCart]                 = useState<CartItem[]>([]);
  const [menuItems, setMenuItems]       = useState<MenuItem[]>(menuData);
  const [settings, setSettings]         = useState<SiteSettings>({
    showHistoire: true,
    showVinhos: true,
    showGaleria: true,
    showReservas: true,
    showAvaliacoes: true,
    showInstagram: true,
    showMenu: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = dbUnit === 'campos_jordao' ? 'Bistrot de Ville | Natal em Campos do Jordão' : 'Bistrot de Ville | Vila Mariana';
    getMenuItems(dbUnit)
      .then(saved => {
        const localFiltered = menuData.filter(item => {
          const itemUnit = item.unit || 'sao_paulo';
          return itemUnit === dbUnit;
        });
        setMenuItems(mergeMenuWithSavedChanges(localFiltered, saved as MenuItem[]));
      })
      .catch(() => {
        setMenuItems(menuData.filter(item => {
          const itemUnit = item.unit || 'sao_paulo';
          return itemUnit === dbUnit;
        }));
      });
      
    getSiteSettings(dbUnit)
      .then(data => {
        if (data) setSettings(data);
      })
      .catch(() => {});
  }, [dbUnit]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });


  const addToCart = useCallback((item: MenuItem, option?: string, shouldOpenCart = true) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === item.id && i.selectedOption === option);
      if (ex) return prev.map(i => i.id === item.id && i.selectedOption === option ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1, selectedOption: option }];
    });
    if (shouldOpenCart) setIsCartOpen(true);
  }, []);

  const updateQty = useCallback((id: string, opt: string | undefined, delta: number) => {
    setCart(prev => prev.map(i => i.id === id && i.selectedOption === opt ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));
  }, []);

  const sendToWhatsApp = (formData: any) => {
    const phone = dbUnit === 'campos_jordao' ? '5511913633533' : '5511983483472';
    const code  = Math.random().toString(36).substring(2, 8).toUpperCase();
    const total = cart.reduce((a, i) => {
      const p = typeof i.price === 'number' ? i.price : (i.price as any)[i.selectedOption!];
      return a + p * i.quantity;
    }, 0);
    let msg = `*PEDIDO #${code} - BISTROT DE VILLE (${dbUnit === 'campos_jordao' ? 'CAMPOS DO JORDÃO' : 'SÃO PAULO'})*\n\n`;
    msg += `*Cliente:* ${formData.name}\n*WhatsApp:* ${formData.phone}\n*Obs:* ${formData.address}\n*Pagamento:* ${formData.payment}\n\n*ITENS:*\n`;
    cart.forEach(i => {
      const p = typeof i.price === 'number' ? i.price : (i.price as any)[i.selectedOption!];
      msg += `• ${i.quantity}x ${i.name} — R$ ${(p * i.quantity).toFixed(2)}\n`;
    });
    msg += `\n*TOTAL: R$ ${total.toFixed(2)}*`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    setCart([]);
    setIsOrderOpen(false);
  };

  return (
    <div className="grain overflow-x-hidden">
      {/* Scroll progress bar in wine color */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[200] origin-left"
        style={{ scaleX, backgroundColor: '#9877E6' }}
      />

      <Navbar showMenu={settings.showMenu} />

      <main>
        <Hero onOpenMenu={() => setIsMenuOpen(true)} showMenu={settings.showMenu} currentEvent="natal" />
        <StatsStrip />
        {settings.showHistoire && <Histoire />}
        {dbUnit === 'campos_jordao' && <AmbientesSection />}
        {dbUnit === 'campos_jordao' && <Menu6TemposSection />}
        {settings.showAvaliacoes !== false && <GoogleReviews unit={dbUnit} />}
        {settings.showInstagram !== false && <InstagramLiveFeed id="instagram" />}
        {settings.showMenu ? (
          <MenuPreview onOpenFullMenu={() => setIsMenuOpen(true)} menuItems={menuItems} onAddToCart={addToCart} />
        ) : (
          <CardapioSucessosSection id="cardapio-sucessos" />
        )}
        {settings.showVinhos && <VinhosSection id="vinhos" />}
        {settings.showGaleria && <Galeria />}
        {settings.showReservas && <ReservasCTA />}
      </main>

      <Footer />

      {/* Modals */}
      <FullMenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onAddToCart={addToCart}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cart.reduce((a, i) => a + i.quantity, 0)}
        menuItems={menuItems}
      />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} updateQuantity={updateQty} onCheckout={() => { setIsCartOpen(false); setIsOrderOpen(true); }} />
      <OrderFormModal isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} onSubmit={sendToWhatsApp} />

      <Link
        to={`/${activeUnit}/reservar`}
        className="floating-reservation-cta"
        style={{ bottom: cart.length > 0 ? '5.5rem' : '1.5rem' }}
      >
        <Calendar size={18} />
        Reservar Agora
      </Link>

      {/* Floating cart */}
      {cart.length > 0 && !isCartOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.06 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-6 z-40 flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl font-sans text-[10px] tracking-widest uppercase"
          style={{ backgroundColor: '#E8DDFD', color: '#2B5635' }}
        >
          <div className="relative">
            <ShoppingBag size={18} />
            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
              style={{ backgroundColor: '#745AA7', color: '#FBFFF8' }}>
              {cart.reduce((a, i) => a + i.quantity, 0)}
            </span>
          </div>
          Ver Pedido
        </motion.button>
      )}
    </div>
  );
}
