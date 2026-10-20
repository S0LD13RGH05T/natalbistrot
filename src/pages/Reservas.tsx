import React, { useState, useEffect } from 'react';
import {
  ChevronRight, Users, Calendar as CalendarIcon, Clock, Phone, Mail,
  User, CheckCircle2, AlertCircle, MessageCircle, MapPin, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useParams } from 'react-router-dom';
import { createReservation, getReservationOccupancy } from '../lib/api';

const totalCapacity = 40; // Capacidade padrão do salão

const Reservas = () => {
  const { unit: urlUnit } = useParams<{ unit: string }>();
  const activeUnit = urlUnit || 'campos';
  const dbUnit = activeUnit === 'campos' || activeUnit === 'campos_jordao' ? 'campos_jordao' : 'sao_paulo';

  // Verifica dias fechados por unidade
  const isDayClosed = (dayOfWeek: number) => {
    if (dbUnit === 'campos_jordao') {
      // Campos do Jordão: Fechado Segunda (1), Terça (2) e Quarta (3)
      // Aberto Quinta (4), Sexta (5), Sábado (6) e Domingo (0)
      return dayOfWeek === 1 || dayOfWeek === 2 || dayOfWeek === 3;
    }
    // São Paulo: Fechado apenas Segunda (1)
    return dayOfWeek === 1;
  };

  const getInitialDay = () => {
    const t = new Date();
    const d = t.getDay();
    if (dbUnit === 'campos_jordao') {
      if (d === 1 || d === 2 || d === 3) {
        const daysToAdd = 4 - d; // avança até quinta-feira
        const nextOpen = new Date(t);
        nextOpen.setDate(t.getDate() + daysToAdd);
        return nextOpen.getDate();
      }
    } else {
      if (d === 1) {
        const nextOpen = new Date(t);
        nextOpen.setDate(t.getDate() + 1);
        return nextOpen.getDate();
      }
    }
    return t.getDate();
  };

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<number>(getInitialDay());
  const [step, setStep] = useState<'details' | 'form' | 'success'>('details');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 2,
    coHolder: '',
    time: dbUnit === 'campos_jordao' ? '12:30' : '19:30',
  });

  const [lastReservationCode, setLastReservationCode] = useState<string>('');
  const [areaPreference, setAreaPreference] = useState<'interna' | 'externa'>('interna');
  const [reservations, setReservations] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const occupancyData = await getReservationOccupancy(dbUnit);
        setReservations(occupancyData);
      } catch (err) {
        console.error("Erro ao carregar ocupação:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [dbUnit]);

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const dayNames = [
    "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
    "Quinta-feira", "Sexta-feira", "Sábado"
  ];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const getOccupancyForDay = (day: number) => {
    const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return reservations[dateStr] || 0;
  };

  const selectedDateObj = new Date(currentYear, currentMonth, selectedDay);
  const selectedDayOfWeek = selectedDateObj.getDay();
  const isSelectedClosed = isDayClosed(selectedDayOfWeek);
  const isWeekend = selectedDayOfWeek === 0 || selectedDayOfWeek === 6;

  const dayOccupancy = getOccupancyForDay(selectedDay);
  const availableSlots = isSelectedClosed ? 0 : Math.max(0, totalCapacity - dayOccupancy);
  const isFull = isSelectedClosed || availableSlots <= 0;

  // Horários disponíveis por unidade
  const timeSlots = dbUnit === 'campos_jordao'
    ? [
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
        "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"
      ]
    : isWeekend
      ? [
          "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
          "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
          "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"
        ]
      : [
          "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
          "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
          "20:00", "20:30", "21:00", "21:30", "22:00"
        ];

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    setStep('details');
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formData.guests > availableSlots && availableSlots > 0) {
        alert(`Esta data tem apenas ${availableSlots} vaga(s) disponível(is).`);
        setIsSubmitting(false);
        return;
      }

      const reservationDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
      const resCode = `#${Math.floor(1000 + Math.random() * 9000)}`;
      setLastReservationCode(resCode);

      // Salva no Supabase para sincronizar painel e disponibilidade
      try {
        await createReservation({
          reservation_date: reservationDate,
          titular1: formData.name,
          titular2: formData.coHolder || undefined,
          people: formData.guests,
          time: formData.time,
          type: dbUnit === 'campos_jordao'
            ? `Reserva Normal (${areaPreference === 'externa' ? 'Área Externa' : 'Área Interna'})`
            : 'Reserva Normal',
          phone: formData.phone,
          email: formData.email,
          status: 'Aguardando',
          code: resCode,
          unit: dbUnit
        });

        setReservations(prev => ({
          ...prev,
          [reservationDate]: (prev[reservationDate] || 0) + formData.guests,
        }));
      } catch (apiErr) {
        console.warn("Aviso: gravação no Supabase falhou, continuando para WhatsApp:", apiErr);
      }

      // Constrói mensagem completa para o WhatsApp
      const unitTitle = dbUnit === 'campos_jordao'
        ? 'Campos do Jordão · Chateau'
        : 'São Paulo · Vila Mariana';

      const dateFormatted = `${selectedDay.toString().padStart(2, '0')}/${(currentMonth + 1).toString().padStart(2, '0')}/${currentYear}`;

      const textLines = [
        '🍽️ *Solicitação de Reserva - Bistrot de Ville*',
        '',
        `• *Código:* ${resCode}`,
        `• *Unidade:* ${unitTitle}`,
        `• *Nome do Titular:* ${formData.name.trim()}`,
        `• *Telefone/WhatsApp:* ${formData.phone.trim()}`,
        `• *E-mail:* ${formData.email.trim()}`,
        `• *Data:* ${dateFormatted} (${dayNames[selectedDayOfWeek]})`,
        `• *Horário:* ${formData.time}`,
        `• *Pessoas:* ${formData.guests} ${formData.guests === 1 ? 'pessoa' : 'pessoas'}`,
      ];

      if (dbUnit === 'campos_jordao') {
        textLines.push(`• *Ambiente:* ${areaPreference === 'externa' ? 'Área Externa (Jardim & Araucárias)' : 'Área Interna (Salão & Lareiras)'}`);
      }

      if (formData.coHolder && formData.coHolder.trim()) {
        textLines.push(`• *Titular Adicional:* ${formData.coHolder.trim()}`);
      }

      textLines.push('', 'Gostaria de confirmar minha reserva!');

      const fullText = textLines.join('\n');
      // Número exclusivo para Campos do Jordão: 119136-33533
      const phone = dbUnit === 'campos_jordao' ? '5511913633533' : '5511983483472';
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(fullText)}`;
      setWhatsappUrl(waUrl);

      // Direciona ao WhatsApp
      window.open(waUrl, '_blank');

      setStep('success');
    } catch (err) {
      console.error("Erro ao solicitar reserva:", err);
      alert("Houve um erro ao processar sua reserva. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reservation-page min-h-screen text-cafe selection:bg-gold/30 grain overflow-x-hidden flex flex-col relative">
      {/* Floating Back Button */}
      <div className="fixed top-8 left-8 z-50">
        <Link 
          to={urlUnit ? `/${urlUnit}` : '/campos'} 
          className="flex items-center gap-3 px-6 py-3 reservation-back-button rounded-full text-cafe hover:text-wine transition-all group shadow-sm backdrop-blur-md"
        >
          <ChevronRight className="rotate-180 transition-transform group-hover:-translate-x-1" size={18} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Voltar</span>
        </Link>
      </div>

      <main className="flex-1 flex flex-col justify-center py-20 relative z-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-wine/10 text-wine border border-wine/20 text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
                <MapPin size={12} />
                <span>{dbUnit === 'campos_jordao' ? 'Unidade Campos do Jordão · Chateau' : 'Unidade São Paulo · Vila Mariana'}</span>
              </div>
              <h2 className="text-wine uppercase tracking-[0.4em] text-[10px] font-bold mb-2">Reservas</h2>
              <h3 className="text-4xl md:text-6xl font-serif font-bold mb-4 text-cafe tracking-tight">
                Reserve seu <span className="text-wine italic">Momento</span>
              </h3>
              <p className="text-cafe/65 max-w-xl mx-auto text-sm leading-relaxed">
                {dbUnit === 'campos_jordao'
                  ? 'Aberto de quinta a domingo das 12h às 17h e das 19h às 22h. Escolha uma data, horário e preencha seus dados para reservar sua mesa.'
                  : 'Aberto de terça a domingo. Escolha uma data, horário e preencha seus dados para garantir sua mesa exclusiva.'
                }
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 items-stretch">
            {/* Calendar Section */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="reservation-glass-card rounded-[40px] p-8 md:p-12 flex-1"
            >
              <div className="flex justify-between items-center mb-10">
                <button 
                  onClick={() => changeMonth(-1)}
                  className="w-10 h-10 reservation-icon-button rounded-full flex items-center justify-center text-cafe hover:text-wine transition-all active:scale-95 cursor-pointer"
                  aria-label="Mês anterior"
                >
                  <ChevronRight className="rotate-180" size={18}/>
                </button>
                <div className="text-center">
                  <h4 className="text-2xl font-serif font-bold text-cafe">{monthNames[currentMonth]}</h4>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-wine/80 font-bold">{currentYear}</p>
                </div>
                <button 
                  onClick={() => changeMonth(1)}
                  className="w-10 h-10 reservation-icon-button rounded-full flex items-center justify-center text-cafe hover:text-wine transition-all active:scale-95 cursor-pointer"
                  aria-label="Próximo mês"
                >
                  <ChevronRight size={18}/>
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-3 md:gap-4 mb-6 text-center">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, idx) => (
                  <div key={idx} className="text-[10px] uppercase tracking-widest text-cafe/45 font-bold">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-3 md:gap-4">
                {Array.from({length: firstDayOfMonth}).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({length: daysInMonth}, (_, i) => i + 1).map(day => {
                  const active = selectedDay === day;
                  const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
                  const isClosed = isDayClosed(dayOfWeek);
                  const isDayFull = isClosed || (totalCapacity - getOccupancyForDay(day)) <= 0;

                  return (
                    <button 
                      key={day}
                      disabled={isClosed}
                      onClick={() => {
                        setSelectedDay(day);
                        if (step === 'success') setStep('details');
                      }}
                      title={
                        isClosed
                          ? dbUnit === 'campos_jordao'
                            ? 'Fechado de segunda a quarta-feira'
                            : 'Fechado às segundas-feiras'
                          : isDayFull
                            ? 'Lotado'
                            : undefined
                      }
                      className={`relative aspect-square flex items-center justify-center rounded-2xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                        active 
                          ? 'bg-french-green text-cafe scale-110 z-10 reservation-selected-day border border-wine/30 shadow-md' 
                          : isClosed
                            ? 'bg-wine/5 text-cafe/30 border border-wine/10 cursor-not-allowed opacity-60' 
                            : isDayFull
                              ? 'bg-red-500/10 text-red-500/40 cursor-not-allowed border border-red-500/20'
                              : 'reservation-day text-cafe/75 hover:text-wine hover:bg-wine/10'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-wrap gap-4 justify-center border-t border-wine/10 pt-8">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-french-green border border-wine/20"></div>
                  <span className="text-[8px] uppercase tracking-widest text-cafe/55">Selecionado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-light/50 border border-wine/10"></div>
                  <span className="text-[8px] uppercase tracking-widest text-cafe/55">Disponível</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-wine/20 border border-wine/30"></div>
                  <span className="text-[8px] uppercase tracking-widest text-cafe/55">
                    {dbUnit === 'campos_jordao' ? 'Seg a Qua Fechado' : 'Segunda Fechada'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30"></div>
                  <span className="text-[8px] uppercase tracking-widest text-cafe/55">Lotado</span>
                </div>
              </div>
            </motion.div>

            {/* Form Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="reservation-glass-card rounded-[40px] overflow-hidden w-full lg:w-[480px] flex flex-col relative"
            >
              <AnimatePresence mode="wait">
                {step === 'details' && (
                  <motion.div 
                    key="details"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-8 md:p-10 flex flex-col h-full justify-between"
                  >
                    <div>
                      <div className="mb-6">
                        <span className="text-[9px] uppercase tracking-[0.3em] text-wine font-bold block mb-1">
                          Passo 1 de 2
                        </span>
                        <h4 className="text-3xl font-serif font-bold text-cafe">
                          Detalhes da Mesa
                        </h4>
                      </div>

                      {/* Selected Date Card */}
                      <div className="p-5 rounded-2xl reservation-soft-tile border border-wine/10 mb-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-french-green border border-wine/20 flex items-center justify-center shrink-0">
                          <CalendarIcon className="text-wine" size={22} />
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-cafe/55 font-semibold">Data Selecionada</p>
                          <p className="text-base font-serif font-bold text-cafe">
                            {selectedDay} de {monthNames[currentMonth]}, {currentYear}
                          </p>
                          <p className="text-xs text-wine font-medium">
                            {dayNames[selectedDayOfWeek]}
                          </p>
                        </div>
                      </div>

                      {/* Capacity Cards */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-5 rounded-2xl reservation-soft-tile">
                          <p className="text-[9px] uppercase tracking-widest text-cafe/55 mb-1 font-semibold">Capacidade</p>
                          <p className="text-2xl font-serif font-bold text-cafe">{totalCapacity} lugares</p>
                        </div>
                        <div className={`p-5 rounded-2xl border ${isFull ? 'bg-red-500/10 border-red-500/20' : 'bg-french-green/70 border-wine/15'}`}>
                          <p className="text-[9px] uppercase tracking-widest text-cafe/55 mb-1 font-semibold">Disponíveis</p>
                          <p className={`text-2xl font-serif font-bold ${isFull ? 'text-red-500' : 'text-wine'}`}>
                            {availableSlots} vagas
                          </p>
                        </div>
                      </div>

                      {/* Guests Selector */}
                      <div className="space-y-2 mb-6">
                        <label className="text-[9px] uppercase tracking-widest text-cafe/65 font-bold ml-1 flex items-center gap-1.5">
                          <Users size={12} className="text-wine" />
                          <span>Número de Pessoas</span>
                        </label>
                        <select 
                          value={formData.guests}
                          onChange={e => setFormData({ ...formData, guests: Number(e.target.value) })}
                          className="reservation-input w-full rounded-2xl py-3.5 px-4 text-sm outline-none transition-all appearance-none cursor-pointer font-medium"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map(n => (
                            <option key={n} value={n} className="bg-rose-light text-cafe">
                              {n} {n === 1 ? 'Pessoa' : 'Pessoas'}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Time selector preview */}
                      <div className="space-y-2 mb-6">
                        <label className="text-[9px] uppercase tracking-widest text-cafe/65 font-bold ml-1 flex items-center gap-1.5">
                          <Clock size={12} className="text-wine" />
                          <span>Horário Desejado {dbUnit === 'campos_jordao' ? '(12h–17h / 19h–22h)' : isWeekend ? '(10h às 22h)' : '(12h às 22h)'}</span>
                        </label>
                        <select 
                          value={formData.time}
                          onChange={e => setFormData({ ...formData, time: e.target.value })}
                          className="reservation-input w-full rounded-2xl py-3.5 px-4 text-sm outline-none transition-all appearance-none cursor-pointer font-medium"
                        >
                          {timeSlots.map(t => (
                            <option key={t} value={t} className="bg-rose-light text-cafe">{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-wine/10">
                      {isSelectedClosed ? (
                        <div className="flex items-center gap-3 p-4 bg-wine/10 border border-wine/20 rounded-2xl text-cafe">
                          <AlertCircle size={20} className="text-wine shrink-0" />
                          <p className="text-xs font-bold uppercase tracking-wider">
                            {dbUnit === 'campos_jordao'
                              ? 'Fechado de segunda a quarta. Aberto de quinta a domingo.'
                              : 'Fechado às segundas. Aberto de terça a domingo.'
                            }
                          </p>
                        </div>
                      ) : isFull ? (
                        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500">
                          <AlertCircle size={20} className="shrink-0" />
                          <p className="text-xs font-bold uppercase tracking-wider">Sem vagas disponíveis para esta data.</p>
                        </div>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => setStep('form')}
                          className="w-full py-4 px-6 reservation-primary-button text-cafe font-bold uppercase tracking-[0.2em] text-xs rounded-2xl transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                        >
                          <span>Preencher Dados da Reserva</span>
                          <ChevronRight size={16} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {step === 'form' && (
                  <motion.form 
                    key="form"
                    onSubmit={handleBooking}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-8 md:p-10 flex flex-col h-full justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <button 
                          type="button"
                          onClick={() => setStep('details')}
                          className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-wine hover:text-cafe transition-colors cursor-pointer"
                        >
                          <ChevronRight className="rotate-180" size={16} />
                          <span>Voltar</span>
                        </button>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-cafe/55 font-bold">
                          Passo 2 de 2
                        </span>
                      </div>

                      <h4 className="text-2xl sm:text-3xl font-serif font-bold text-cafe mb-1">
                        Seus Dados
                      </h4>
                      <p className="text-xs text-cafe/65 mb-5 leading-relaxed">
                        Preencha seus dados para garantir sua reserva. Ao finalizar, você será direcionado ao WhatsApp da nossa equipe.
                      </p>

                      {/* Selected recap chip */}
                      <div className="p-3.5 rounded-xl bg-french-green/60 border border-wine/15 mb-5 flex items-center justify-between text-xs font-medium text-cafe">
                        <span className="flex items-center gap-1.5">
                          <CalendarIcon size={13} className="text-wine" />
                          {selectedDay}/{currentMonth + 1}/{currentYear} às {formData.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={13} className="text-wine" />
                          {formData.guests} {formData.guests === 1 ? 'pessoa' : 'pessoas'}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {/* Nome Completo */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] uppercase tracking-widest text-cafe/65 font-bold ml-1 flex items-center gap-1">
                            <User size={12} className="text-wine" />
                            <span>Nome Completo *</span>
                          </label>
                          <input 
                            required
                            type="text" 
                            className="reservation-input w-full rounded-2xl py-3 px-4 text-sm outline-none transition-all placeholder:text-cafe/35"
                            placeholder="Seu nome e sobrenome"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>

                        {/* Telefone e Horário */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-[9px] uppercase tracking-widest text-cafe/65 font-bold ml-1 flex items-center gap-1">
                              <Phone size={12} className="text-wine" />
                              <span>WhatsApp *</span>
                            </label>
                            <input 
                              required
                              type="tel" 
                              className="reservation-input w-full rounded-2xl py-3 px-4 text-sm outline-none transition-all placeholder:text-cafe/35"
                              placeholder="(11) 99999-9999"
                              value={formData.phone}
                              onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] uppercase tracking-widest text-cafe/65 font-bold ml-1 flex items-center gap-1">
                              <Clock size={12} className="text-wine" />
                              <span>Horário *</span>
                            </label>
                            <select 
                              required
                              value={formData.time}
                              onChange={e => setFormData({ ...formData, time: e.target.value })}
                              className="reservation-input w-full rounded-2xl py-3 px-4 text-sm outline-none transition-all appearance-none cursor-pointer font-medium"
                            >
                              {timeSlots.map(t => (
                                <option key={t} value={t} className="bg-rose-light text-cafe">{t}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* E-mail */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] uppercase tracking-widest text-cafe/65 font-bold ml-1 flex items-center gap-1">
                            <Mail size={12} className="text-wine" />
                            <span>E-mail *</span>
                          </label>
                          <input 
                            required
                            type="email" 
                            className="reservation-input w-full rounded-2xl py-3 px-4 text-sm outline-none transition-all placeholder:text-cafe/35"
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>

                        {/* Preferência de Ambiente para Campos */}
                        {dbUnit === 'campos_jordao' && (
                          <div className="space-y-1.5 pt-1">
                            <label className="text-[9px] uppercase tracking-widest text-cafe/65 font-bold ml-1">
                              Preferência de Ambiente *
                            </label>
                            <div className="grid grid-cols-2 gap-2.5">
                              <button
                                type="button"
                                onClick={() => setAreaPreference('interna')}
                                className={`py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
                                  areaPreference === 'interna'
                                    ? 'bg-french-green text-cafe border-wine/40 font-bold shadow-xs'
                                    : 'bg-transparent text-cafe/60 border-wine/15 hover:border-wine/30'
                                }`}
                              >
                                Área Interna (Lareira)
                              </button>
                              <button
                                type="button"
                                onClick={() => setAreaPreference('externa')}
                                className={`py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
                                  areaPreference === 'externa'
                                    ? 'bg-french-green text-cafe border-wine/40 font-bold shadow-xs'
                                    : 'bg-transparent text-cafe/60 border-wine/15 hover:border-wine/30'
                                }`}
                              >
                                Área Externa (Deck)
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Titular Adicional */}
                        <div className="space-y-1.5 pt-1">
                          <label className="text-[9px] uppercase tracking-widest text-cafe/55 font-bold ml-1">
                            Segundo Titular (Opcional)
                          </label>
                          <input 
                            type="text" 
                            className="reservation-input w-full rounded-2xl py-3 px-4 text-sm outline-none transition-all placeholder:text-cafe/35"
                            placeholder="Nome de quem acompanhará"
                            value={formData.coHolder}
                            onChange={e => setFormData({ ...formData, coHolder: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 mt-4 border-t border-wine/10">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 px-6 reservation-primary-button text-cafe font-bold uppercase tracking-[0.25em] text-xs rounded-2xl transition-all flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? (
                          <span>Processando Reserva...</span>
                        ) : (
                          <>
                            <span>Reservar Agora</span>
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                      <p className="text-center text-[10px] text-cafe/50 mt-2.5 leading-relaxed">
                        Ao clicar, seus dados serão registrados e você será direcionado ao WhatsApp para confirmação.
                      </p>
                    </div>
                  </motion.form>
                )}

                {step === 'success' && (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 md:p-12 flex flex-col items-center justify-center text-center h-full"
                  >
                    <div className="w-16 h-16 bg-french-green rounded-full flex items-center justify-center mb-6 border border-wine/20 shadow-md">
                      <CheckCircle2 className="text-wine" size={34} />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-wine font-bold mb-1">
                      Sucesso
                    </span>
                    <h4 className="text-3xl font-serif font-bold text-cafe mb-2">
                      Reserva Solicitada!
                    </h4>
                    <p className="text-wine font-bold text-2xl mb-4 tracking-widest">
                      {lastReservationCode}
                    </p>
                    <p className="text-cafe/70 text-sm leading-relaxed mb-6 max-w-sm">
                      Obrigado, <strong className="text-cafe font-semibold">{formData.name}</strong>! Seus dados foram registrados com sucesso e direcionados ao WhatsApp.
                    </p>

                    <div className="w-full space-y-3">
                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-sans text-xs tracking-wider uppercase font-bold flex items-center justify-center gap-2.5 shadow-md shadow-[#25D366]/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <MessageCircle size={18} />
                          <span>Abrir WhatsApp Novamente</span>
                        </a>
                      )}

                      <Link 
                        to={urlUnit ? `/${urlUnit}` : '/campos'}
                        className="w-full py-3 px-6 reservation-back-button rounded-2xl text-[10px] font-bold uppercase tracking-widest text-cafe hover:text-wine transition-all block text-center"
                      >
                        Voltar ao Início
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="py-12 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[9px] uppercase tracking-[0.5em] text-cafe/45">
            © {new Date().getFullYear()} Bistrot de Ville · Reservas
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Reservas;
