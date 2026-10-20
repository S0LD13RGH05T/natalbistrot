import React from 'react';
import { MenuItem as MenuItemType } from '../types';
import { MENU_ITEMS } from '../data';
// Substitua este arquivo pela sua imagem enviada: src/assets/images/menu_burrata_custom.png
import burrataImage from '../assets/images/menu_burrata_1779921120312.png';
import dessertImage from '../assets/images/menu_dessert_1779921191942.png';
import raguImage from '../assets/images/menu_ragu_1779921134583.png';
import salmonImage from '../assets/images/menu_salmon_1779921174388.png';

const DISH_PHOTOS = {
  'ent-1': {
    src: burrataImage,
    alt: 'Burrata cremosa Provençal',
    label: 'Burrata Provençal',
  },
  'prato-1': {
    src: salmonImage,
    alt: 'Salmão ao molho champagne',
    label: 'Salmão ao champagne',
  },
  'prato-2': {
    src: raguImage,
    alt: 'Ragu de carne bordelaise',
    label: 'Ragu com fettuccine',
  },
  sobremesas: {
    src: dessertImage,
    alt: 'Sobremesas do menu',
    label: 'Sobremesas',
  },
};

export default function MenuCard() {
  const entrada = MENU_ITEMS.find((item) => item.id === 'ent-1')!;
  const salmon = MENU_ITEMS.find((item) => item.id === 'prato-1')!;
  const ragu = MENU_ITEMS.find((item) => item.id === 'prato-2')!;
  const sobremesas = MENU_ITEMS.filter((item) => item.category === 'sobremesa');

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#d8c7e5]/60 bg-[#fcf8ff]/95 shadow-xl shadow-[#7b4f96]/15 backdrop-blur-[6px] md:bg-[#fcf8ff]/90">
      <div className="border-b border-[#d8c7e5]/60 bg-[#f9f4fd]/80 px-6 py-10 text-center md:px-12">
        <p className="font-display text-2xl uppercase tracking-[0.28em] text-[#24372f]">Bistrot de Ville</p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.36em] text-[#7b4f96]">menu dia dos namorados</p>
        <h3 className="mt-8 font-script text-5xl leading-none text-[#8b5aa8] md:text-6xl">À la chandelle</h3>
        <p className="mx-auto mt-5 max-w-xl font-serif text-lg leading-relaxed text-[#52665b]">
          Cardápio elaborado por nossos Chefs formados na renomada escola Cordon Bleu.
        </p>
        <p className="mt-5 inline-flex rounded-full bg-[#f3eef9] px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#9c80bf]">
          R$ 250 + taxa por pessoa
        </p>
      </div>

      <div className="divide-y divide-[#d8c7e5]/60">
        <DishRow category="Entrada" item={entrada} photo={DISH_PHOTOS['ent-1']} />
        <DishRow category="Prato principal" item={salmon} photo={DISH_PHOTOS['prato-1']} />
        <DishRow category="Prato principal" item={ragu} photo={DISH_PHOTOS['prato-2']} note="ou" />
        <DessertRow items={sobremesas} photo={DISH_PHOTOS.sobremesas} />
      </div>

      <div className="grid gap-5 border-t border-[#d8c7e5]/60 bg-[#f9f4fd]/60 px-6 py-8 text-center font-serif text-sm text-[#52665b] md:grid-cols-2 md:px-12 md:text-left">
        <p>
          Instagram: <strong className="font-semibold text-[#24372f]">@bistrot.deville</strong>
        </p>
        <p className="md:text-right">Rua Rio Grande, 218 - Vila Mariana, São Paulo</p>
      </div>
    </div>
  );
}

function DishRow({
  category,
  item,
  photo,
  note,
}: {
  category: string;
  item: MenuItemType;
  photo: { src: string; alt: string; label: string };
  note?: string;
}) {
  return (
    <section className="grid gap-6 px-6 py-8 md:grid-cols-[minmax(0,1fr)_minmax(320px,0.92fr)] md:items-center md:px-12 lg:gap-10">
      <DishInfo category={category} item={item} note={note} />
      <DishPhoto photo={photo} />
    </section>
  );
}

function DessertRow({
  items,
  photo,
}: {
  items: MenuItemType[];
  photo: { src: string; alt: string; label: string };
}) {
  return (
    <section className="grid gap-6 px-6 py-8 md:grid-cols-[minmax(0,1fr)_minmax(320px,0.92fr)] md:items-center md:px-12 lg:gap-10">
      <div className="text-center md:text-left">
        <CategoryLabel title="Sobremesa" />
        <div className="mt-6 space-y-6">
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              <MenuItem item={item} showDescription={index === 0} />
              {index === 0 && <p className="font-serif text-sm italic text-[#8b5aa8]">ou</p>}
            </React.Fragment>
          ))}
        </div>
      </div>
      <DishPhoto photo={photo} />
    </section>
  );
}

function DishInfo({ category, item, note }: { category: string; item: MenuItemType; note?: string }) {
  return (
    <div className="text-center md:text-left">
      <CategoryLabel title={category} />
      <div className="mt-6">
        {note && <p className="mb-4 font-serif text-sm italic text-[#8b5aa8]">{note}</p>}
        <MenuItem item={item} showDescription />
      </div>
    </div>
  );
}

function CategoryLabel({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="hidden h-px flex-1 bg-[#b9d8bd] md:block" />
      <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#7b4f96]">{title}</h4>
      <span className="h-px flex-1 bg-[#b9d8bd]" />
    </div>
  );
}

function MenuItem({ item, showDescription }: { item: MenuItemType; showDescription?: boolean }) {
  return (
    <article>
      <h5 className="font-display text-xl font-semibold uppercase tracking-[0.08em] text-[#24372f] md:text-2xl">
        {item.name}
      </h5>
      <p className="mt-2 font-serif text-sm italic text-[#637468]">{item.originalFrenchName}</p>
      {showDescription && <p className="mt-4 max-w-xl text-base leading-relaxed text-[#52665b]">{item.description}</p>}
    </article>
  );
}

function DishPhoto({ photo }: { photo: { src: string; alt: string; label: string } }) {
  return (
    <figure className="group overflow-hidden rounded-2xl border border-[#cfe5d1] bg-white p-2 shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <img
          src={photo.src}
          alt={photo.alt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/88 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#24372f] backdrop-blur-sm">
          {photo.label}
        </figcaption>
      </div>
    </figure>
  );
}
