export interface MenuItem {
  id: string;
  code?: string;
  name: string;
  description?: string;
  price: number | { [key: string]: number };
  category: string;
  image?: string;
  isPromoted?: boolean;
  promotionalPrice?: number | { [key: string]: number };
  promotionLabel?: string;
  unit?: string;
}

export const normalizeMenuKey = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const mergeMenuWithSavedChanges = (baseItems: MenuItem[], savedItems: MenuItem[]) => {
  const byId = new Map(savedItems.map(item => [item.id, item]));
  const byName = new Map(savedItems.map(item => [normalizeMenuKey(item.name), item]));

  const mergedBaseItems = baseItems.map(item => {
    const saved = byId.get(item.id) || byName.get(normalizeMenuKey(item.name));
    return saved ? { ...item, ...saved } : item;
  });

  const newSavedItems = savedItems.filter(saved => 
    !baseItems.some(base => base.id === saved.id || normalizeMenuKey(base.name) === normalizeMenuKey(saved.name))
  );

  return [...newSavedItems, ...mergedBaseItems];
};

export const menuData: MenuItem[] = [
  // ── Brunch e Cafe da Tarde ─────────────────────────────────────────────────
  {
    id: 'croque-monsieur-madame',
    name: 'Croque Monsieur ou Croque Madame',
    description: 'Pao brioche de fermentacao natural feito com farinha francesa, presunto parma, queijo gruyere, mostarda dijon e molho branco gratinado. Croque Madame com gema mole + R$ 3,00.',
    price: 55.9,
    category: 'Brunch e Cafe da Tarde',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop',
    isPromoted: true,
  },
  {
    id: 'croissant-ma-cherie',
    name: 'Croissant Ma Cherie',
    description: 'Croissant frances recheado com queijo mucarela e presunto cru.',
    price: 39.9,
    category: 'Brunch e Cafe da Tarde',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
    isPromoted: true,
  },
  {
    id: 'french-toast-croissant-brulee',
    name: 'French Toast Croissant Brulee',
    description: 'Croissant frances tostado com camada de queijo brie macerado e cobertura de mel.',
    price: 38.9,
    category: 'Brunch e Cafe da Tarde',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=400&fit=crop',
  },
  {
    id: 'panelinha-ovos-caipira',
    name: 'Panelinha de Ovos Caipira Mexidos',
    description: 'Acompanha uma fatia de pao brioche de fermentacao natural feito com farinha francesa.',
    price: 34.9,
    category: 'Brunch e Cafe da Tarde',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=400&fit=crop',
  },
  {
    id: 'brunch-para-2',
    name: 'Brunch para 2 Pessoas',
    description: 'Kir Royale, paes, croissant, quiches de presunto cru com gruyere, presunto parma, brie, nozes, geleia de frutas vermelhas, manteiga, mini tarte aux pommes e mousse de chocolate.',
    price: 285.9,
    category: 'Brunch e Cafe da Tarde',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',
  },

  // ── Saladas ────────────────────────────────────────────────────────────────
  {
    id: 'quiche-com-salada',
    name: 'Quiche com Salada',
    description: 'Acompanha salada verde e tomate sweet grape com molho de mostarda dijon. Sabor: presunto parma com queijo gruyere.',
    price: 57.9,
    category: 'Saladas',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
    isPromoted: true,
  },
  {
    id: 'salada-chevre-chaud',
    name: 'Salada Chevre Chaud',
    description: 'Salada verde, tomate, tartine de queijo de cabra ao forno e nozes com molho de mostarda dijon.',
    price: 62.9,
    category: 'Saladas',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
  },

  // ── Entradas ───────────────────────────────────────────────────────────────
  {
    id: 'couvert',
    name: 'Couvert',
    description: 'Pao de campagne, manteiga de ervas, tapenade e geleia de frutas vermelhas. Serve 2 pessoas.',
    price: 49.9,
    category: 'Entradas',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
  },
  {
    id: 'brie-fondant',
    name: 'Brie Fondant com Pistache e Nozes',
    description: 'Queijo brie com cobertura de pistache, nozes e mel servido no rechaud. Acompanha pao de fermentacao natural.',
    price: 72.9,
    category: 'Entradas',
    image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=400&h=400&fit=crop',
  },
  {
    id: 'varal-parma-burrata',
    name: 'Varal de Parma com Burrata ao Molho de Tomate',
    description: 'Burrata cremosa com presunto parma, molho de tomate artesanal e croissant tostada.',
    price: 84.9,
    category: 'Entradas',
    image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400&h=400&fit=crop',
  },
  {
    id: 'vol-au-vent',
    name: 'Vol-au-Vent',
    description: 'Classico frances: 2 unidades de massa folhada recheada com creme e salmao.',
    price: 58.9,
    category: 'Entradas',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop',
  },
  {
    id: 'croquete-bourguignon',
    name: 'Croquete de Bourguignon',
    description: '6 unidades de croquete de carne. Bourguignon: carne cozida ao vinho.',
    price: 52.9,
    category: 'Entradas',
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&h=400&fit=crop',
  },
  {
    id: 'batata-gaufrette-aioli',
    name: 'Batata Frita Gaufrette com Aioli',
    description: 'Batata xadrezinha crocante feita na casa. Acompanha aioli de manjericao.',
    price: 48.9,
    category: 'Entradas',
    image: 'https://images.unsplash.com/photo-1504387432042-8aca549e4729?w=400&h=400&fit=crop',
    isPromoted: true,
  },

  // ── Peixes e Frutos do Mar ─────────────────────────────────────────────────
  {
    id: 'camarao-provencal-risoto-limao',
    name: 'Camarao a Provencal com Risoto de Limao',
    description: 'Risoto de limao siciliano com camarao rosa a provencal finalizado com azeite de ervas.',
    price: 139.9,
    category: 'Peixes e Frutos do Mar',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=400&fit=crop',
  },
  {
    id: 'saumon-beurre-blanc',
    name: 'Saumon au Beurre Blanc com Aspargos',
    description: 'Salmao grelhado ao molho frances emulsionado com manteiga, limao siciliano e vinho branco. Acompanha aspargos e arroz branco.',
    price: 118.9,
    category: 'Peixes e Frutos do Mar',
    image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&h=400&fit=crop',
  },
  {
    id: 'ravioli-burrata-champagne-camarao',
    name: 'Ravioli de Burrata ao Molho de Champagne com Camarao',
    description: 'Ravioli recheado com burrata, molho de champagne e acompanhamento de camarao.',
    price: 139.9,
    category: 'Peixes e Frutos do Mar',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=400&fit=crop',
  },
  {
    id: 'tartare-saumon-maison',
    name: 'Tartare de Saumon Maison',
    description: 'Salmao cru a moda da casa com alcaparras e toque de trufa, servido com salada verde e batata gaufrette frita.',
    price: 97.9,
    category: 'Peixes e Frutos do Mar',
    image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&h=400&fit=crop',
  },

  // ── Vegetariano ────────────────────────────────────────────────────────────
  {
    id: 'nhoque-batata-chevre-pistache',
    name: 'Nhoque de Batata com Fonduta de Chevre e Pistache',
    description: 'Nhoque de batata roxa feito artesanalmente com molho de queijo de cabra e crumble de pistache.',
    price: 105.9,
    category: 'Vegetariano',
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=400&fit=crop',
  },

  // ── Menu Kids ──────────────────────────────────────────────────────────────
  {
    id: 'pizinho',
    name: 'Pizinho',
    description: 'Fetucine ao pomodoro com molho de tomate artesanal. Exclusivo para criancas ate 12 anos.',
    price: 55.9,
    category: 'Menu Kids',
    image: 'https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?w=400&h=400&fit=crop',
  },

  // ── Carnes ─────────────────────────────────────────────────────────────────
  {
    id: 'tartare-boeuf',
    name: 'Tartare de Boeuf',
    description: 'File mignon Angus cortado na ponta da faca, servido cru com molho especial e batata frita gaufrette da casa.',
    price: 97.9,
    category: 'Carnes',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&h=400&fit=crop',
  },
  {
    id: 'file-angus-poivre-aligot',
    name: 'File Angus au Poivre com Aligot',
    description: 'File mignon de Angus ao molho classico com pimenta verde. Acompanha aligot, pure de batata com queijos.',
    price: 129.9,
    category: 'Carnes',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop',
  },
  {
    id: 'boeuf-bourguignon-massa',
    name: 'Boeuf Bourguignon com Massa Fresca',
    description: 'Carne cozida lentamente ao vinho tinto. Acompanha fettuccine.',
    price: 108.9,
    category: 'Carnes',
    image: 'https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?w=400&h=400&fit=crop',
  },
  {
    id: 'entrecote-ancienne',
    name: "Entrecote L'Ancienne",
    description: 'Entrecote Black Angus ao molho de mostarda a ancienne com batata gaufrette feita na casa.',
    price: 129.9,
    category: 'Carnes',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop',
  },
  {
    id: 'hachis-parmentier',
    name: 'Hachis Parmentier',
    description: 'Ragu de carne ao vinho coberto com pure de batata e crosta de pao e parmesao. Acompanha salada verde.',
    price: 82.9,
    category: 'Carnes',
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=400&fit=crop',
  },

  // ── Aves ───────────────────────────────────────────────────────────────────
  {
    id: 'confit-pato-cassis-brie',
    name: 'Confit de Pato com Molho de Cassis, Risoto de Brie e Damasco',
    description: 'Coxa e sobrecoxa de pato confitada com molho de reducao de demi-glace, vinho tinto e licor de cassis. Acompanha risoto de brie e damasco.',
    price: 134.9,
    category: 'Aves',
    image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=400&h=400&fit=crop',
  },
  {
    id: 'coq-au-vin',
    name: 'Coq au Vin',
    description: 'Coxa e sobrecoxa de frango cozido no vinho tinto. Acompanhado de fettuccine.',
    price: 82.9,
    category: 'Aves',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=400&fit=crop',
  },

  // ── Menu Executivo ─────────────────────────────────────────────────────────
  {
    id: 'menu-executivo',
    name: 'Menu Executivo',
    description: 'Terca a sexta-feira ate as 15h. Entrada + prato principal. Opcoes: croquete de boeuf bourguignon ou tartine de brie; risoto chevre, cordon bleu, risoto de file mignon, fettuccine ao beurre blanc de laranja com salmao ou file mignon au poivre.',
    price: 69.9,
    category: 'Menu Executivo',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=400&fit=crop',
  },

  // ── Menu Especial ──────────────────────────────────────────────────────────
  {
    id: 'bon-marche',
    name: 'Menu Especial Bon Marche',
    description: 'Experiencia em 3 tempos: entrada, prato principal e sobremesa. Valido no jantar de domingo a quinta-feira.',
    price: 120,
    category: 'Menu Especial',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=400&fit=crop',
  },

  // ── Sobremesas ─────────────────────────────────────────────────────────────
  {
    id: 'mousse-chocolat-frutas-vermelhas',
    name: 'Mousse au Chocolat com Calda de Frutas Vermelhas',
    description: 'Mousse de chocolate servido com calda de frutas vermelhas feita artesanalmente na casa.',
    price: 42.9,
    category: 'Sobremesas',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop',
  },
  {
    id: 'creme-brulee',
    name: 'Creme Brulee',
    description: 'Receita original da Franca, feita com fava de baunilha e ovos caipira.',
    price: 39.9,
    category: 'Sobremesas',
    image: 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=400&h=400&fit=crop',
    isPromoted: true,
  },
  {
    id: 'tarte-pommes-gingembre',
    name: 'Tarte aux Pommes com Espuma de Gengibre',
    description: 'Massa folhada recheada com maca, acompanhada de nozes, espuma de gengibre e caramelo feito na casa.',
    price: 42.9,
    category: 'Sobremesas',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop',
  },
  {
    id: 'bolo-coco-fresco',
    name: 'Bolo de Coco Fresco e Molhadinho',
    description: 'Bolo de coco fresco e molhadinho.',
    price: 32.9,
    category: 'Sobremesas',
    image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400&h=400&fit=crop',
  },

  // ── Bebidas Quentes ────────────────────────────────────────────────────────
  {
    id: 'cafe-espresso',
    name: 'Cafe Espresso',
    description: 'Cafe especial de alta qualidade. Acompanha chocolate Callebaut.',
    price: 13.9,
    category: 'Bebidas Quentes',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=400&fit=crop',
  },
  {
    id: 'cafe-com-leite',
    name: 'Cafe com Leite',
    description: 'Cafe espresso e leite vaporizado. Acompanha chocolate Callebaut.',
    price: 21.9,
    category: 'Bebidas Quentes',
    image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&h=400&fit=crop',
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    description: 'Cafe espresso e leite cremoso vaporizado. Acompanha chocolate Callebaut.',
    price: 22.9,
    category: 'Bebidas Quentes',
    image: 'https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?w=400&h=400&fit=crop&auto=format',
  },
  {
    id: 'chocolate-quente',
    name: 'Chocolate Quente',
    description: 'Leite vaporizado com chocolate dois frades. Acompanha chocolate Callebaut.',
    price: 22.9,
    category: 'Bebidas Quentes',
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=400&fit=crop',
  },
  {
    id: 'cha-especial',
    name: 'Cha Especial',
    description: 'Hibisco, pedacos de maca, morango, groselha preta, framboesa, amoras e bagas de sabugueiro.',
    price: 21.9,
    category: 'Bebidas Quentes',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
  },

  // ── Sucos e Bebidas ────────────────────────────────────────────────────────
  {
    id: 'suco-citrico-gengibre',
    name: 'Suco Citrico com Espuma de Gengibre',
    description: 'Limao taiti, limao siciliano e laranja.',
    price: 23.9,
    category: 'Sucos e Bebidas',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop',
  },
  {
    id: 'suco-laranja',
    name: 'Suco de Laranja',
    description: 'Suco natural de laranja.',
    price: 17.9,
    category: 'Sucos e Bebidas',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop',
  },
  {
    id: 'morango-laranja',
    name: 'Morango com Laranja',
    description: 'Suco natural de morango com laranja.',
    price: 23.9,
    category: 'Sucos e Bebidas',
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=400&fit=crop',
  },
  {
    id: 'cha-especial-gelado',
    name: 'Cha Especial Gelado',
    description: 'Hibisco, maca, morango, groselha preta, framboesa, amoras e sabugueiro.',
    price: 23.9,
    category: 'Sucos e Bebidas',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
  },
  {
    id: 'soda-francesa-framboesa',
    name: 'Soda Francesa de Framboesa',
    description: 'Soda italiana com xarope frances de framboesa.',
    price: 23.9,
    category: 'Sucos e Bebidas',
    image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400&h=400&fit=crop',
  },
  {
    id: 'refrigerantes',
    name: 'Refrigerantes',
    description: 'Coca-Cola normal ou zero, Guarana normal ou zero.',
    price: 11,
    category: 'Sucos e Bebidas',
    image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400&h=400&fit=crop',
  },
  {
    id: 'agua-com-sem-gas',
    name: 'Agua com ou sem Gas',
    description: 'Agua mineral com gas ou sem gas.',
    price: 11,
    category: 'Sucos e Bebidas',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop',
  },

  // ── Cervejas ───────────────────────────────────────────────────────────────
  {
    id: 'cerveja-heineken',
    name: 'Cerveja Heineken',
    description: 'Long neck 330ml.',
    price: 18.9,
    category: 'Cervejas',
    image: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=400&h=400&fit=crop',
  },
  {
    id: 'cerveja-stella',
    name: 'Cerveja Stella Artois',
    description: 'Long neck 330ml.',
    price: 18.9,
    category: 'Cervejas',
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=400&fit=crop',
  },

  // ── Bebidas Alcoolicas ─────────────────────────────────────────────────────
  {
    id: 'whisky-black-label',
    name: 'Whisky Black Label',
    description: 'Dose.',
    price: 42,
    category: 'Bebidas Alcoolicas',
    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&h=400&fit=crop',
  },
  {
    id: 'whisky-buchanans',
    name: "Whisky Buchanan's Deluxe",
    description: 'Dose.',
    price: 42,
    category: 'Bebidas Alcoolicas',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&h=400&fit=crop',
  },

  // ── Aperitivos e Licores ───────────────────────────────────────────────────
  {
    id: 'campari',
    name: 'Campari',
    description: 'Aperitivo italiano.',
    price: 25,
    category: 'Aperitivos e Licores',
    image: 'https://images.unsplash.com/photo-1600184933855-71f6f6e1f013?w=400&h=400&fit=crop',
  },
  {
    id: 'lillet-rose',
    name: 'Lillet Rose',
    description: 'Aperitivo frances.',
    price: 35,
    category: 'Aperitivos e Licores',
    image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&h=400&fit=crop',
  },
  {
    id: 'cointreau',
    name: 'Cointreau',
    description: 'Licor de laranja.',
    price: 35,
    category: 'Aperitivos e Licores',
    image: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=400&h=400&fit=crop',
  },
  {
    id: 'baileys',
    name: 'Baileys',
    description: 'Licor cremoso.',
    price: 35,
    category: 'Aperitivos e Licores',
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=400&fit=crop',
  },

  // ── Cocktails ──────────────────────────────────────────────────────────────
  {
    id: 'jarra-clericot',
    name: 'Jarra de Clericot',
    description: 'Espumante, conhaque, licor de laranja e frutas frescas. Serve 4 pessoas.',
    price: 159,
    category: 'Cocktails',
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop',
  },
  {
    id: 'moscow-mule',
    name: 'Moscow Mule',
    description: 'Vodka, gengibre e limao.',
    price: 42,
    category: 'Cocktails',
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop',
  },
  {
    id: 'kir-royale',
    name: 'Kir Royale',
    description: 'Classico drink frances com licor de cassis e espumante.',
    price: 38,
    category: 'Cocktails',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  },
  {
    id: 'mimosa',
    name: 'Mimosa',
    description: 'Suco de laranja e espumante.',
    price: 35,
    category: 'Cocktails',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  },
  {
    id: 'negroni',
    name: 'Negroni',
    description: 'Gin, campari, vermute tinto e rodela de laranja.',
    price: 42,
    category: 'Cocktails',
    image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&h=400&fit=crop',
  },
  {
    id: 'lillet-maison',
    name: 'Lillet Maison',
    description: 'Lillet Rose, gin, limao e limao siciliano com espuma de gengibre.',
    price: 44,
    category: 'Cocktails',
    image: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=400&h=400&fit=crop',
  },
  {
    id: 'aperol-spritz',
    name: 'Aperol Spritz',
    description: 'Aperol, espumante e rodela de laranja.',
    price: 42,
    category: 'Cocktails',
    image: 'https://images.unsplash.com/photo-1533391012379-7c9a62695571?w=400&h=400&fit=crop',
  },
];
