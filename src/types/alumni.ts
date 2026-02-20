export interface Alumni {
  id: string;
  name: string;
  role: string;
  company: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  avatar: string;
  graduationYear: number;
  industry: 'Technology' | 'Design' | 'Finance' | 'Engineering' | 'Education' | 'Architecture' | 'Other' | string;
  connectionDate?: string;
}
