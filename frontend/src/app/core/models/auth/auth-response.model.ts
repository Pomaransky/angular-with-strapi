export interface AuthResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
    confirmed: boolean;
    blocked: boolean;
    role: {
      id: number;
      name: string;
      type: string;
    };
  };
}
