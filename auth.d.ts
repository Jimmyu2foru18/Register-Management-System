export interface User {
  id: number;
  name: string;
  email: string;
  role: 'employee' | 'supervisor' | 'admin';
  branch_id: number;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
} 