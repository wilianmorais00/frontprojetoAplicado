export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roles?: string[];  // ex.: ['admin']
}
