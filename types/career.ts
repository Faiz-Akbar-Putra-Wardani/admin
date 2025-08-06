export interface Career {
  id: number;
  title: string;
  description: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CareerFormData {
  id?: number;
  title: string;
  description: string;
  image?: File | null;
}

