export interface Client {
  id?: number;
  nombre: string;
  email: string;
  telefono: string;
  fecha_creacion?: Date;
}

export interface CreateClientRequest {
  nombre: string;
  email: string;
  telefono: string;
}

export interface UpdateClientRequest {
  nombre?: string;
  email?: string;
  telefono?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}