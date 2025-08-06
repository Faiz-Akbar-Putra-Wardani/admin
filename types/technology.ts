export interface Technology {
  id: number;
  name: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TechnologyFormData {
  id?: number;
  name: string;
  image?: File | null;
}

