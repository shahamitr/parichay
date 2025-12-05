import { User, Brand, Branch, UserRole } from '../generated/prisma';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  brandId?: string;
  brand?: Brand;
  branches?: Branch[];
  lastLoginAt?: Date;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export interface AuthError {
  error: string;
}

export interface AuthContext {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  brandName?: string;
}