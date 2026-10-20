import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, ExternalLink, Quote } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface Review {
  id: string;
  name: string;
  location: string;
  stars: number;
  text: string;
  date: string;
  initials: string;
  badge?: string;
}

const saoPauloReviews: Review[] = [
  {
    id: 'sp1',
    name: 'Mariana S.',
    location: 'Vila Mariana • Google Review',
    stars: 5,
    text: 'A decoração é de encher os olhos, cada cantinho tem um detalhe. O confit de pato com risoto de brie foi o melhor que já comi.',
    date: 'Avaliação recente',
    initials: 'MS',
    badge: 'Local Guide',
  },
  {
    id: 'sp2',
    name: 'Rafael T.',
    location: 'Vila Mariana • Google Review',
    stars: 5,
    text: 'Fomos no brunch de domingo e a torre é linda e muito bem servida. Atendimento atencioso do começo ao fim.',
    date: 'Avaliação recente',
    initials: 'RT',
    badge: 'Cliente Frequente',
  },
  {
    id: 'sp3',
    name: 'Luci Santos',
    location: 'Google Review • Verificada',
    stars: 5,
    text: 'O Belle de Ville Bistrô foi uma experiência que superou as expectativas. Daquelas em que, quanto mais você experimenta, mais vontade tem de continuar provando o cardápio. Os pratos são deliciosos, as sobremesas muito bem executadas e as bebidas completam a experiência. O chocolate quente, os cafés e até os pães servidos à mesa são especiais e mostram o cuidado nos detalhes.',
    date: 'Avaliação recente',
    initials: 'LS',
    badge: 'Avaliação em destaque',
  },
  {
    id: 'sp4',
    name: 'Camila & Bruno',
    location: 'Jantar Romântico • Google Review',
    stars: 5,
    text: 'Ambiente encantador e muito romântico. Cada prato é uma verdadeira obra de arte assinada pela escola francesa. Voltaremos muitas vezes!',
    date: 'Avaliação recente',
    initials: 'CB',
    badge: 'Comemoração Especial',
  },
];

const camposReviews: Review[] = [
  {
    id: 'c1',
    name: 'Vitor Brito',
    location: 'Campos do Jordão • Google Review',
    stars: 5,
    text: 'Nossa experiência no Bistrot de Ville foi simplesmente encantadora. O restaurante e o hotel traduzem com muita fidelidade a atmosfera de um verdadeiro bistrô francês, tanto na gastronomia quanto nos detalhes do ambiente.\n\nOs toques franceses estão por toda parte… na decoração elegante, no cuidado com a apresentação dos pratos e, principalmente, nos sabores tudo muito bem executado, equilibrado e sofisticado.\n\nUm charme à parte são os bichinhos que fazem parte do cenário e tornam a experiência ainda mais especial… coelhos, esquilos e pássaros circulam pelo jardim, criando um clima acolhedor e quase mágico, que combina perfeitamente com Campos do Jordão. É daqueles lugares que fazem a gente desacelerar e aproveitar cada momento.\n\nAtendimento atencioso, ambiente aconchegante e uma experiência que vai muito além da refeição. Sem dúvida, um restaurante para guardar na memória e ser parada obrigatória em Campos 🇫🇷🐇🐿️✨',
    date: 'Avaliação recente',
    initials: 'VB',
    badge: 'Avaliação em destaque',
  },
  {
    id: 'c2',
    name: 'Taina Oliveira',
    location: 'Campos do Jordão • Google Review',
    stars: 5,
    text: 'Bistrot Deville oferece uma experiência sofisticada, com cozinha de inspiração francesa, pratos bem executados e apresentação elegante. O ambiente é intimista e acolhedor, com atendimento atencioso. Ótima opção para ocasiões especiais, com preço condizente com a proposta.',
    date: 'Avaliação recente',
    initials: 'TO',
    badge: 'Google Review',
  },
  {
    id: 'c3',
    name: 'Ruth Reis',
    location: 'Campos do Jordão • Google Review',
    stars: 5,
    text: 'Tivemos uma experiência excelente no Bistrô de Ville, em Campos do Jordão! O ambiente é muito agradável, aconchegante e perfeito para uma refeição especial. Os pratos são muito bem servidos, com ótima qualidade. O atendimento fez toda a diferença: todos os funcionários foram extremamente receptivos, educados e atenciosos.',
    date: 'Avaliação recente',
    initials: 'RR',
    badge: 'Google Review',
  },
  {
    id: 'c4',
    name: 'Douillard Nino',
    location: 'Campos do Jordão • Google Review',
    stars: 5,
    text: 'Um lugar muito agradável com comida excelente. Gostei especialmente do artista que estava se apresentando; agradeço a ele e à calorosa recepção.',
    date: 'Avaliação recente',
    initials: 'DN',
    badge: 'Google Review',
  },
];

