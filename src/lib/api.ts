import { supabase } from './supabase';
import { MenuItem } from '../data/menu';
import { Reservation } from '../data/reservations';
import { MenuCategory } from '../types';

// MENU CATEGORIES API
export const getMenuCategories = async (unit: string): Promise<MenuCategory[]> => {
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('unit', unit)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
};

export const createMenuCategory = async (name: string, unit: string): Promise<MenuCategory> => {
  const { data, error } = await supabase
    .from('menu_categories')
    .insert([{ name, unit }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteMenuCategory = async (id: string) => {
  const { error } = await supabase.from('menu_categories').delete().eq('id', id);
  if (error) throw error;
};

// Helper: Supabase row (snake_case) -> MenuItem (camelCase)
const mapRow = (row: any): MenuItem => ({
  id: row.id,
  code: row.code,
  name: row.name,
  description: row.description,
  price: row.price,
  category: row.category,
  image: row.image,
  isPromoted: row.is_promoted,
  promotionalPrice: row.promotional_price,
  promotionLabel: row.promotion_label,
  unit: row.unit,
});

// Helper: MenuItem (camelCase) -> Supabase row (snake_case)
const mapToRow = (item: Partial<MenuItem>) => ({
  code: item.code,
  name: item.name,
  description: item.description,
  price: item.price,
  category: item.category,
  image: item.image,
  is_promoted: item.isPromoted ?? false,
  promotional_price: item.promotionalPrice ?? null,
  promotion_label: item.promotionLabel ?? null,
  unit: item.unit ?? 'sao_paulo',
});

// MENU API
export const getMenuItems = async (unit: string): Promise<MenuItem[]> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('unit', unit)
    .neq('category', 'CONFIG')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapRow);
};

export const updateMenuItem = async (item: MenuItem): Promise<MenuItem> => {
  const { data, error } = await supabase
    .from('menu_items')
    .update(mapToRow(item))
    .eq('id', item.id)
    .select()
    .single();
  if (error) throw error;
  return mapRow(data);
};

export const createMenuItem = async (item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
  const { data, error } = await supabase
    .from('menu_items')
    .insert([mapToRow(item as MenuItem)])
    .select()
    .single();
  if (error) throw error;
  return mapRow(data);
};

export const deleteMenuItem = async (id: string) => {
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) throw error;
};

export const uploadMenuItemImage = async (file: File): Promise<string> => {
  const safeName = file.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  const extension = safeName.split('.').pop() || 'jpg';
  const path = `menu/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from('menu-images')
    .upload(path, file, {
      cacheControl: '31536000',
      upsert: false,
      contentType: file.type,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from('menu-images')
    .getPublicUrl(path);

  return data.publicUrl;
};

// RESERVATIONS API
export const getReservations = async (unit?: string) => {
  let query = supabase.from('reservations').select('*');
  if (unit) {
    query = query.eq('unit', unit);
  }
  const { data, error } = await query.order('reservation_date', { ascending: true });
  if (error) throw error;
  return data;
};

export const getReservationOccupancy = async (unit: string): Promise<Record<string, number>> => {
  const { data, error } = await supabase.rpc('get_public_reservation_occupancy', { unit_param: unit });
  if (error) throw error;

  return (data || []).reduce((acc: Record<string, number>, row: { reservation_date: string; total_people: number }) => {
    acc[row.reservation_date] = Number(row.total_people) || 0;
    return acc;
  }, {});
};

export const createReservation = async (reservation: Reservation): Promise<Reservation> => {
  const { data, error } = await supabase
    .from('reservations')
    .insert([reservation])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateReservationStatus = async (id: string, status: string) => {
  const { error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
};

export const deleteReservation = async (id: string) => {
  const { error } = await supabase.from('reservations').delete().eq('id', id);
  if (error) throw error;
};

// SETTINGS API
export interface SiteSettings {
  showHistoire: boolean;
  showVinhos: boolean;
  showGaleria: boolean;
  showReservas: boolean;
  showAvaliacoes?: boolean;
  showInstagram?: boolean;
  showMenu?: boolean;
  instagramFollowers?: number;
}

export const getSiteSettings = async (unit: string): Promise<SiteSettings> => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('description')
    .eq('category', 'CONFIG')
    .eq('name', 'SITE_SETTINGS')
    .eq('unit', unit)
    .maybeSingle();

  const defaultSettings: SiteSettings = { 
    showHistoire: true, 
    showVinhos: true, 
    showGaleria: true, 
    showReservas: true,
    showAvaliacoes: true,
    showInstagram: true,
    showMenu: false, // Oculto por padrão, ativável no painel admin
    instagramFollowers: 28450
  };
  if (error || !data) return defaultSettings;
  
  try {
    const parsed = JSON.parse(data.description || '{}');
    return {
      ...defaultSettings,
      ...parsed,
      showMenu: parsed.showMenu ?? false
    };
  } catch {
    return defaultSettings;
  }
};

export const updateSiteSettings = async (settings: SiteSettings, unit: string) => {
  const { data: existing } = await supabase
    .from('menu_items')
    .select('id')
    .eq('category', 'CONFIG')
    .eq('name', 'SITE_SETTINGS')
    .eq('unit', unit)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('menu_items')
      .update({ description: JSON.stringify(settings) })
      .eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('menu_items')
      .insert({
        name: 'SITE_SETTINGS',
        category: 'CONFIG',
        description: JSON.stringify(settings),
        price: 0,
        unit: unit
      });
    if (error) throw error;
  }
};
