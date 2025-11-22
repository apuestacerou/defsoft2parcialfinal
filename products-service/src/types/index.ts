export interface Product {
  id?: number;
  nombre: string;
  precio: number;
  stock: number;
  fecha_creacion?: Date;
}

export interface CreateProductRequest {
  nombre: string;
  precio: number;
  stock: number;
}

export interface UpdateProductRequest {
  nombre?: string;
  precio?: number;
  stock?: number;
}

export interface UpdateStockRequest {
  stock: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}