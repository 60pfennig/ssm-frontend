export interface User {
  id: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string;
  resetPasswordExpiration?: string;
  salt?: string;
  hash?: string;
  loginAttempts?: number;
  lockUntil?: string;
  password?: string;
}
export interface Sound {
  id: string;
  name: string;
  workshop?: string | Workshop;
  lat: number;
  lng: number;
  audioFile: string | SoundMedia;
  description?: string;
  updatedAt: string;
  createdAt: string;
}
export interface Workshop {
  id: string;
  name?: string;
  updatedAt: string;
  createdAt: string;
}
export interface SoundMedia {
  id: string;
  updatedAt: string;
  createdAt: string;
  url?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
}