export const GoogleReviews: React.FC<{ unit?: string }> = ({ unit: propUnit }) => {
  const { unit: urlUnit } = useParams<{ unit: string }>();
  const activeUnit = propUnit || urlUnit;
  const isCampos = activeUnit === 'campos' || activeUnit === 'campos_jordao';

  const reviews = isCampos ? camposReviews : saoPauloReviews;
  const featuredReview = isCampos ? camposReviews[0] : saoPauloReviews[2];
  const gridReviews = isCampos
    ? [camposReviews[1], camposReviews[2], camposReviews[3]]
    : [saoPauloReviews[0], saoPauloReviews[1], saoPauloReviews[3]];

  const googleSearchUrl = isCampos
    ? 'https://www.google.com/search?q=Bistrot+de+Ville+Campos+do+Jordao+avaliacoes'
    : 'https://www.google.com/search?q=Bistrot+de+Ville+Vila+Mariana+avaliacoes';

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [isCampos]);

  const prevReview = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="avaliacoes" className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-[#E8F8EA]/40 via-[#FBFFF8] to-[#E8DDFD]/30">
      {/* Decorative background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-rose-light/25 via-french-green/30 to-gold/15 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-5 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif italic text-2xl md:text-3xl text-wine mb-2"
          >
            Ils ont aimé
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            viewport={{ once: true }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl text-cafe leading-tight mb-5"
          >
            O que dizem nossos clientes
          </motion.h2>

          {/* Google badge rating summary */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-[#2B5635]/15 shadow-sm"
          >
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="font-sans font-semibold text-xs text-cafe">Google</span>
            </div>

            <div className="w-px h-4 bg-cafe/20" />

            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <span className="font-sans text-[10px] tracking-wider uppercase text-cafe/70 font-medium">Pontuação Máxima</span>
          </motion.div>
        </div>

        {/* Desktop View: Grid of cards */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 items-stretch">
          {gridReviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col justify-between p-7 rounded-[26px] bg-white/85 backdrop-blur-md border border-[#745AA7]/15 shadow-[0_10px_30px_rgba(43,86,53,0.05)] hover:shadow-[0_16px_40px_rgba(116,90,167,0.12)] transition-all duration-300 relative group"
            >
              {/* Card quote icon */}
              <div className="absolute top-6 right-6 text-wine/15 group-hover:text-wine/30 transition-colors">
                <Quote className="w-8 h-8 rotate-180" />
              </div>

              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(r.stars)].map((_, starIdx) => (
                    <Star key={starIdx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="font-body text-cafe/85 text-[14.5px] leading-relaxed mb-6 italic whitespace-pre-line">
                  "{r.text}"
                </p>
              </div>

              {/* Author info */}
              <div className="pt-4 border-t border-[#745AA7]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-wine/20 to-rose-light flex items-center justify-center font-serif text-sm font-semibold text-wine">
                    {r.initials}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-cafe text-base leading-snug">{r.name}</h4>
                    <p className="font-sans text-[11px] text-cafe/65 flex items-center gap-1">
                      {r.location}
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Extra highlight card on desktop for featured review */}
        <div className="hidden lg:block mt-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 md:p-8 rounded-[24px] bg-gradient-to-r from-white/90 via-[#F5EDFD]/80 to-white/90 border border-wine/20 shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-wine text-champagne font-serif text-lg font-bold flex items-center justify-center shrink-0 shadow-md">
                {featuredReview.initials}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-serif font-bold text-cafe text-lg">{featuredReview.name}</span>
                  <span className="text-[10px] font-sans uppercase tracking-widest px-2 py-0.5 rounded-full bg-wine/10 text-wine font-semibold">Avaliação em Destaque</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 mb-2">
                  {[...Array(featuredReview.stars)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-sans text-cafe/60 ml-2">Avaliado no Google</span>
                </div>
                <p className="font-body text-cafe/80 text-sm italic leading-relaxed max-w-3xl whitespace-pre-line">
                  "{featuredReview.text}"
                </p>
              </div>
            </div>

            <a
              href={googleSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-sans font-medium tracking-wider uppercase bg-wine text-champagne hover:bg-wine/90 transition-all shadow-md"
            >
              <span>Ver no Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </div>

        {/* Mobile View: Smooth carousel slider with touch and buttons */}
        <div className="lg:hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-7 rounded-[26px] bg-white/95 backdrop-blur-md border border-[#745AA7]/15 shadow-[0_10px_30px_rgba(43,86,53,0.06)] relative"
            >
              <div className="absolute top-6 right-6 text-wine/20">
                <Quote className="w-8 h-8 rotate-180" />
              </div>

              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(reviews[currentIndex].stars)].map((_, starIdx) => (
                  <Star key={starIdx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="font-body text-cafe/85 text-[14.5px] leading-relaxed mb-6 italic whitespace-pre-line">
                "{reviews[currentIndex].text}"
              </p>

              <div className="pt-4 border-t border-[#745AA7]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-wine/20 to-rose-light flex items-center justify-center font-serif text-sm font-semibold text-wine">
                    {reviews[currentIndex].initials}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-cafe text-base leading-snug">{reviews[currentIndex].name}</h4>
                    <p className="font-sans text-[11px] text-cafe/65 flex items-center gap-1">
                      {reviews[currentIndex].location}
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile controls */}
          <div className="flex items-center justify-between mt-6 px-2">
            <div className="flex items-center gap-1.5">
              {reviews.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentIndex(dotIdx)}
                  aria-label={`Avaliação ${dotIdx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === dotIdx ? 'w-6 bg-wine' : 'w-2 bg-wine/20'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevReview}
                aria-label="Avaliação anterior"
                className="w-9 h-9 rounded-full bg-white border border-wine/20 text-wine flex items-center justify-center shadow-xs hover:bg-wine hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextReview}
                aria-label="Próxima avaliação"
                className="w-9 h-9 rounded-full bg-white border border-wine/20 text-wine flex items-center justify-center shadow-xs hover:bg-wine hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
