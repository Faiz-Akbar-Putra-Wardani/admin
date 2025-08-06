export interface Service {
  id: number;
  name: string;
  description: string;
  icon?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceFormData {
  id?: number;
  name: string;
  description: string;
  icon?: File | null;
}

