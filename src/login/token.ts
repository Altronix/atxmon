export interface Token {
  id: number;
  role: number;
  email: string;
}

export interface RefreshToken extends Token {
  tokenVersion: number;
}
