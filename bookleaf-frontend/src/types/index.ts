export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'author' | 'publisher';
}

export interface Book {
  id: string;
  authorId: string;
  title: string;
  description: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Royalty {
  id: string;
  bookId: string;
  periodStart: Date;
  periodEnd: Date;
  totalSales: number;
  totalRevenue: number;
  royaltyAmount: number;
  status: 'pending' | 'paid';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'author' | 'publisher';
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
}