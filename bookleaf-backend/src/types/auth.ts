export type UserRole = 'admin' | 'author' | 'reader';

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: Date | string;
}