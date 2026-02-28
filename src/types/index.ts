export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'pending' | 'archived';
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateItemInput {
  name: string;
  description: string;
  status: Item['status'];
  category?: string;
  tags?: string[];
}

export interface UpdateItemInput extends Partial<CreateItemInput> {
  id: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
