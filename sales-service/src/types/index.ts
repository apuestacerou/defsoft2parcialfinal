export interface Sale {
  id?: number;
  cliente_id: number;
  total: number;
  fecha_venta?: Date;
  productos: SaleProduct[];
}

export interface SaleProduct {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
}

export interface CreateSaleRequest {
  cliente_id: number;
  productos: {
    producto_id: number;
    cantidad: number;
  }[];
}

export interface Client {
  id?: number;
  nombre: string;
  email: string;
  telefono: string;
  fecha_creacion?: Date;
}

export interface Product {
  id?: number;
  nombre: string;
  precio: number;
  stock: number;
  fecha_creacion?: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}