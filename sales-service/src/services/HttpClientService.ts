import axios, { AxiosResponse } from 'axios';
import { Client, Product, ApiResponse } from '../types';

export class HttpClientService {
  private clientsServiceUrl: string;
  private productsServiceUrl: string;

  constructor() {
    this.clientsServiceUrl = process.env.CLIENTS_SERVICE_URL || 'http://localhost:3001/api';
    this.productsServiceUrl = process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3002/api';
  }

  async getClientById(clientId: number): Promise<Client | null> {
    try {
      const response: AxiosResponse<ApiResponse<Client>> = await axios.get(
        `${this.clientsServiceUrl}/clients/${clientId}`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error calling clients service:', error);
      throw new Error('Error al consultar el servicio de clientes');
    }
  }

  async getProductById(productId: number): Promise<Product | null> {
    try {
      const response: AxiosResponse<ApiResponse<Product>> = await axios.get(
        `${this.productsServiceUrl}/products/${productId}`
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error calling products service:', error);
      throw new Error('Error al consultar el servicio de productos');
    }
  }

  async getProductsByIds(productIds: number[]): Promise<Product[]> {
    try {
      const products: Product[] = [];

      // Consultar cada producto individualmente
      for (const productId of productIds) {
        const product = await this.getProductById(productId);
        if (product) {
          products.push(product);
        }
      }

      return products;
    } catch (error) {
      console.error('Error calling products service:', error);
      throw new Error('Error al consultar productos');
    }
  }

  async updateProductStock(productId: number, newStock: number): Promise<Product | null> {
    try {
      const response: AxiosResponse<ApiResponse<Product>> = await axios.put(
        `${this.productsServiceUrl}/products/${productId}/stock`,
        { stock: newStock }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw new Error('Error al actualizar stock del producto');
    }
  }
}