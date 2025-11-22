import { Transaction } from 'sequelize';
import sequelize from '../config/database';
import { SaleRepository } from '../repositories/SaleRepository';
import { HttpClientService } from './HttpClientService';
import { Sale, CreateSaleRequest, Product } from '../types';

export class SaleService {
  private saleRepository: SaleRepository;
  private httpClientService: HttpClientService;

  constructor() {
    this.saleRepository = new SaleRepository();
    this.httpClientService = new HttpClientService();
  }

  async getAllSales(): Promise<Sale[]> {
    return this.saleRepository.findAll();
  }

  async getSaleById(id: number): Promise<Sale | null> {
    if (!id || id <= 0) {
      throw new Error('ID de venta inválido');
    }
    return this.saleRepository.findById(id);
  }

  async getSalesByClientId(clienteId: number): Promise<Sale[]> {
    if (!clienteId || clienteId <= 0) {
      throw new Error('ID de cliente inválido');
    }
    return this.saleRepository.findByClientId(clienteId);
  }

  async createSale(saleData: CreateSaleRequest): Promise<Sale> {
    // Validaciones de negocio
    if (!saleData.cliente_id || saleData.cliente_id <= 0) {
      throw new Error('ID de cliente inválido');
    }

    if (!saleData.productos || saleData.productos.length === 0) {
      throw new Error('La venta debe incluir al menos un producto');
    }

    // Consultar cliente desde el microservicio de clientes
    const client = await this.httpClientService.getClientById(saleData.cliente_id);
    if (!client) {
      throw new Error('Cliente no encontrado');
    }

    // Obtener productos desde el microservicio de productos
    const productIds = saleData.productos.map(p => p.producto_id);
    const products = await this.httpClientService.getProductsByIds(productIds);

    if (products.length !== productIds.length) {
      throw new Error('Uno o más productos no existen');
    }

    // Crear mapa de productos para fácil acceso
    const productMap = new Map<number, Product>();
    products.forEach(product => productMap.set(product.id!, product));

    // Validar stock y calcular total
    let total = 0;
    for (const saleProduct of saleData.productos) {
      const product = productMap.get(saleProduct.producto_id);
      if (!product) {
        throw new Error(`Producto con ID ${saleProduct.producto_id} no encontrado`);
      }

      if (saleProduct.cantidad <= 0) {
        throw new Error(`Cantidad inválida para producto ${product.nombre}`);
      }

      if (product.stock < saleProduct.cantidad) {
        throw new Error(`Stock insuficiente para producto ${product.nombre}. Disponible: ${product.stock}`);
      }

      total += product.precio * saleProduct.cantidad;
    }

    // Usar transacción para asegurar atomicidad
    const transaction = await sequelize.transaction();

    try {
      // Crear la venta
      const sale = await this.saleRepository.create(saleData, transaction);

      // Actualizar precios en los productos de la venta y reducir stock
      for (const saleProduct of saleData.productos) {
        const product = productMap.get(saleProduct.producto_id)!;
        const newStock = product.stock - saleProduct.cantidad;

        // Actualizar stock en el microservicio de productos
        await this.httpClientService.updateProductStock(saleProduct.producto_id, newStock);
      }

      // Actualizar el total de la venta
      await this.saleRepository.updateTotal(sale.id!, total, transaction);

      await transaction.commit();

      // Retornar la venta completa
      return this.getSaleById(sale.id!) as Promise<Sale>;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteSale(id: number): Promise<boolean> {
    if (!id || id <= 0) {
      throw new Error('ID de venta inválido');
    }

    // Verificar que la venta existe
    const existingSale = await this.saleRepository.findById(id);
    if (!existingSale) {
      throw new Error('Venta no encontrada');
    }

    return this.saleRepository.delete(id);
  }
}