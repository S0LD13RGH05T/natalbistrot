import React, { useState } from 'react';
import { Award, Clock, Heart, Music, User } from 'lucide-react';
import { BookingConfirmation } from '../types';
import { BISTRO_TABLES } from '../data';

interface BookingFormProps {
  selectedTableId: string;
  onBookingSuccess: (confirmation: BookingConfirmation) => void;
}

export default function BookingForm({ selectedTableId, onBookingSuccess }: BookingFormProps) {
  const [customerName, setCustomerName] = useState<string>('');
  const [partnerName, setPartnerName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [mainCourse, setMainCourse] = useState<string>('Salmão ao molho champagne com Risoto de alho poró');
  const [dessert, setDessert] = useState<string>('Mousse de chocolate');
  const [upgradeChampagne, setUpgradeChampagne] = useState<boolean>(false);
  const [upgradeValet, setUpgradeValet] = useState<boolean>(false);
  const [upgradeFlowers, setUpgradeFlowers] = useState<boolean>(false);
  const [upgradeViolin, setUpgradeViolin] = useState<boolean>(false);
  const [timeSlot, setTimeSlot] = useState<string>('19:00 - 21:00 (Primeiro Turno)');
  const [guestNote, setGuestNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const basePrice = 250 * 2;
  const totalPrice =
    basePrice +
    (upgradeValet ? 40 : 0) +
    (upgradeChampagne ? 280 : 0) +
    (upgradeFlowers ? 120 : 0) +
    (upgradeViolin ? 150 : 0);

  const activeTable = BISTRO_TABLES.find((table) => table.id === selectedTableId) || BISTRO_TABLES[0];

  const executeReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !partnerName || !email || !phone) {
      alert('Por favor, preencha todos os campos obrigatórios da reserva.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      onBookingSuccess({
        id: `FR-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName,
        partnerName,
        timeSlot,
        tableNumber: activeTable.number,
        locationDescription: activeTable.locationDescription,
        totalPrice,
        customDedicationGenerated: guestNote || undefined,
        date: '12 de Junho de 2026',
        entradas: ['Burrata cremosa Provençal'],
        pratoPrincipal: mainCourse,
        sobremesa: dessert,
        champagneUpgrade: upgradeChampagne,
        valetUpgrade: upgradeValet,
        flowersUpgrade: upgradeFlowers,
        violinUpgrade: upgradeViolin,
      });
      setIsSubmitting(false);
    }, 900);
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-12">
      <form
        onSubmit={executeReservation}
        className="space-y-7 rounded-2xl border border-[#eadbd0] bg-white p-6 text-[#352220] shadow-xl shadow-[#b8937d]/10 md:p-8 lg:col-span-7"
      >
        <div className="flex items-center gap-3 border-b border-[#eadbd0] pb-4">
          <User className="h-5 w-5 text-[#8f4f61]" />
          <h3 className="font-display text-lg font-semibold uppercase tracking-[0.18em]">Dados da reserva</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nome *">
            <input
              type="text"
              required
              placeholder="Ex: Carlos Albuquerque"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={inputClass}
              id="booking-name"
            />
          </Field>

          <Field label="Acompanhante *">
            <input
              type="text"
              required
              placeholder="Ex: Vanessa Santoro"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              className={inputClass}
              id="booking-partner"
            />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="E-mail *">
            <input
              type="email"
              required
              placeholder="Ex: carlos@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              id="booking-email"
            />
          </Field>

          <Field label="Celular / WhatsApp *">
            <input
              type="tel"
              required
              placeholder="Ex: (11) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              id="booking-phone"
            />
          </Field>
        </div>

        <div className="space-y-4 border-t border-[#eadbd0] pt-6">
          <h3 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.18em] text-[#8f4f61]">
            <Award className="h-4 w-4" />
            Escolha o menu
          </h3>

          <div className="space-y-4 rounded-2xl border border-[#eadbd0] bg-[#fffaf5] p-4 md:p-6">
            <div className="grid gap-2 border-b border-[#eadbd0] pb-3 text-sm md:grid-cols-3 md:items-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8a6a61]">Entrada</span>
              <span className="font-serif font-semibold text-[#352220] md:col-span-2">Burrata cremosa Provençal</span>
            </div>

            <div className="grid gap-2 border-b border-[#eadbd0] pb-3 text-sm md:grid-cols-3 md:items-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8a6a61]">Prato principal *</span>
              <div className="md:col-span-2">
                <select
                  value={mainCourse}
                  onChange={(e) => setMainCourse(e.target.value)}
                  className={selectClass}
                  id="choice-main-course"
                >
                  <option value="Salmão ao molho champagne com Risoto de alho poró">
                    Salmão ao champagne & risoto de alho poró
                  </option>
                  <option value="Ragu de carne bordelaise com fettuccine artesanal">
                    Ragu bordelaise & fettuccine artesanal
                  </option>
                </select>
              </div>
            </div>

            <div className="grid gap-2 text-sm md:grid-cols-3 md:items-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8a6a61]">Sobremesa *</span>
              <div className="md:col-span-2">
                <select value={dessert} onChange={(e) => setDessert(e.target.value)} className={selectClass} id="choice-dessert">
                  <option value="Mousse de chocolate">Mousse de chocolate aerado</option>
                  <option value="Crème brûlée">Crème brûlée de baunilha</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t border-[#eadbd0] pt-6">
          <label className="block font-mono text-[10px] uppercase tracking-[0.24em] text-[#8a6a61]">Turno da noite *</label>
          <div className="grid gap-4 sm:grid-cols-2">
            <SlotButton
              active={timeSlot.includes('19:00')}
              onClick={() => setTimeSlot('19:00 - 21:00 (Primeiro Turno)')}
              title="1º turno"
              subtitle="19h às 21h"
            />
            <SlotButton
              active={timeSlot.includes('21:30')}
              onClick={() => setTimeSlot('21:30 - 23:30 (Segundo Turno)')}
              title="2º turno"
              subtitle="21h30 às 23h30"
            />
          </div>
        </div>

        <div className="space-y-4 border-t border-[#eadbd0] pt-6">
          <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-[#8f4f61]">Extras opcionais</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <ExtraButton active={upgradeValet} onClick={() => setUpgradeValet(!upgradeValet)} tag="Valet" title="Manobrista" text="Recepção do carro na porta." price="+ R$ 40" />
            <ExtraButton active={upgradeChampagne} onClick={() => setUpgradeChampagne(!upgradeChampagne)} tag="Champagne" title="Garrafa francesa" text="Servida gelada na mesa." price="+ R$ 280" />
            <ExtraButton active={upgradeFlowers} onClick={() => setUpgradeFlowers(!upgradeFlowers)} tag="Flores" title="Buquê pequeno" text="Rosas e folhagens da estação." price="+ R$ 120" />
            <ExtraButton active={upgradeViolin} onClick={() => setUpgradeViolin(!upgradeViolin)} tag="Música" title="Canção na mesa" text="Uma dedicação curta ao casal." price="+ R$ 150" icon />
          </div>
        </div>

        <div className="border-t border-[#eadbd0] pt-6">
          <div className="mb-4 rounded-2xl border border-[#eadbd0] bg-[#fffaf5] p-5 text-center font-serif">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.24em] text-[#8a6a61]">Total da reserva</p>
            <p className="text-3xl font-bold text-[#352220]">R$ {totalPrice.toFixed(2).replace('.', ',')}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[#8a6a61]">2 pessoas inclusas</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#8f4f61] py-4 font-serif text-base font-bold uppercase tracking-[0.22em] text-white shadow-lg transition-all hover:bg-[#713747] disabled:cursor-wait disabled:opacity-70"
            id="submit-final-booking-btn"
          >
            {isSubmitting ? (
              <>
                <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Processando reserva...</span>
              </>
            ) : (
              <>
                <Heart className="h-5 w-5 fill-current" />
                <span>Finalizar reserva</span>
              </>
            )}
          </button>
        </div>
      </form>

      <aside className="space-y-6 lg:col-span-5">
        <div className="rounded-2xl border border-[#eadbd0] bg-white p-6 shadow-xl shadow-[#b8937d]/10 md:p-8">
          <h4 className="flex items-center gap-2 font-display text-base font-semibold uppercase tracking-[0.18em] text-[#352220]">
            <Heart className="h-4 w-4 text-[#d998a8]" />
            Detalhes do encontro
          </h4>
          <p className="mt-4 font-serif text-base leading-relaxed text-[#6e5a56]">
            Use este espaço para restrições alimentares, uma frase para o cartão da mesa ou uma preferência simples.
          </p>

          <textarea
            value={guestNote}
            onChange={(e) => setGuestNote(e.target.value)}
            rows={7}
            maxLength={420}
            placeholder="Ex: Somos vegetarianos. Gostaria de deixar um cartão simples na mesa: 'Feliz nosso dia'."
            className="mt-5 w-full resize-none rounded-2xl border border-[#eadbd0] bg-[#fffaf5] px-4 py-3 text-sm text-[#352220] outline-none transition-colors placeholder:text-[#9f8a83] focus:border-[#d998a8]"
          />
          <p className="mt-2 text-right font-mono text-[10px] uppercase tracking-wider text-[#8a6a61]">{guestNote.length}/420</p>

          <div className="mt-6 space-y-3 border-t border-[#eadbd0] pt-5 text-sm text-[#6e5a56]">
            <SummaryLine label="Mesa" value={activeTable.locationDescription} />
            <SummaryLine label="Turno" value={timeSlot} />
            <SummaryLine label="Menu" value="Entrada, prato principal e sobremesa" />
          </div>
        </div>
      </aside>
    </div>
  );
}

const inputClass =
  'w-full rounded-xl border border-[#eadbd0] bg-[#fffaf5] px-4 py-3 text-sm text-[#352220] outline-none transition-colors placeholder:text-[#9f8a83] focus:border-[#d998a8]';

const selectClass =
  'w-full rounded-xl border border-[#eadbd0] bg-white px-3 py-2.5 font-serif text-sm text-[#352220] outline-none transition-colors focus:border-[#d998a8]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8a6a61]">{label}</label>
      {children}
    </div>
  );
}

function SlotButton({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex cursor-pointer flex-col items-center gap-1 rounded-2xl border p-4 text-center font-serif transition-all ${
        active ? 'border-[#8f4f61] bg-[#f4e3e7] text-[#352220] shadow-sm' : 'border-[#eadbd0] bg-white text-[#6e5a56] hover:border-[#d998a8]'
      }`}
    >
      <Clock className="h-4 w-4 text-[#8f4f61]" />
      <span className="text-sm font-semibold">{title}</span>
      <span className="text-xs">{subtitle}</span>
      <span className="font-mono text-[9px] uppercase tracking-wider text-[#8a6a61]">R$ 500,00 o casal</span>
    </button>
  );
}

function ExtraButton({
  active,
  onClick,
  tag,
  title,
  text,
  price,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  tag: string;
  title: string;
  text: string;
  price: string;
  icon?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex cursor-pointer items-start justify-between gap-3 rounded-2xl border p-4 text-left transition-all ${
        active ? 'border-[#8f4f61] bg-[#f4e3e7]' : 'border-[#eadbd0] bg-white hover:border-[#d998a8]'
      }`}
    >
      <div className="space-y-1">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#fffaf5] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#8f4f61]">
          {icon && <Music className="h-2.5 w-2.5" />}
          {tag}
        </span>
        <p className="font-serif text-sm font-semibold text-[#352220]">{title}</p>
        <p className="text-xs leading-relaxed text-[#6e5a56]">{text}</p>
      </div>
      <span className="whitespace-nowrap font-mono text-xs text-[#9c80bf]">{price}</span>
    </button>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8a6a61]">{label}</span>
      <span className="text-right font-serif text-[#352220]">{value}</span>
    </div>
  );
}
