export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  priceType: 'day' | 'month' | 'year';
  location: string;
  district: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  features: string[];
  realtorId: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: 'client' | 'realtor' | 'admin';
  avatar?: string;
  whatsapp?: string;
  telegram?: string;
  address?: string;
  isApproved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Chat {
  id: string;
  propertyId: string;
  clientId: string;
  realtorId: string;
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  session: any;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, userType: 'client' | 'realtor') => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isLoading: boolean;
  favorites: string[];
  toggleFavorite: (propertyId: string) => Promise<void>;
}

export type ViewType = 'home' | 'dashboard' | 'property' | 'add-property' | 'catalog' | 'edit-property' | 'profile-settings' | 'chat' | 'favorites' | 'properties' | 'messages' | 'admin' | 'admin-properties' | 'admin-users';