export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  phoneNumber?: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: UserDto;
}
