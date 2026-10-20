// Substitua este arquivo pela sua imagem enviada: src/assets/images/menu_burrata_custom.png
import burrataImage from './assets/images/menu_burrata_1779921120312.png';
import dessertImage from './assets/images/menu_dessert_1779921191942.png';
import raguImage from './assets/images/menu_ragu_1779921134583.png';
import salmonImage from './assets/images/menu_salmon_1779921174388.png';

export interface MenuItem {
  id: string;
  category: 'entrada' | 'prato_principal' | 'sobremesa';
  name: string;
  originalFrenchName: string;
  description: string;
  ingredients: string[];
  imageUrl: string;
}

export interface BistroTable {
  id: string;
  number: number;
  capacity: number;
  location: 'window' | 'piano' | 'alcove' | 'garden';
  locationDescription: string;
  status: 'available' | 'reserved' | 'selected';
}

export interface BookingConfirmation {
  id: string;
  customerName: string;
  partnerName: string;
  timeSlot: string;
  tableNumber: number;
  locationDescription: string;
  dietaryType?: string;
  mainCourseSelection: string;
  dessertSelection: string;
  totalPrice: number;
  customDedicationGenerated?: string;
  date: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'ent-1',
    category: 'entrada',
    name: 'Burrata cremosa Provençal',
    originalFrenchName: 'Burrata Crémeuse de Provence',
    description: 'burrata cremosa provençal.',
    ingredients: ['Burrata fresca', 'Tomates cereja assados', 'Azeite de oliva extra virgem', 'Manjericão fresco', 'Ervas de Provence'],
    imageUrl: burrataImage
  },
  {
    id: 'prato-1',
    category: 'prato_principal',
    name: 'Salmão ao molho champagne com Risoto de alho poró',
    originalFrenchName: 'Pavé de Saumon Sauce Champagne et Risotto aux Poireaux',
    description: 'Salmão grelhado, molho de champagne brut e risoto cremoso de alho poró.',
    ingredients: ['Salmão premium', 'Champagne francês', 'Arroz arbóreo', 'Alho poró fresco', 'Manteiga noisette'],
    imageUrl: salmonImage
  },
  {
    id: 'prato-2',
    category: 'prato_principal',
    name: 'Ragu de carne bordelaise com fettuccine artesanal',
    originalFrenchName: 'Ragoût de Bœuf à la Bordelaise et Pâtes Fraîches',
    description: 'Carne cozida lentamente no vinho tinto, ervas finas e fettuccine fresco da casa.',
    ingredients: ['Carne nobre cozida lentamente', 'Vinho Bordeaux selecionado', 'Fettuccine artesanal caseiro', 'Parmesão ralado fino'],
    imageUrl: raguImage
  },
  {
    id: 'sob-1',
    category: 'sobremesa',
    name: 'Mousse de chocolate',
    originalFrenchName: 'Mousse au Chocolat Belge Traditionnel',
    description: 'Mousse de chocolate meio amargo, leve e aveludado, finalizado com raspas de chocolate.',
    ingredients: ['Chocolate belga 70%', 'Creme de leite fresco', 'Flores roxas comestíveis'],
    imageUrl: dessertImage
  },
  {
    id: 'sob-2',
    category: 'sobremesa',
    name: 'Crème brûlée',
    originalFrenchName: 'Crème Brûlée Classique à la Moutarde de Vanille',
    description: 'Creme de baunilha com fava, finalizado com uma camada fina de açúcar caramelizado.',
    ingredients: ['Gemas caipiras', 'Fava de baunilha Bourbon', 'Açúcar demerara para caramelizar'],
    imageUrl: dessertImage
  }
];

export const BISTRO_TABLES: BistroTable[] = [
  {
    id: 'table-1',
    number: 1,
    capacity: 2,
    location: 'window',
    locationDescription: 'Janela francesa, com vista para a rua arborizada',
    status: 'available',
  },
  {
    id: 'table-2',
    number: 2,
    capacity: 2,
    location: 'piano',
    locationDescription: 'Próxima ao piano, para quem gosta da música mais presente',
    status: 'available',
  },
  {
    id: 'table-3',
    number: 3,
    capacity: 2,
    location: 'alcove',
    locationDescription: 'Recanto reservado, com assentos em veludo',
    status: 'available',
  },
  {
    id: 'table-4',
    number: 4,
    capacity: 2,
    location: 'garden',
    locationDescription: 'Estufa lateral, próxima aos vasos de lavanda e jasmim',
    status: 'available',
  },
  {
    id: 'table-5',
    number: 5,
    capacity: 2,
    location: 'window',
    locationDescription: 'Canto de velas, mais discreto e silencioso',
    status: 'available',
  },
  {
    id: 'table-6',
    number: 6,
    capacity: 2,
    location: 'alcove',
    locationDescription: 'Pátio interno, cercado por trepadeiras',
    status: 'available',
  }
];
