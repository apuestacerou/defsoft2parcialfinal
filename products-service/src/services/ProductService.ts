import { ProductRepository } from '../repositories/ProductRepository';
import { Product, CreateProductRequest, UpdateProductRequest } from '../types';

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getProductById(id: number): Promise<Product | null> {
    if (!id || id <= 0) {
      throw new Error('ID de producto inválido');
    }
    return this.productRepository.findById(id);
  }

  async createProduct(productData: CreateProductRequest): Promise<Product> {
    // Validaciones de negocio
    if (!productData.nombre?.trim()) {
      throw new Error('El nombre del producto es requerido');
    }

    if (!productData.precio || productData.precio <= 0) {
      throw new Error('El precio del producto debe ser mayor a 0');
    }

    if (productData.stock < 0) {
      throw new Error('El stock del producto no puede ser negativo');
    }

    return this.productRepository.create(productData);
  }

  async updateProduct(id: number, productData: UpdateProductRequest): Promise<Product | null> {
    if (!id || id <= 0) {
      throw new Error('ID de producto inválido');
    }

    // Verificar que el producto existe
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new Error('Producto no encontrado');
    }

    // Validaciones de negocio
    if (productData.precio !== undefined && productData.precio <= 0) {
      throw new Error('El precio del producto debe ser mayor a 0');
    }

    if (productData.stock !== undefined && productData.stock < 0) {
      throw new Error('El stock del producto no puede ser negativo');
    }

    return this.productRepository.update(id, productData);
  }

  async updateProductStock(id: number, newStock: number): Promise<Product | null> {
    if (!id || id <= 0) {
      throw new Error('ID de producto inválido');
    }

    if (newStock < 0) {
      throw new Error('El stock del producto no puede ser negativo');
    }

    // Verificar que el producto existe
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new Error('Producto no encontrado');
    }

    return this.productRepository.updateStock(id, newStock);
  }

  async deleteProduct(id: number): Promise<boolean> {
    if (!id || id <= 0) {
      throw new Error('ID de producto inválido');
    }

    // Verificar que el producto existe
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new Error('Producto no encontrado');
    }

    return this.productRepository.delete(id);
  }

  async getProductsByIds(ids: number[]): Promise<Product[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    // Validar que todos los IDs sean válidos
    const invalidIds = ids.filter(id => !id || id <= 0);
    if (invalidIds.length > 0) {
      throw new Error('IDs de productos inválidos');
    }

    return this.productRepository.findByIds(ids);
  }
}