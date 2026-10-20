export interface Reservation {
  id?: string;
  reservation_date: string;
  titular1: string;
  titular2?: string;
  people: number;
  time: string;
  type: string;
  status?: 'Aguardando' | 'Confirmado' | 'Cancelado';
  phone?: string;
  email?: string;
  code?: string;
  total_spent?: number;
  created_at?: string;
  unit?: string;
}
