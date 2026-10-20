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
  totalPrice: number;
  customDedicationGenerated?: string;
  date: string;
  entradas: string[];
  pratoPrincipal: string;
  sobremesa: string;
  champagneUpgrade: boolean;
  valetUpgrade: boolean;
  flowersUpgrade: boolean;
  violinUpgrade: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  unit: string;
  created_at: string;
}
